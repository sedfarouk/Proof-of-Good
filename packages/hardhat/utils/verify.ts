import { run } from "hardhat";

export const verifyContract = async (contractAddress: string, constructorArguments: any[]) => {
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: constructorArguments,
    });
  } catch (error: any) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("Contract is already verified!");
    } else {
      console.log("Error verifying contract:", error);
    }
  }
};
