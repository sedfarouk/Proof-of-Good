// Contract configuration for ProofOfGood dApp
// These addresses are from the latest Hardhat deployment

import deployedContracts from "~~/contracts/deployedContracts";
// Temporary import for AdvancedProofOfGood ABI until it's in deployedContracts
// import AdvancedProofOfGoodArtifact from "../../../hardhat/artifacts/contracts/AdvancedProofOfGood.sol/AdvancedProofOfGood.json";

// Get the contracts for the current network (Base Sepolia = 84532)
const contracts = deployedContracts[84532] || {};

export const contractAddresses = {
  // Core contracts deployed on localhost:8545
  ProofOfGood: "0x382e3d95c3A488f939A9Dc8056874c9f2055E9ab",
  CommunityBadges: "0x294dDaCBDD1c397A872CE9A0dfa71A6EFdaeaaFE",
  ENSProfileManager: "0x6EE4718b3D3F0FE2F5B197A6ec7eFF0750163cAb",
  MetaTransactions: "0xB8DFe6094B8Fd55D8f1C4C4b6fA78c8dBC66133b",
  TestToken: "0x7dd7D28bEE8c5279b80a17bd122Dac950534f040",
  
  // Revolutionary contract
  AdvancedProofOfGood: "0xEe8D56C66d614184fFeAB8e73a386BfFA800fC94", // Will be updated after deployment
};

export const contractABIs = {
  ProofOfGood: contracts?.ProofOfGood?.abi || [],
  CommunityBadges: contracts?.CommunityBadges?.abi || [],
  ENSProfileManager: contracts?.ENSProfileManager?.abi || [],
  MetaTransactions: contracts?.MetaTransactions?.abi || [],
  TestToken: contracts?.TestToken?.abi || [],
  AdvancedProofOfGood: contracts?.AdvancedProofOfGood?.abi || [],
};

// Export network configuration
export const NETWORK_CONFIG = {
  chainId: 84532, // Base Sepolia
  name: "Base Sepolia",
  rpcUrl: "https://sepolia.base.org",
};
