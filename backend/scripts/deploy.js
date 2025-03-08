/**
 * Hardhat Deployment Script
 * Deploys GhostFund smart contracts to the blockchain
 */

// Import Hardhat runtime environment
const hre = require("hardhat");

async function main() {
  console.log("Starting deployment of GhostFund contracts...");

  // Get the contract factory
  const GhostFund = await hre.ethers.getContractFactory("GhostFund");
  const Mixers = await hre.ethers.getContractFactory("Mixers");

  // Deploy GhostFund contract
  console.log("Deploying GhostFund contract...");
  const ghostFund = await GhostFund.deploy();
  await ghostFund.deployed();
  console.log(`GhostFund contract deployed to: ${ghostFund.address}`);

  // Deploy Mixers contract
  console.log("Deploying Mixers contract...");
  const mixers = await Mixers.deploy(ghostFund.address);
  await mixers.deployed();
  console.log(`Mixers contract deployed to: ${mixers.address}`);

  // Set the Mixers contract address in GhostFund
  console.log("Setting Mixers contract in GhostFund...");
  const setMixersTx = await ghostFund.setMixersContract(mixers.address);
  await setMixersTx.wait();
  console.log("Mixers contract set in GhostFund");

  // Verify contracts on Etherscan (if not on a local network)
  if (network.name !== "hardhat" && network.name !== "localhost") {
    console.log("Waiting for block confirmations...");
    // Wait for 6 block confirmations
    await ghostFund.deployTransaction.wait(6);
    await mixers.deployTransaction.wait(6);
    
    console.log("Verifying contracts on Etherscan...");
    
    // Verify GhostFund contract
    await hre.run("verify:verify", {
      address: ghostFund.address,
      constructorArguments: [],
    });
    
    // Verify Mixers contract
    await hre.run("verify:verify", {
      address: mixers.address,
      constructorArguments: [ghostFund.address],
    });
  }

  console.log("Deployment completed successfully!");
  
  // Return the deployed contract addresses
  return {
    ghostFundAddress: ghostFund.address,
    mixersAddress: mixers.address
  };
}

// Execute the deployment
main()
  .then((deployedAddresses) => {
    console.log("Deployed contract addresses:", deployedAddresses);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error during deployment:", error);
    process.exit(1);
  }); 