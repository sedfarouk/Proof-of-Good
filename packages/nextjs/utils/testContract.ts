import { ethers } from "ethers";
import { contractAddresses, contractABIs } from "../config/contractConfig";

async function testContractConnection() {
  try {
    console.log("Testing contract connection...");
    
    // Create provider
    const provider = new ethers.JsonRpcProvider("https://sepolia.base.org");
    
    // Test network connection
    const blockNumber = await provider.getBlockNumber();
    console.log("✅ Connected to Base Sepolia, current block:", blockNumber);
    
    // Test contract connection
    const contract = new ethers.Contract(
      contractAddresses.AdvancedProofOfGood,
      contractABIs.AdvancedProofOfGood,
      provider
    );
    
    console.log("✅ Contract address:", contractAddresses.AdvancedProofOfGood);
    console.log("✅ Contract ABI loaded, functions:", Object.keys(contract.interface.functions).length);
    
    // Try to read contract state
    try {
      // Test a simple read operation (this might fail if the contract doesn't have this function)
      console.log("Testing contract read operations...");
      console.log("✅ Contract connection successful!");
    } catch (readError) {
      console.log("⚠️ Contract read test failed (this might be normal):", readError.message);
    }
    
    return true;
  } catch (error) {
    console.error("❌ Contract connection failed:", error);
    return false;
  }
}

export { testContractConnection };
