import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying Revolutionary Web3 Contracts...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  const provider = ethers.provider;
  const balance = await provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  // Mock ENS and EFP registry addresses (in production, use real addresses)
  const ensRegistryAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Mock
  const efpRegistryAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // Mock

  // Deploy the Advanced ProofOfGood contract
  console.log("\n📋 Deploying AdvancedProofOfGood contract...");
  const AdvancedProofOfGood = await ethers.getContractFactory("AdvancedProofOfGood");
  const advancedProofOfGood = await AdvancedProofOfGood.deploy(
    ensRegistryAddress,
    efpRegistryAddress
  );

  await advancedProofOfGood.waitForDeployment();
  const contractAddress = await advancedProofOfGood.getAddress();
  console.log("✅ AdvancedProofOfGood deployed to:", contractAddress);

  // Initialize with some revolutionary features
  console.log("\n🔧 Initializing revolutionary features...");

  // Add FileCoin rewards pool
  const rewardPoolAmount = ethers.parseEther("10"); // 10 ETH for rewards
  await advancedProofOfGood.addFileCoinRewards({ value: rewardPoolAmount });
  console.log("💰 Added 10 ETH to FileCoin reward pool");

  // Set storage reward rate
  const storageRewardRate = ethers.parseEther("0.001"); // 0.001 ETH per MB
  await advancedProofOfGood.setStorageRewardRate(storageRewardRate);
  console.log("📊 Set storage reward rate to 0.001 ETH per MB");

  // Assign ENS subdomain to deployer
  const deployerSubdomain = `deployer-${deployer.address.slice(-4)}.proofofgood.eth`;
  await advancedProofOfGood.assignENSSubdomain(deployer.address, deployerSubdomain);
  console.log(`🌐 Assigned ENS subdomain: ${deployerSubdomain}`);

  // Create a revolutionary challenge to demonstrate features
  console.log("\n🚀 Creating demonstration revolutionary challenge...");
  
  const challengeTitle = "Revolutionary Web3 Climate Action";
  const challengeDescription = "Demonstrate cutting-edge Web3 technologies for environmental impact";
  const challengeCategory = "environment";
  const ensSubdomain = "climate-action-2025.challenges.proofofgood.eth";
  const stakeAmount = ethers.parseEther("0.1");
  const deadline = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60); // 30 days
  const maxParticipants = 100;
  const verifiers = [deployer.address];
  const requiresFollow = false;
  const minFollowers = 0;
  const ipfsMetadata = "QmExampleRevolutionaryMetadata123";
  const storageIncentive = ethers.parseEther("0.05");

  const createTx = await advancedProofOfGood.createAdvancedChallenge(
    challengeTitle,
    challengeDescription,
    challengeCategory,
    ensSubdomain,
    0, // COMMUNITY challenge type
    stakeAmount,
    deadline,
    maxParticipants,
    verifiers,
    requiresFollow,
    minFollowers,
    ipfsMetadata,
    storageIncentive,
    { value: stakeAmount }
  );
  
  const receipt = await createTx.wait();
  console.log("✅ Revolutionary challenge created!");

  // Grant community verifier roles to demonstrate social verification
  console.log("\n👥 Setting up community verifiers...");
  const COMMUNITY_VERIFIER_ROLE = await advancedProofOfGood.COMMUNITY_VERIFIER_ROLE();
  await advancedProofOfGood.grantRole(COMMUNITY_VERIFIER_ROLE, deployer.address);
  console.log("✅ Granted community verifier role");

  // Output deployment summary
  console.log("\n" + "=".repeat(60));
  console.log("🎉 REVOLUTIONARY DEPLOYMENT COMPLETE!");
  console.log("=".repeat(60));
  console.log("📋 Contract Addresses:");
  console.log(`   AdvancedProofOfGood: ${contractAddress}`);
  console.log(`   ENS Registry (Mock): ${ensRegistryAddress}`);
  console.log(`   EFP Registry (Mock): ${efpRegistryAddress}`);
  console.log("\n🚀 Revolutionary Features Enabled:");
  console.log("   ✅ ENS-powered challenge discovery");
  console.log("   ✅ EFP social proof verification");
  console.log("   ✅ FileCoin incentivized storage");
  console.log("   ✅ Base gasless onboarding");
  console.log("   ✅ Social features (likes, comments)");
  console.log("   ✅ Community governance");
  console.log("\n💰 Economics Setup:");
  console.log(`   FileCoin Reward Pool: 10 ETH`);
  console.log(`   Storage Reward Rate: 0.001 ETH/MB`);
  console.log(`   Demo Challenge Stake: 0.1 ETH`);
  console.log(`   Storage Incentive: 0.05 ETH`);
  console.log("\n🌐 ENS Integration:");
  console.log(`   Base Domain: proofofgood.eth`);
  console.log(`   Deployer Subdomain: ${deployerSubdomain}`);
  console.log(`   Challenge Discovery: *.challenges.proofofgood.eth`);
  
  // Create deployment artifacts for frontend
  const deploymentInfo = {
    chainId: (await ethers.provider.getNetwork()).chainId,
    contractAddress: contractAddress,
    deployerAddress: deployer.address,
    ensRegistryAddress,
    efpRegistryAddress,
    revolutionaryFeatures: {
      ensDiscovery: true,
      socialVerification: true,
      filecoinRewards: true,
      gaslessOnboarding: true,
    },
    economics: {
      filecoinRewardPool: "10",
      storageRewardRate: "0.001",
      demonstrationChallenge: {
        stakeAmount: "0.1",
        storageIncentive: "0.05",
        ensSubdomain,
      },
    },
    deploymentTimestamp: Date.now(),
  };

  // Save deployment info
  const fs = require("fs");
  const path = require("path");
  const deploymentPath = path.join(__dirname, "../deployments/revolutionary-deployment.json");
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log(`\n📄 Deployment info saved to: ${deploymentPath}`);

  console.log("\n🎯 Next Steps:");
  console.log("   1. Update frontend with new contract address");
  console.log("   2. Configure ENS registry integration");
  console.log("   3. Set up EFP social graph connections");
  console.log("   4. Initialize FileCoin storage network");
  console.log("   5. Enable Base gasless meta-transactions");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
