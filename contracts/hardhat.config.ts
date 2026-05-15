import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000";
const POLYGON_ZKEVM_TESTNET_RPC = process.env.POLYGON_ZKEVM_TESTNET_RPC || "https://rpc.public.zkevm-testnet.com";
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY || "";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      viaIR: false
    }
  },
  networks: {
    hardhat: {
      chainId: 31337
    },
    polygonZkEvmTestnet: {
      url: POLYGON_ZKEVM_TESTNET_RPC,
      chainId: 1442,
      accounts: [PRIVATE_KEY]
    },
    polygonZkEvm: {
      url: process.env.POLYGON_ZKEVM_RPC || "https://zkevm-rpc.com",
      chainId: 1101,
      accounts: [PRIVATE_KEY]
    }
  },
  etherscan: {
    customChains: [
      {
        network: "polygonZkEvmTestnet",
        chainId: 1442,
        urls: {
          apiURL: "https://api-testnet.polygonscan.com/api",
          browserURL: "https://testnet.polygonscan.com"
        }
      },
      {
        network: "polygonZkEvm",
        chainId: 1101,
        urls: {
          apiURL: "https://api.polygonscan.com/api",
          browserURL: "https://polygonscan.com"
        }
      }
    ],
    apiKey: {
      polygonZkEvmTestnet: POLYGONSCAN_API_KEY,
      polygonZkEvm: POLYGONSCAN_API_KEY
    }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD"
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  // 禁用 sourcify 以避免 HH1006 错误
  sourcify: {
    enabled: false
  }
};

export default config;
