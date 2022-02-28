import { HardhatUserConfig } from "hardhat/config";

// PLUGINS
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";

// Process Env Variables
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });

const PROVIDER_URL = process.env.PROVIDER_URL ?? "";

const config: HardhatUserConfig = {
  defaultNetwork: "ropsten",

  networks: {
    hardhat: {
      forking: {
        url: PROVIDER_URL,
        blockNumber: 10911528,
      },
    },

    ropsten: {
      chainId: 3,
      url: PROVIDER_URL,
    },
  },

  solidity: {
    compilers: [
      {
        version: "0.8.7",
        settings: {
          optimizer: { enabled: true, runs: 200 },
        },
      },
    ],
  },
};

export default config;
