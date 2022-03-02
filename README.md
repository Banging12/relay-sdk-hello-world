# Gelato Relay SDK Hello World

Send Hello World transactions using Gelato Relay SDK
<br/><br/>


## Prerequisite

- Check [relay-sdk](https://www.npmjs.com/package/@gelatonetwork/relay-sdk) npm package page to know more about how to use the Gelato's Relay SDK
<br/><br/>


## How to use

1. Install project dependencies:
```
yarn install
```

2. Create a `.env` file with your provider URL to use on `ropsten` network:
```
ALCHEMY_ID=
```

## Examples

## 1. Send a transaction using Relay SDK

- First, use `RelaySDK.isChainSupported` to verify that your network is supported by Gelato Relay:
```ts
const isChainSupported = await RelaySDK.isChainSupported(chainId);
if (!isChainSupported) {
  console.log("ChainId not supported");
  return;
}
```

- Then, use `RelaySDK.sendRelayTransaction` to submit your transaction to Gelato Relay:
```ts
const relayTx = await RelaySDK.sendRelayTransaction(
  chainId,
  address, // Smart contract address
  data,
  ETH, // Payment token address
  relayFees
);
```

- Check the example source code [`examples/send-tx.ts`](./examples/send-tx.ts) and try it yourself using:
```
yarn send-tx --network ropsten
```
<br/>

## 2. Use Relay's Oracle to estimate fees

- First, use `RelaySDK.isOracleActive` to check if Gelato provides an oracle on your network:
```ts
const isActiveOracle = await RelaySDK.isOracleActive(chainId);
if (!isActiveOracle) {
  console.log("Oracle is not active on this network");
  return;
}
```

- Then, use `RelaySDK.getEstimatedFee` to estimate the fees to pay for a given gas limit:
```ts
const estimatedFees: BigNumber = await RelaySDK.getEstimatedFee(
  chainId,
  ETH,
  gasLimit,
  isHighPriority // Set to true for high priority fees
);
```

- Check the example source code [`examples/send-tx-oracle.ts`](./examples/send-tx-oracle.ts) and try it yourself using:
```
yarn send-tx-oracle --network matic
```
<br/>

## 3. Pay for transaction using USDC token

- First, use `RelaySDK.getPaymentTokens` to get the list of authorized payment tokens on your network:
```ts
const authorizedTokens: string[] = await RelaySDK.getPaymentTokens(chainId);
if (!authorizedTokens.includes(USDC)) {
  console.log("Payment token not authorized on this network");
  return;
}
```

- Then, use `RelaySDK.getEstimatedFee` to estimate the fees in your payment token:
```ts
const estimatedFees: BigNumber = await RelaySDK.getEstimatedFee(
  chainId,
  USDC, // Payment token address
  gasLimit,
  isHighPriority // Set to true for high priority fees
);
```

- Check the example source code [`examples/send-tx-usdc.ts`](./examples/send-tx-usdc.ts) and try it yourself using:
```
yarn send-tx-usdc --network matic
```
<br/>
