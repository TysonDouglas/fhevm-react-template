require("dotenv/config");
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("========================================");
  console.log("Anonymous Athlete Selection Deployment");
  console.log("========================================\n");

  const [deployer] = await hre.ethers.getSigners();
  const network = hre.network.name;

  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)), "ETH");
  console.log("Network:", network);
  console.log("Chain ID:", (await hre.ethers.provider.getNetwork()).chainId.toString());
  console.log("");

  // Deploy the contract
  console.log("Deploying AnonymousAthleteSelection contract...");
  const AnonymousAthleteSelection = await hre.ethers.getContractFactory("AnonymousAthleteSelection");

  const contract = await AnonymousAthleteSelection.deploy();
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log("✓ AnonymousAthleteSelection deployed to:", contractAddress);
  console.log("");

  // Get deployment transaction details
  const deploymentTx = contract.deploymentTransaction();
  console.log("Deployment transaction hash:", deploymentTx.hash);
  console.log("");

  // Wait for confirmations
  console.log("Waiting for confirmations...");
  const receipt = await deploymentTx.wait(5);
  console.log("✓ Contract confirmed in block:", receipt.blockNumber);
  console.log("");

  // Verify contract details
  const selectionCommittee = await contract.selectionCommittee();
  const currentSelectionId = await contract.currentSelectionId();

  console.log("Contract Initialization:");
  console.log("- Selection Committee:", selectionCommittee);
  console.log("- Current Selection ID:", currentSelectionId.toString());
  console.log("");

  // Save deployment information
  const deploymentInfo = {
    network: network,
    chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
    contractAddress: contractAddress,
    deployer: deployer.address,
    deploymentBlock: receipt.blockNumber,
    deploymentTx: deploymentTx.hash,
    timestamp: new Date().toISOString(),
    selectionCommittee: selectionCommittee,
    currentSelectionId: currentSelectionId.toString(),
  };

  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }

  // Save deployment info to file
  const deploymentFile = path.join(deploymentsDir, `${network}-deployment.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log("✓ Deployment information saved to:", deploymentFile);
  console.log("");

  // Display network-specific information
  if (network === "sepolia") {
    console.log("========================================");
    console.log("Sepolia Network Information");
    console.log("========================================");
    console.log("Etherscan URL:", `https://sepolia.etherscan.io/address/${contractAddress}`);
    console.log("");
    console.log("To verify the contract, run:");
    console.log(`npm run verify`);
    console.log("");
  }

  console.log("========================================");
  console.log("Deployment Summary");
  console.log("========================================");
  console.log("Contract Address:", contractAddress);
  console.log("Network:", network);
  console.log("Deployer:", deployer.address);
  console.log("Block Number:", receipt.blockNumber);
  console.log("");
  console.log("Next Steps:");
  console.log("1. Update your .env file with CONTRACT_ADDRESS=" + contractAddress);
  console.log("2. Verify the contract on Etherscan (if on Sepolia): npm run verify");
  console.log("3. Interact with the contract: npm run interact");
  console.log("========================================");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
