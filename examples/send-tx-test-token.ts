/* eslint-disable no-case-declarations */
import hre from "hardhat";
import { RelaySDK } from "@gelatonetwork/relay-sdk";
import helloWorldAbi from "../contracts/abis/HelloWorld.json";
import { getAddressBookByNetwork } from "../constants";
import { BigNumber, Contract } from "ethers";
import { TransactionStatus } from "@gelatonetwork/relay-sdk";
import { TaskState } from "@gelatonetwork/relay-sdk";
import { setTimeout as sleep } from "timers/promises";

async function main() {
  const { USDC, HELLO_WORLD, GELATO_RELAY_TRANSIT } = getAddressBookByNetwork(hre.network.name);

  // Verify that current network is supported by Gelato Multichain Relay
  const chainId = hre.network.config.chainId ?? 0;
  const isChainSupported = await RelaySDK.isChainSupported(chainId);
  if (!isChainSupported) {
    console.log("ChainId not supported");
    return;
  }

  // Estimate gas limit for our helloWorld call
  const helloWorld = new Contract(HELLO_WORLD, helloWorldAbi, hre.ethers.provider);
  const gasLimit: BigNumber = await helloWorld
    .connect(GELATO_RELAY_TRANSIT) // Gelato relay transit will be our contract caller
    .estimateGas.helloWorld(1, USDC);

  // Encode our function call
  const data = helloWorld.interface.encodeFunctionData("helloWorld", [gasLimit, USDC]);

  // Send our tx to Gelato Relay using
  console.log(`Sending Hello World tx to Gelato Relay...`);
  const relayTx = await RelaySDK.sendRelayTransaction(
    chainId,
    HELLO_WORLD, // Smart contract address
    data,
    USDC, // Payment token address
    gasLimit
  );
  console.log(`RelayTransaction Id: ${relayTx.taskId}`);

  let isComplete = false;
  do {
    const status: TransactionStatus | undefined = await RelaySDK.getTaskStatus(relayTx.taskId);
    if (status) {
      const { taskState, lastCheck } = status as TransactionStatus;
      switch (taskState) {
        case TaskState.CheckPending:
          console.log(`> Task pending relayer verification`);
          if (lastCheck?.message) console.log(`>> Last check message: ${lastCheck.message}`);
          if (lastCheck?.reason) console.log(`>> Last check reason: ${lastCheck.reason}`);
          break;
        case TaskState.ExecPending:
          console.log(`> Task queued for execution`);
          break;
        case TaskState.ExecSuccess:
          const hash = status.execution?.transactionHash;
          console.log(`> Task successfully executed, tx hash: ${hash}`);
          break;
        case TaskState.ExecReverted:
          console.log(`> Task was reverted with message: ${lastCheck?.message}`);
          break;
        case TaskState.Cancelled:
          console.log(`> Task was cancelled with message: ${lastCheck?.message}`);
          if (lastCheck?.reason) console.log(`>> Cancel reason: ${lastCheck.reason}`);
          break;
        default:
          console.log(`> Task status: ${taskState}`);
      }
      isComplete = [TaskState.Cancelled, TaskState.ExecSuccess, TaskState.ExecReverted].includes(taskState);
    } else {
      console.log(`> Task status not available yet`);
    }
    await sleep(5000);
  } while (!isComplete);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
