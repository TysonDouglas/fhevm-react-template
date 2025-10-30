require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("dotenv/config");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
        details: {
          yul: true,
          yulDetails: {
            stackAllocation: true,
            optimizerSteps: "dhfoDgvulfnTUtnIf"
          }
        }
      },
      evmVersion: "cancun",
      viaIR: false, // Security: Avoid experimental features in production
      metadata: {
        bytecodeHash: "ipfs"
      }
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
      // Performance: Increase block gas limit for testing
      blockGasLimit: 30000000,
      // Security: Enable mining automation
      mining: {
        auto: true,
        interval: 0
      }
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111,
      // Security: Add timeout and gas settings
      timeout: 60000,
      gasPrice: "auto",
      gas: "auto"
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
      timeout: 60000
    },
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY || "",
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 40000,
    // Performance: Enable parallel testing
    parallel: false, // Set to true if tests are independent
    reporter: process.env.CI ? "json" : "spec"
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD",
    outputFile: process.env.CI ? "gas-report.txt" : undefined,
    noColors: process.env.CI ? true : false,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY || "",
    gasPriceApi: "https://api.etherscan.io/api?module=proxy&action=eth_gasPrice",
    token: "ETH",
    showTimeSpent: true,
    showMethodSig: true,
    // Performance: Track gas usage per method
    excludeContracts: [],
    src: "./contracts"
  },
  // Security: Contract size limits
  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
  }
};
