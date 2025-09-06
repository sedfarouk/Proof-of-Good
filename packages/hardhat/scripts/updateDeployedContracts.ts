import fs from "fs";
import path from "path";

async function updateDeployedContracts() {
  console.log("📝 Updating deployedContracts.ts with AdvancedProofOfGood...");

  // Read the AdvancedProofOfGood artifact
  const artifactPath = path.join(__dirname, "../artifacts/contracts/AdvancedProofOfGood.sol/AdvancedProofOfGood.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  // Read the current deployedContracts.ts
  const deployedContractsPath = path.join(__dirname, "../../nextjs/contracts/deployedContracts.ts");
  let deployedContractsContent = fs.readFileSync(deployedContractsPath, "utf8");

  // Get the address from contractConfig.ts
  const contractAddress = "0xEe8D56C66d614184fFeAB8e73a386BfFA800fC94";

  // Create the AdvancedProofOfGood entry
  const advancedProofOfGoodEntry = `    AdvancedProofOfGood: {
      address: "${contractAddress}",
      abi: ${JSON.stringify(artifact.abi, null, 6)},
    },`;

  // Find the location to insert (after CommunityBadges)
  const insertionPoint = deployedContractsContent.indexOf("    },\n  },\n} as const;");
  
  if (insertionPoint !== -1) {
    // Insert the AdvancedProofOfGood entry before the closing
    const beforeInsertion = deployedContractsContent.substring(0, insertionPoint);
    const afterInsertion = deployedContractsContent.substring(insertionPoint);
    
    deployedContractsContent = beforeInsertion + "    },\n" + advancedProofOfGoodEntry + "\n  },\n} as const;";
    
    // Write the updated file
    fs.writeFileSync(deployedContractsPath, deployedContractsContent);
    
    console.log("✅ AdvancedProofOfGood added to deployedContracts.ts");
    console.log("📍 Address:", contractAddress);
  } else {
    console.log("❌ Could not find insertion point in deployedContracts.ts");
  }
}

updateDeployedContracts().catch(console.error);
