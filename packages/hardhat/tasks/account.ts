import { task } from "hardhat/config";
import { ethers } from "ethers";
import * as fs from "fs";

// Task to generate a new account
task("account:generate", "Generate a new account")
  .setAction(async () => {
    console.log("🔑 Generating new account...\n");
    
    // Generate a random wallet
    const wallet = ethers.Wallet.createRandom();
    
    console.log("📋 Account Info:");
    console.log("Address:", wallet.address);
    console.log("Private Key:", wallet.privateKey);
    console.log("\n⚠️  IMPORTANT: Save your private key securely!");
    console.log("⚠️  Never share your private key with anyone!");
    console.log("\n💡 To use this account:");
    console.log("1. Add it to your .env file:");
    console.log(`   DEPLOYER_PRIVATE_KEY=${wallet.privateKey}`);
    console.log("2. Fund it with test ETH from a faucet");
  });

// Task to show current account info
task("account", "Show current account info")
  .setAction(async () => {
    const privateKey = process.env.DEPLOYER_PRIVATE_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
    
    try {
      const wallet = new ethers.Wallet(privateKey);
      console.log("📋 Current Account Info:");
      console.log("Address:", wallet.address);
      console.log("Private Key:", privateKey === "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" ? "Default Hardhat Account" : "Custom Account");
    } catch (error) {
      console.error("❌ Invalid private key in DEPLOYER_PRIVATE_KEY");
    }
  });

// Task to import an account manually
task("account:import", "Import an account from private key")
  .addParam("privatekey", "The private key to import")
  .setAction(async ({ privatekey }) => {
    try {
      const wallet = new ethers.Wallet(privatekey);
      
      console.log("✅ Valid private key!");
      console.log("📋 Account Info:");
      console.log("Address:", wallet.address);
      
      console.log("\n💡 To use this account, add it to your .env file:");
      console.log(`DEPLOYER_PRIVATE_KEY=${privatekey}`);
      
      // Optionally write to .env file
      const envPath = "./.env";
      if (fs.existsSync(envPath)) {
        let envContent = fs.readFileSync(envPath, "utf8");
        if (envContent.includes("DEPLOYER_PRIVATE_KEY=")) {
          envContent = envContent.replace(/DEPLOYER_PRIVATE_KEY=.*/, `DEPLOYER_PRIVATE_KEY=${privatekey}`);
        } else {
          envContent += `\nDEPLOYER_PRIVATE_KEY=${privatekey}\n`;
        }
        fs.writeFileSync(envPath, envContent);
        console.log("✅ Updated .env file with new private key");
      } else {
        fs.writeFileSync(envPath, `DEPLOYER_PRIVATE_KEY=${privatekey}\n`);
        console.log("✅ Created .env file with private key");
      }
      
    } catch (error) {
      console.error("❌ Invalid private key format");
    }
  });

// Task to reveal private key (use with caution)
task("account:reveal-pk", "Reveal the private key of the current account")
  .setAction(async () => {
    const privateKey = process.env.DEPLOYER_PRIVATE_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
    
    console.log("⚠️  WARNING: This will display your private key!");
    console.log("⚠️  Make sure no one else can see your screen!");
    console.log("\n🔑 Private Key:", privateKey);
    console.log("\n⚠️  NEVER share this private key with anyone!");
  });
