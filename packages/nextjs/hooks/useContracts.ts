import { useCallback } from "react";
import { Address, Chain } from "viem";
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { getContractAddresses } from "~~/config/contracts";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { getTargetNetwork } from "~~/utils/scaffold-eth";

export const useProofOfGood = () => {
  const chain = getTargetNetwork() as Chain;
  const addresses = getContractAddresses(chain);
  const { data: contractInfo } = useDeployedContractInfo("ProofOfGood");

  const { data: totalProofs } = useContractRead({
    address: addresses.ProofOfGood as Address,
    abi: contractInfo?.abi,
    functionName: "totalProofs",
    watch: true,
  });

  const { config: submitProofConfig } = usePrepareContractWrite({
    address: addresses.ProofOfGood as Address,
    abi: contractInfo?.abi,
    functionName: "submitProof",
  });

  const { 
    data: submitProofData,
    write: submitProof,
    isLoading: isSubmitting 
  } = useContractWrite(submitProofConfig);

  const { isLoading: isWaitingForTransaction } = useWaitForTransaction({
    hash: submitProofData?.hash,
  });

  const handleSubmitProof = useCallback(
    async (proofData: string, ipfsHash: string) => {
      if (submitProof) {
        submitProof({
          args: [proofData, ipfsHash],
        });
      }
    },
    [submitProof]
  );

  return {
    totalProofs,
    submitProof: handleSubmitProof,
    isSubmitting: isSubmitting || isWaitingForTransaction,
  };
};

export const useENSProfileManager = () => {
  const chain = getTargetNetwork() as Chain;
  const addresses = getContractAddresses(chain);
  const { data: contractInfo } = useDeployedContractInfo("ENSProfileManager");

  const { data: ensName } = useContractRead({
    address: addresses.ENSProfileManager as Address,
    abi: contractInfo?.abi,
    functionName: "getUserENS",
    watch: true,
  });

  const { config: linkENSConfig } = usePrepareContractWrite({
    address: addresses.ENSProfileManager as Address,
    abi: contractInfo?.abi,
    functionName: "linkENS",
  });

  const { 
    data: linkENSData,
    write: linkENS,
    isLoading: isLinking 
  } = useContractWrite(linkENSConfig);

  const { isLoading: isWaitingForTransaction } = useWaitForTransaction({
    hash: linkENSData?.hash,
  });

  const handleLinkENS = useCallback(
    async (ensName: string) => {
      if (linkENS) {
        linkENS({
          args: [ensName],
        });
      }
    },
    [linkENS]
  );

  return {
    ensName,
    linkENS: handleLinkENS,
    isLinking: isLinking || isWaitingForTransaction,
  };
};

export const useCommunityBadges = () => {
  const chain = getTargetNetwork() as Chain;
  const addresses = getContractAddresses(chain);
  const { data: contractInfo } = useDeployedContractInfo("CommunityBadges");

  const { data: userBadges } = useContractRead({
    address: addresses.CommunityBadges as Address,
    abi: contractInfo?.abi,
    functionName: "getUserBadges",
    watch: true,
  });

  const { config: mintBadgeConfig } = usePrepareContractWrite({
    address: addresses.CommunityBadges as Address,
    abi: contractInfo?.abi,
    functionName: "mintBadge",
  });

  const { 
    data: mintBadgeData,
    write: mintBadge,
    isLoading: isMinting 
  } = useContractWrite(mintBadgeConfig);

  const { isLoading: isWaitingForTransaction } = useWaitForTransaction({
    hash: mintBadgeData?.hash,
  });

  const handleMintBadge = useCallback(
    async (badgeId: number, recipient: string) => {
      if (mintBadge) {
        mintBadge({
          args: [badgeId, recipient],
        });
      }
    },
    [mintBadge]
  );

  return {
    userBadges,
    mintBadge: handleMintBadge,
    isMinting: isMinting || isWaitingForTransaction,
  };
};
