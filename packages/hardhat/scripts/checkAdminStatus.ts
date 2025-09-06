import hre from "hardhat";
import { ethers } from "hardhat";

async function main() {
  console.log("🔍 Checking Admin Status...");
  
  // Get the deployed contract
  const contractAddress = "0xEe8D56C66d614184fFeAB8e73a386BfFA800fC94"; // Your deployed AdvancedProofOfGood address
  const AdvancedProofOfGood = await ethers.getContractAt("AdvancedProofOfGood", contractAddress);
  
  // Address to check (replace with your wallet address)
  const rawAddress = "0x2DCc6F1Fe1d212aa6d8d424BE5D5A63737421bEd"; // Replace with your wallet address
  const checkAddress = ethers.getAddress(rawAddress); // This ensures proper checksum
  
  // Get the ADMIN_ROLE bytes32 value
  const ADMIN_ROLE = await AdvancedProofOfGood.ADMIN_ROLE();
  console.log("ADMIN_ROLE:", ADMIN_ROLE);
  
  // Check if address has admin role
  const hasAdminRole = await AdvancedProofOfGood.hasRole(ADMIN_ROLE, checkAddress);
  console.log(`\n📋 Admin Status for ${checkAddress}:`);
  console.log(`   Has Admin Role: ${hasAdminRole ? "✅ YES" : "❌ NO"}`);
  
  // Note: To get the deployer/initial admin, you would need to check contract events
  // or use a different approach since getRoleMember might not be available
  
  console.log("\n💡 If you don't have admin role, run:");
  console.log("   npx hardhat run scripts/grantAdminRole.ts --network base-sepolia");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
