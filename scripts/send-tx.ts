import hre from "hardhat";
import { Interface } from "ethers/lib/utils";
import { RelaySDK } from "@gelatonetwork/relay-sdk";
import helloWorldContract from "../contracts/abis/HelloWorld.json";
import { ETH_ADDRESS } from "../constants";

async function main() {
  // Verify that current network is supported by Gelato Multichain Relay
  const chainId = hre.network.config.chainId ?? 0;
  const isChainSupported = await RelaySDK.isChainSupported(chainId);
  if (!isChainSupported) {
    console.log("ChainId not supported");
    return;
  }

  // Generate the function data
  const helloWorldInterface = new Interface(helloWorldContract.abi);
  const relayFees = 21000;
  const data = helloWorldInterface.encodeFunctionData("helloWorld", [
    relayFees,
  ]);

  // Send our tx to Gelato Relay
  console.log(`Sending Hello World tx to Gelato Relay...`);
  const relayTx = await RelaySDK.sendRelayTransaction(
    chainId,
    helloWorldContract.address,
    data,
    ETH_ADDRESS, // Payment token
    relayFees.toString()
  );
  console.log(`RelayTransaction Id: ${relayTx.taskId}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
