/* eslint-disable no-case-declarations */
import hre from "hardhat";
import { Interface } from "ethers/lib/utils";
import { RelaySDK, TransactionStatus, TaskState } from "@gelatonetwork/relay-sdk";
import helloWorldAbi from "../contracts/abis/HelloWorld.json";
import { getAddressBookByNetwork } from "../constants";
import { BigNumber } from "ethers/lib/ethers";
import { setTimeout as sleep } from "timers/promises";

async function main() {
  const { ETH, HELLO_WORLD } = getAddressBookByNetwork(hre.network.name);

  // Verify that current network is supported by Gelato Multichain Relay
  const chainId = hre.network.config.chainId ?? 0;
  const isChainSupported = await RelaySDK.isChainSupported(chainId);
  if (!isChainSupported) {
    console.log("ChainId not supported");
    return;
  }

  // Generate the function data
  const helloWorld = new Interface(helloWorldAbi);
  const relayFees = BigNumber.from(1);
  const data = helloWorld.encodeFunctionData("helloWorld", [relayFees, ETH]);

  // Send our tx to Gelato Relay
  console.log(`Sending Hello World tx to Gelato Relay...`);
  const { taskId } = await RelaySDK.sendRelayTransaction(
    chainId,
    HELLO_WORLD, // Smart contract address
    data,
    ETH, // Payment token address
    relayFees
  );
  console.log(`RelayTransaction Id: ${taskId}`);

  // Fetch task status to wait for its execution
  let isComplete = false;
  do {
    const status: TransactionStatus | undefined = await RelaySDK.getTaskStatus(taskId);
    if (status) {
      const { taskState, lastCheck } = status as TransactionStatus;
      switch (taskState) {
        case TaskState.CheckPending:
          console.log(`> Task pending relayer verification`);
          if (lastCheck) console.log(`>> Last check message: ${lastCheck.message}`);
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
