/* eslint-disable @typescript-eslint/naming-convention */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getAddressBookByNetwork = (network: string) => {
  switch (network) {
    case "matic":
      return {
        GELATO: "0x7598e84B2E114AB62CAB288CE5f7d5f6bad35BbA",
        GELATO_RELAY: "0x837F0BB41d8cA7b051408aD312767e016622ed0b",
        GELATO_RELAY_TRANSIT: "0xAe92F11c3c8BA455e858Fbd50AA29B2db8E57121",
        HELLO_WORLD: "0xc952fAbdeaaea1da8b6102d49A6DFb2dd88DBcb9",
        ETH: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // MATIC
        USDC: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      };

    case "ropsten":
      return {
        GELATO: "0xCc4CcD69D31F9FfDBD3BFfDe49c6aA886DaB98d9",
        GELATO_RELAY: "0x93774A36b4eF8ed5a65Edd9dB00235e7d3Cca4Cc",
        GELATO_RELAY_TRANSIT: "0x1908238d294058722D9c27B3DCaffA326F05eDA4",
        HELLO_WORLD: "0xF09DF328F6f4aec94130356925d07e5A97Af5fdC",
        ETH: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        USDC: "0x07865c6e87b9f70255377e024ace6630c1eaa37f",
      };

    default: {
      throw new Error(`addressBooks: network: ${network} not supported`);
    }
  }
};
