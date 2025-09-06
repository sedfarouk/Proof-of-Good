// Test script to verify AdvancedProofOfGood contract interaction
import { ethers } from "ethers";

async function testContractConnection() {
  console.log("🧪 Testing AdvancedProofOfGood contract connection...");

  const provider = new ethers.JsonRpcProvider("https://sepolia.base.org");
  const contractAddress = "0xEe8D56C66d614184fFeAB8e73a386BfFA800fC94";

  try {
    // Try to get contract code
    const code = await provider.getCode(contractAddress);
    console.log("Contract code length:", code.length);
    
    if (code === "0x") {
      console.error("❌ No contract deployed at address:", contractAddress);
      return false;
    }

    console.log("✅ Contract found at address:", contractAddress);

    // Try to read basic contract info
    const contract = new ethers.Contract(
      contractAddress,
      [
        "function ensRegistry() view returns (address)",
        "function efpRegistry() view returns (address)",
        "function baseDomain() view returns (string)",
      ],
      provider
    );

    try {
      const ensRegistry = await contract.ensRegistry();
      const efpRegistry = await contract.efpRegistry(); 
      const baseDomain = await contract.baseDomain();

      console.log("✅ Contract state:");
      console.log("  ENS Registry:", ensRegistry);
      console.log("  EFP Registry:", efpRegistry);
      console.log("  Base Domain:", baseDomain);

      return true;
    } catch (error) {
      console.error("❌ Error reading contract state:", error);
      return false;
    }

  } catch (error) {
    console.error("❌ Error connecting to contract:", error);
    return false;
  }
}

testContractConnection();
