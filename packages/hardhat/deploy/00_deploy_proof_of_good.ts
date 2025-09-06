import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

const deployProofOfGood: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log("Deploying contracts with the account:", deployer);

  // Deploy TestToken first
  await deploy("TestToken", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  // Deploy ENSProfileManager
  await deploy("ENSProfileManager", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  // Deploy CommunityBadges
  await deploy("CommunityBadges", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  // Deploy MetaTransactions
  await deploy("MetaTransactions", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  // Deploy main ProofOfGood contract
  await deploy("ProofOfGood", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  // Get contract instances
  const proofOfGoodContract = await hre.ethers.getContract<Contract>("ProofOfGood", deployer);
  const ensProfileManagerContract = await hre.ethers.getContract<Contract>("ENSProfileManager", deployer);
  const communityBadgesContract = await hre.ethers.getContract<Contract>("CommunityBadges", deployer);
  const metaTransactionsContract = await hre.ethers.getContract<Contract>("MetaTransactions", deployer);
  const testTokenContract = await hre.ethers.getContract<Contract>("TestToken", deployer);

  // Grant roles and set up initial configuration
  console.log("Setting up initial configuration...");

  // Grant MINTER_ROLE to ProofOfGood contract for CommunityBadges
  const MINTER_ROLE = await communityBadgesContract.MINTER_ROLE();
  await communityBadgesContract.grantRole(MINTER_ROLE, await proofOfGoodContract.getAddress());

  // Grant ADMIN_ROLE to ProofOfGood contract for ENSProfileManager
  const ADMIN_ROLE = await ensProfileManagerContract.ADMIN_ROLE();
  await ensProfileManagerContract.grantRole(ADMIN_ROLE, await proofOfGoodContract.getAddress());

  // Grant RELAYER_ROLE to deployer for MetaTransactions
  const RELAYER_ROLE = await metaTransactionsContract.RELAYER_ROLE();
  await metaTransactionsContract.grantRole(RELAYER_ROLE, deployer);

  console.log("✅ Deployment completed!");
  console.log("📋 Contract Addresses:");
  console.log("ProofOfGood:", await proofOfGoodContract.getAddress());
  console.log("ENSProfileManager:", await ensProfileManagerContract.getAddress());
  console.log("CommunityBadges:", await communityBadgesContract.getAddress());
  console.log("MetaTransactions:", await metaTransactionsContract.getAddress());
  console.log("TestToken:", await testTokenContract.getAddress());

  // Create some initial test data
  if (hre.network.name === "localhost" || hre.network.name === "hardhat") {
    console.log("Creating initial test data...");
    
    // Create test profiles
    await ensProfileManagerContract.createProfile(
      deployer,
      "admin",
      "Admin User",
      "Platform administrator",
      "https://example.com/avatar1.png",
    );

    console.log("✅ Initial test data created!");
  }
};

export default deployProofOfGood;
deployProofOfGood.tags = ["ProofOfGood", "ENSProfileManager", "CommunityBadges", "MetaTransactions", "TestToken"];
