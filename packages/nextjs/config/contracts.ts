import { Chain } from "viem";
import { baseSepolia } from "viem/chains";

type ContractAddresses = {
  [chainId: number]: {
    ProofOfGood: `0x${string}`;
    ENSProfileManager: `0x${string}`;
    CommunityBadges: `0x${string}`;
  };
};

// Update these addresses after deployment
export const contractAddresses: ContractAddresses = {
  [baseSepolia.id]: {
    ProofOfGood: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    ENSProfileManager: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    CommunityBadges: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  },
};

export const getContractAddresses = (chain: Chain) => {
  return contractAddresses[chain.id];
};
