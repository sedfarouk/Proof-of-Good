import { ethers } from "hardhat";
import { ProofOfGood__factory } from "../typechain-types";
import { verifyContract } from "../utils/verify";

async function main() {
  console.log("📡 Deploying to Base Sepolia...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("🔑 Deploying with account:", deployer.address);

  // Deploy ProofOfGood contract
  const proofOfGoodFactory = await ethers.getContractFactory("ProofOfGood");
  const proofOfGood = await proofOfGoodFactory.deploy();
  await proofOfGood.waitForDeployment();
  
  const proofOfGoodAddress = await proofOfGood.getAddress();
  console.log("🚀 ProofOfGood deployed to:", proofOfGoodAddress);

  // Deploy ENSProfileManager
  const ensProfileManagerFactory = await ethers.getContractFactory("ENSProfileManager");
  const ensProfileManager = await ensProfileManagerFactory.deploy();
  await ensProfileManager.waitForDeployment();

  const ensProfileManagerAddress = await ensProfileManager.getAddress();
  console.log("🚀 ENSProfileManager deployed to:", ensProfileManagerAddress);

  // Deploy CommunityBadges
  const communityBadgesFactory = await ethers.getContractFactory("CommunityBadges");
  const communityBadges = await communityBadgesFactory.deploy();
  await communityBadges.waitForDeployment();

  const communityBadgesAddress = await communityBadges.getAddress();
  console.log("🚀 CommunityBadges deployed to:", communityBadgesAddress);

  // Deploy AdvancedProofOfGood
  const advancedProofOfGoodFactory = await ethers.getContractFactory("AdvancedProofOfGood");
  // Using placeholder addresses for ENS and EFP registries on Base Sepolia
  const ensRegistryAddress = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"; // ENS Registry placeholder
  const efpRegistryAddress = "0x0000000000000000000000000000000000000001"; // EFP Registry placeholder
  const advancedProofOfGood = await advancedProofOfGoodFactory.deploy(ensRegistryAddress, efpRegistryAddress);
  await advancedProofOfGood.waitForDeployment();

  const advancedProofOfGoodAddress = await advancedProofOfGood.getAddress();
  console.log("🚀 AdvancedProofOfGood deployed to:", advancedProofOfGoodAddress);

  // Initialize contracts
  // ProofOfGood contract doesn't require initialization after deployment
  
  console.log("✅ Contracts initialized");

  // Verify contracts on Basescan
  console.log("🔍 Verifying contracts on Basescan...");
  
  try {
    await verifyContract(proofOfGoodAddress, []);
    await verifyContract(ensProfileManagerAddress, []);
    await verifyContract(communityBadgesAddress, []);
    await verifyContract(advancedProofOfGoodAddress, [ensRegistryAddress, efpRegistryAddress]);
    console.log("✅ Contracts verified successfully");
  } catch (error) {
    console.log("❌ Error verifying contracts:", error);
  }

  console.log("📝 Deployment Summary:");
  console.log("----------------------");
  console.log("ProofOfGood:", proofOfGoodAddress);
  console.log("ENSProfileManager:", ensProfileManagerAddress);
  console.log("CommunityBadges:", communityBadgesAddress);
  console.log("AdvancedProofOfGood:", advancedProofOfGoodAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
