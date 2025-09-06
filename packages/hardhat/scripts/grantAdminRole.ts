import hre from "hardhat";
import { ethers } from "hardhat";

async function main() {
  console.log("🔧 Granting Admin Role to Address...");
  
  // Get the deployed contract
  const contractAddress = "0xEe8D56C66d614184fFeAB8e73a386BfFA800fC94"; // Your deployed AdvancedProofOfGood address
  const AdvancedProofOfGood = await ethers.getContractAt("AdvancedProofOfGood", contractAddress);
  
  // Address to grant admin role to (replace with your wallet address)
  const adminAddress = "0x742d35Cc6665Fb24d5Bb9dE0ac1c8f33BEC8c7Be"; // Replace with your wallet address
  
  // Get the ADMIN_ROLE bytes32 value
  const ADMIN_ROLE = await AdvancedProofOfGood.ADMIN_ROLE();
  console.log("ADMIN_ROLE:", ADMIN_ROLE);
  
  // Check if address already has admin role
  const hasAdminRole = await AdvancedProofOfGood.hasRole(ADMIN_ROLE, adminAddress);
  console.log(`Address ${adminAddress} has admin role: ${hasAdminRole}`);
  
  if (!hasAdminRole) {
    console.log("Granting admin role...");
    const tx = await AdvancedProofOfGood.grantRole(ADMIN_ROLE, adminAddress);
    await tx.wait();
    console.log("✅ Admin role granted!");
    console.log("Transaction hash:", tx.hash);
  } else {
    console.log("✅ Address already has admin role!");
  }
  
  // Verify the role was granted
  const newHasAdminRole = await AdvancedProofOfGood.hasRole(ADMIN_ROLE, adminAddress);
  console.log(`Verification - Address ${adminAddress} has admin role: ${newHasAdminRole}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
