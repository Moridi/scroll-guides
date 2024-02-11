import { ethers } from "hardhat";

async function main() {
  // Get the contract factory for the Ranker contract
  const Ranker = await ethers.getContractFactory("Ranker");

  // Deploy the contract without any constructor arguments
  const ranker = await Ranker.deploy();

  // Wait for the contract to be deployed
  await ranker.deployed();

  console.log(`Ranker deployed to ${ranker.address}`);
  console.log(`Block explorer URL: https://sepolia.scrollscan.com/address/${ranker.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
