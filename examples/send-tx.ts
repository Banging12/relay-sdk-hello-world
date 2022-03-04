import hre from "hardhat";
import { Interface } from "ethers/lib/utils";
import { RelaySDK } from "@gelatonetwork/relay-sdk";
import helloWorldAbi from "../contracts/abis/HelloWorld.json";
import { getAddressBookByNetwork } from "../constants";
import { BigNumber } from "ethers/lib/ethers";

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
  const relayFees = BigNumber.from(21000);
  const data = helloWorld.encodeFunctionData("helloWorld", [relayFees, ETH]);

  // Send our tx to Gelato Relay
  console.log(`Sending Hello World tx to Gelato Relay...`);
  const relayTx = await RelaySDK.sendRelayTransaction(
    chainId,
    HELLO_WORLD, // Smart contract address
    data,
    ETH, // Payment token address
    relayFees
  );
  console.log(`RelayTransaction Id: ${relayTx.taskId}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
