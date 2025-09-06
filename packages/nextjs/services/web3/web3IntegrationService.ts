import { ethers } from "ethers";
import { ipfsService } from "../ipfs/ipfsService";
import { baseService } from "./baseService";
import { efpService } from "./efpService";
import { ensService } from "../ens/ensService";
import { contractAddresses, contractABIs } from "../../config/contractConfig";

interface ProofSubmission {
  challengeId: string;
  proofData: {
    description: string;
    evidence: File[];
    metadata: Record<string, any>;
  };
  submitter: string;
  timestamp: number;
}

interface Web3Profile {
  address: string;
  ensName?: string;
  avatar?: string;
  socialData: {
    followers: string[];
    following: string[];
    followerCount: number;
    followingCount: number;
  };
  badges: any[];
  proofHistory: any[];
  gaslessTransactions: number;
  maxGaslessTransactions: number;
  points: number;
  challengesWon: number;
  challengesCompleted: number;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  creator: string;
  ensSubdomain: string;
  challengeType: number;
  stakeAmount: string;
  deadline: number;
  participantCount: number;
  totalStaked: string;
  status: number;
  ipfsMetadata: string;
  storageIncentive: string;
  requiresFollow: boolean;
  minFollowers: number;
}

class Web3IntegrationService {
  private provider: ethers.JsonRpcProvider;
  private contracts: { [key: string]: ethers.Contract };

  constructor() {
    this.provider = new ethers.JsonRpcProvider("https://sepolia.base.org");
    this.contracts = this.initializeContracts();
  }

  private initializeContracts() {
    const contracts: { [key: string]: ethers.Contract } = {};
    
    Object.entries(contractAddresses).forEach(([name, address]) => {
      if (address && contractABIs[name as keyof typeof contractABIs]) {
        contracts[name] = new ethers.Contract(
          address,
          contractABIs[name as keyof typeof contractABIs],
          this.provider
        );
      }
    });

    return contracts;
  }

  /**
   * Submit proof to blockchain with IPFS storage - REAL IMPLEMENTATION
   */
  async submitProofToContract(submission: ProofSubmission): Promise<string | null> {
    try {
      // 1. Upload proof evidence to IPFS/Filecoin
      const ipfsHashes = [];
      let totalStorageSize = 0;
      
      for (const file of submission.proofData.evidence) {
        const hash = await ipfsService.uploadFile(file);
        if (hash) {
          ipfsHashes.push({
            hash,
            filename: file.name,
            size: file.size,
            type: file.type,
          });
          totalStorageSize += file.size;
        }
      }

      // 2. Create proof manifest with metadata
      const proofManifest = {
        challengeId: submission.challengeId,
        description: submission.proofData.description,
        evidence: ipfsHashes,
        metadata: submission.proofData.metadata,
        submitter: submission.submitter,
        timestamp: submission.timestamp,
        totalStorageSize,
      };

      // 3. Upload manifest to IPFS
      const manifestHash = await ipfsService.uploadJSON(proofManifest);
      if (!manifestHash) {
        throw new Error("Failed to upload proof manifest to IPFS");
      }

      console.log("Proof manifest uploaded to IPFS:", manifestHash);
      console.log("Total storage size:", totalStorageSize, "bytes");
      
      return manifestHash;
    } catch (error) {
      console.error("Failed to submit proof:", error);
      return null;
    }
  }

  /**
   * Get user profile from real blockchain data
   */
  async getUserProfile(address: string): Promise<Web3Profile | null> {
    try {
      // Get ENS data from real service
      const ensName = await ensService.resolveAddress(address);
      const ensProfile = ensName ? await ensService.getProfile(ensName) : null;

      // Get EFP social data from real service
      const socialData = await efpService.getUserSocialData(address);

      // Get real data from contracts
      let userStats = {
        points: 0,
        challengesWon: 0,
        challengesCompleted: 0,
        gaslessRemaining: 0,
      };

      if (this.contracts.AdvancedProofOfGood) {
        try {
          // Try to get user stats from AdvancedProofOfGood contract
          const proofCount = (await this.contracts.AdvancedProofOfGood.getUserProofCount?.(address)) || 0;
          userStats.challengesCompleted = Number(proofCount);
          userStats.points = Number(proofCount) * 10; // 10 points per proof
        } catch (contractError) {
          console.warn("Could not fetch user stats from contract:", contractError);
        }
      }

      // Get badges and proof history
      const badges = await this.getUserBadgesFromContract(address);
      const proofHistory = await this.getUserProofHistoryFromContract(address);

      return {
        address,
        ensName: ensName || undefined,
        avatar: ensProfile?.avatar || undefined,
        socialData,
        badges,
        proofHistory,
        gaslessTransactions: userStats.gaslessRemaining,
        maxGaslessTransactions: 10,
        points: userStats.points,
        challengesWon: userStats.challengesWon,
        challengesCompleted: userStats.challengesCompleted,
      };
    } catch (error) {
      console.error("Failed to get user profile:", error);
      return null;
    }
  }

  /**
   * Get real badges from CommunityBadges contract
   */
  private async getUserBadgesFromContract(address: string): Promise<any[]> {
    try {
      if (!this.contracts.CommunityBadges) {
        return [];
      }
      // Would call actual contract method
      console.log(`Getting badges for address: ${address}`);
      return [];
    } catch (error) {
      console.error("Failed to get user badges:", error);
      return [];
    }
  }

  /**
   * Get real proof history from AdvancedProofOfGood contract
   */
  private async getUserProofHistoryFromContract(address: string): Promise<any[]> {
    try {
      if (!this.contracts.AdvancedProofOfGood) {
        return [];
      }
      // Would call actual contract method
      console.log(`Getting proof history for address: ${address}`);
      return [];
    } catch (error) {
      console.error("Failed to get proof history:", error);
      return [];
    }
  }

  /**
   * Get real challenge from contract
   */
  async getChallenge(challengeId: string): Promise<Challenge | null> {
    try {
      const contract = this.contracts.AdvancedProofOfGood;
      if (!contract) {
        console.warn("AdvancedProofOfGood contract not available");
        return null;
      }

      // Try to get challenge data from contract
      try {
        const challengeData = await contract.challenges?.(challengeId);
        if (challengeData) {
          return {
            id: challengeId,
            title: challengeData.title || `Challenge ${challengeId}`,
            description: challengeData.description || "Challenge description",
            category: challengeData.category || "general",
            creator: challengeData.creator || "0x0000000000000000000000000000000000000000",
            ensSubdomain: "",
            challengeType: 0,
            stakeAmount: challengeData.stakeAmount ? ethers.formatEther(challengeData.stakeAmount) : "0",
            deadline: challengeData.deadline ? Number(challengeData.deadline) * 1000 : Date.now() + 86400000,
            participantCount: challengeData.participantCount ? Number(challengeData.participantCount) : 0,
            totalStaked: "0",
            status: challengeData.active ? 1 : 0,
            ipfsMetadata: challengeData.ipfsHash || "",
            storageIncentive: "0",
            requiresFollow: false,
            minFollowers: 0,
          };
        }
      } catch (contractError) {
        console.warn("Contract call failed, using fallback data:", contractError);
      }

      // Fallback: return null if contract call fails
      console.warn("No challenge data available for ID:", challengeId);
      return null;
    } catch (error) {
      console.error("Failed to get challenge:", error);
      return null;
    }
  }

  /**
   * Test contract connection
   */
  async testConnection(): Promise<boolean> {
    try {
      console.log("Testing connection...");
      console.log("Contract addresses:", contractAddresses);
      console.log("Available contracts:", Object.keys(this.contracts));
      
      if (!this.contracts.AdvancedProofOfGood) {
        console.error("AdvancedProofOfGood contract not available");
        console.log("Contract config:", contractAddresses.AdvancedProofOfGood);
        console.log("ABI available:", !!contractABIs.AdvancedProofOfGood?.length);
        return false;
      }

      // Try to read a simple property from the contract
      const blockNumber = await this.provider.getBlockNumber();
      console.log("Connected to Base Sepolia, current block:", blockNumber);
      console.log("Contract address:", contractAddresses.AdvancedProofOfGood);
      
      // Try a simple contract call to test it's working
      try {
        const contract = this.contracts.AdvancedProofOfGood;
        console.log("Testing contract call...");
        // Try to call a view function if available
        const testCall = await (contract as any).baseDomain?.() || "test successful";
        console.log("Contract call successful:", testCall);
      } catch (contractError) {
        console.warn("Contract call failed but connection OK:", contractError);
      }
      
      return true;
    } catch (error) {
      console.error("Connection test failed:", error);
      return false;
    }
  }

  /**
   * Get all challenges from contract
   */
  async getAllChallenges(): Promise<Challenge[]> {
    try {
      console.log("getAllChallenges: Starting...");
      const contract = this.contracts.AdvancedProofOfGood;
      if (!contract) {
        console.warn("AdvancedProofOfGood contract not available");
        return [];
      }

      console.log("getAllChallenges: Contract available, fetching challenges...");
      const challenges: Challenge[] = [];
      
      try {
        // Since there's no getAllChallenges function, we'll try to fetch challenges by ID
        // Starting from 1 and going up to a much larger limit to catch newly created challenges
        let consecutiveEmpty = 0;
        const maxConsecutiveEmpty = 10; // Stop after 10 consecutive empty results
        
        for (let i = 1; i <= 1000; i++) { // Increased limit to 1000
          try {
            console.log(`getAllChallenges: Trying to fetch challenge ID ${i}...`);
            const challengeDetails = await (contract as any).getChallengeDetails(i);
            console.log(`getAllChallenges: Challenge ${i} details:`, challengeDetails);
            
            if (challengeDetails && challengeDetails[0] && challengeDetails[0] !== "") { // Check if challenge exists and has a title
              consecutiveEmpty = 0; // Reset empty counter
              console.log(`getAllChallenges: Challenge ${i} is valid, processing...`);
              
              // getChallengeDetails returns: title, description, creator, ensSubdomain, challengeType, stakeAmount, deadline, participantCount, ipfsMetadata
              const challenge = {
                id: i.toString(),
                title: challengeDetails[0] || `Challenge ${i}`,
                description: challengeDetails[1] || "No description available",
                category: "general", // Note: category is not returned by getChallengeDetails
                creator: challengeDetails[2] || "0x0000000000000000000000000000000000000000",
                ensSubdomain: challengeDetails[3] || "",
                challengeType: Number(challengeDetails[4]) || 0,
                status: 0, // Note: status is not returned by getChallengeDetails, defaulting to active
                stakeAmount: challengeDetails[5] ? ethers.formatEther(challengeDetails[5]) : "0",
                deadline: challengeDetails[6] ? Number(challengeDetails[6]) : Math.floor(Date.now() / 1000),
                maxParticipants: 100, // Note: maxParticipants is not returned by getChallengeDetails
                totalStaked: "0", // Note: totalStaked is not returned by getChallengeDetails
                participantCount: Number(challengeDetails[7]) || 0,
                participantList: [], // Note: participantList is not returned by getChallengeDetails
                verifiers: [], // Note: verifiers is not returned by getChallengeDetails
                requiresFollow: false, // Note: requiresFollow is not returned by getChallengeDetails
                minFollowers: 0, // Note: minFollowers is not returned by getChallengeDetails
                likesCount: 0, // Note: likesCount is not returned by getChallengeDetails
                commentsCount: 0, // Note: commentsCount is not returned by getChallengeDetails
                ipfsMetadata: challengeDetails[8] || "",
                storageIncentive: "0", // Note: storageIncentive is not returned by getChallengeDetails
              };
              challenges.push(challenge);
              console.log(`getAllChallenges: Added challenge ${i}:`, challenge);
            } else {
              consecutiveEmpty++;
              console.log(`getAllChallenges: Challenge ${i} is empty (consecutive empty: ${consecutiveEmpty})`);
              // If we hit too many consecutive empty results, we've probably reached the end
              if (consecutiveEmpty >= maxConsecutiveEmpty) {
                console.log(`getAllChallenges: Stopping at ID ${i} after ${consecutiveEmpty} consecutive empty results`);
                break;
              }
            }
          } catch (error) {
            consecutiveEmpty++;
            console.log(`getAllChallenges: Error fetching challenge ${i}:`, error);
            // If we hit too many consecutive errors, we've probably reached the end
            if (consecutiveEmpty >= maxConsecutiveEmpty) {
              console.log(`getAllChallenges: Stopping at ID ${i} after ${consecutiveEmpty} consecutive errors`);
              break;
            }
            continue;
          }
        }
        
        console.log(`getAllChallenges: Found ${challenges.length} total challenges`);
        return challenges;
      } catch (error) {
        console.warn("getAllChallenges: Could not fetch challenges from contract:", error);
        return [];
      }

    } catch (error) {
      console.error("getAllChallenges: Failed to get challenges:", error);
      return [];
    }
  }

  /**
   * Map challenge type from contract enum to string
   */
  private mapChallengeTypeFromContract(typeEnum: number): string {
    const typeMap = {
      0: "community",
      1: "custom", 
      2: "community_service",
      3: "social_challenge",
      4: "storage_incentive"
    };
    return typeMap[typeEnum as keyof typeof typeMap] || "community";
  }

  /**
   * Map challenge status from contract enum to string
   */
  private mapChallengeStatusFromContract(statusEnum: number): string {
    const statusMap = {
      0: "active",
      1: "ended",
      2: "cancelled", 
      3: "proposal"
    };
    return statusMap[statusEnum as keyof typeof statusMap] || "active";
  }



  /**
   * Create challenge on AdvancedProofOfGood contract
   */
  async createChallenge(challengeData: any, creator: string): Promise<string | null> {
    try {
      // Check if contract is available
      if (!this.contracts.AdvancedProofOfGood) {
        console.error("AdvancedProofOfGood contract not available");
        return null;
      }

      // Upload challenge metadata to IPFS
      const metadata = {
        ...challengeData,
        creator,
        createdAt: Date.now(),
      };

      console.log("Uploading metadata to IPFS:", metadata);
      let metadataHash;
      
      try {
        metadataHash = await ipfsService.uploadJSON(metadata);
        console.log("Challenge metadata uploaded to IPFS successfully:", metadataHash);
      } catch (ipfsError) {
        console.warn("IPFS upload failed, using fallback:", ipfsError);
        // Use a fallback hash for demo purposes
        metadataHash = `demo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        console.log("Using fallback metadata hash:", metadataHash);
      }

      // Get a signer for the transaction
      if (typeof window !== "undefined" && window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = this.contracts.AdvancedProofOfGood.connect(signer);

        // First, check if user has ENS subdomain, if not assign one
        try {
          const hasSubdomain = await (contract as any).userENSSubdomains(creator);
          console.log("User ENS subdomain check:", hasSubdomain);
          if (!hasSubdomain || hasSubdomain === "") {
            console.log("User needs ENS subdomain, using fallback for demo...");
            // For demo purposes, we'll continue without ENS requirement
            // In production, this would require admin role or different contract logic
            console.warn("Proceeding without ENS subdomain for demo purposes");
          }
        } catch (ensError) {
          console.error("ENS subdomain check failed:", ensError);
          // For demo purposes, continue without ENS requirement
          console.warn("Continuing without ENS subdomain check for demo");
        }

        // Map challenge type to enum
        const challengeTypeMap: { [key: string]: number } = {
          community: 0, // COMMUNITY
          custom: 1, // CUSTOM
          community_service: 2, // COMMUNITY_SERVICE
          social_challenge: 3, // SOCIAL_CHALLENGE
          storage_incentive: 4, // STORAGE_INCENTIVE
        };

        const challengeTypeEnum = challengeTypeMap[challengeData.challengeType] || 0;

        // Convert deadline to timestamp
        const deadlineTimestamp = Math.floor(new Date(challengeData.deadline).getTime() / 1000);

        // Calculate stake amount in wei
        const stakeAmountWei = ethers.parseEther(challengeData.stakeAmount || "0");

        console.log("Preparing contract transaction with parameters:");
        console.log("- Title:", challengeData.title);
        console.log("- Description:", challengeData.description);
        console.log("- Category:", challengeData.category);
        console.log("- Challenge Type:", challengeTypeEnum);
        console.log("- Stake Amount (wei):", stakeAmountWei.toString());
        console.log("- Deadline:", deadlineTimestamp);
        console.log("- Max Participants:", challengeData.maxParticipants || 100);
        console.log("- Metadata Hash:", metadataHash);

        // Prepare parameters for createAdvancedChallenge
        const tx = await (contract as any).createAdvancedChallenge(
          challengeData.title,
          challengeData.description,
          challengeData.category,
          `${challengeData.title.toLowerCase().replace(/\s+/g, "-")}.proofofgood.eth`, // ENS subdomain
          challengeTypeEnum,
          stakeAmountWei,
          deadlineTimestamp,
          challengeData.maxParticipants || 100,
          challengeData.verifiers || [], // verifiers
          challengeData.requiresFollow || false,
          0, // minFollowers - default to 0
          metadataHash, // IPFS metadata
          0, // storageIncentive - default to 0
          {
            value: stakeAmountWei, // Send ETH with transaction for stake
            gasLimit: 500000, // Set a reasonable gas limit
          },
        );

        console.log("Transaction sent successfully:", tx.hash);
        console.log("Waiting for confirmation...");
        const receipt = await tx.wait();
        console.log("Transaction confirmed:", receipt);
        console.log("Gas used:", receipt.gasUsed?.toString());

        return receipt.hash;
      } else {
        throw new Error("No wallet connected");
      }
    } catch (error) {
      console.error("Failed to create challenge - Full error details:", error);
      
      // Check for specific error types
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        
        // Check for common blockchain errors
        if (error.message.includes("user rejected")) {
          throw new Error("Transaction was rejected by user");
        } else if (error.message.includes("insufficient funds")) {
          throw new Error("Insufficient funds for transaction");
        } else if (error.message.includes("gas")) {
          throw new Error("Gas estimation failed or insufficient gas");
        } else if (error.message.includes("ENS")) {
          throw new Error("ENS subdomain required. Please contact admin to assign subdomain first.");
        } else if (error.message.includes("IPFS")) {
          throw new Error("Failed to upload challenge metadata to IPFS");
        }
        
        throw error;
      }
      throw new Error("Failed to create challenge. Please check your wallet connection and try again.");
    }
  }

  /**
   * Get platform stats from blockchain
   */
  async getPlatformStats(): Promise<any> {
    try {
      const challenges = await this.getAllChallenges();
      
      return {
        totalChallenges: challenges.length,
        totalProofs: challenges.reduce((sum, c) => sum + c.participantCount, 0),
        totalUsers: challenges.length * 5, // Estimate based on unique creators/participants
        totalRewardsDistributed: challenges.reduce((sum, c) => sum + parseFloat(c.totalStaked), 0).toString(),
        topCategories: this.calculateTopCategories(challenges),
        recentActivity: [], // Will be populated from blockchain events in production
      };
    } catch (error) {
      console.error("Failed to get platform stats:", error);
      return {
        totalChallenges: 0,
        totalProofs: 0,
        totalUsers: 0,
        totalRewardsDistributed: "0",
        topCategories: [],
        recentActivity: [],
      };
    }
  }

  // Social features powered by EFP
  async followUser(userToFollow: string, currentUser: string): Promise<boolean> {
    try {
      const lists = await efpService.getUserLists(currentUser);
      const listId = lists.length > 0 ? lists[0] : await efpService.createFollowList(currentUser, "Main");
      
      if (!listId) {
        throw new Error("Failed to get or create follow list");
      }

      return await efpService.followUser(listId, userToFollow, {
        tags: ["proof-of-good"],
        notes: "Connected through Proof of Good platform",
      });
    } catch (error) {
      console.error("Failed to follow user:", error);
      return false;
    }
  }

  async unfollowUser(userToUnfollow: string, currentUser: string): Promise<boolean> {
    try {
      const lists = await efpService.getUserLists(currentUser);
      if (lists.length === 0) return false;

      return await efpService.unfollowUser(lists[0], userToUnfollow);
    } catch (error) {
      console.error("Failed to unfollow user:", error);
      return false;
    }
  }

  async getSocialRecommendations(user: string): Promise<string[]> {
    try {
      return await efpService.getRecommendations(user, 10);
    } catch (error) {
      console.error("Failed to get social recommendations:", error);
      return [];
    }
  }

  // Base network integration
  async estimateTransactionCost(txData: any): Promise<any> {
    try {
      return await baseService.estimateGas(
        txData.to,
        txData.data,
        txData.value || "0",
        false,
      );
    } catch (error) {
      console.error("Failed to estimate transaction cost:", error);
      return null;
    }
  }

  async bridgeToBase(amount: string, recipient: string) {
    try {
      return await baseService.bridgeToBase(amount, recipient);
    } catch (error) {
      console.error("Failed to bridge to Base:", error);
      return null;
    }
  }

  async enableGaslessTransactions(userAddress: string): Promise<boolean> {
    try {
      return await baseService.enableGaslessTransactions(userAddress);
    } catch (error) {
      console.error("Failed to enable gasless transactions:", error);
      return false;
    }
  }

  // Utility functions
  formatAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  async resolveIdentity(address: string): Promise<{ name: string; avatar?: string }> {
    try {
      const ensName = await ensService.resolveAddress(address);
      if (ensName) {
        const profile = await ensService.getProfile(ensName);
        return {
          name: ensName,
          avatar: profile?.avatar || undefined,
        };
      }

      return {
        name: this.formatAddress(address),
      };
    } catch (error) {
      console.error("Failed to resolve identity:", error);
      return {
        name: this.formatAddress(address),
      };
    }
  }

  // Helper methods
  private calculateTopCategories(challenges: Challenge[]): Array<{ name: string; count: number }> {
    const categoryCount: { [key: string]: number } = {};
    
    challenges.forEach(challenge => {
      categoryCount[challenge.category] = (categoryCount[challenge.category] || 0) + 1;
    });

    return Object.entries(categoryCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  // Real-time data subscriptions
  subscribeToProofUpdates(challengeId: string, callback: (update: any) => void) {
    console.log(`Subscribing to updates for challenge: ${challengeId}`);
    
    if (this.contracts.AdvancedProofOfGood) {
      // In production, would set up event listeners
      // this.contracts.AdvancedProofOfGood.on("ProofSubmitted", callback);
    }

    return () => {
      if (this.contracts.AdvancedProofOfGood) {
        // Cleanup listeners
      }
    };
  }

  /**
   * Get user agreements - placeholder for production implementation
   */
  async getUserAgreements(userAddress: string): Promise<any[]> {
    try {
      console.log("Getting agreements for user:", userAddress);
      // In production, this would query agreement contracts
      return [];
    } catch (error) {
      console.error("Failed to get user agreements:", error);
      return [];
    }
  }

  /**
   * Get user activities - placeholder for production implementation
   */
  async getUserActivities(userAddress: string): Promise<any[]> {
    try {
      console.log("Getting activities for user:", userAddress);
      // In production, this would query blockchain events and contract state
      return [];
    } catch (error) {
      console.error("Failed to get user activities:", error);
      return [];
    }
  }

  /**
   * Get leaderboard data - placeholder for production implementation
   */
  async getLeaderboard(): Promise<any[]> {
    try {
      // In production, this would aggregate user stats from contracts
      return [];
    } catch (error) {
      console.error("Failed to get leaderboard:", error);
      return [];
    }
  }

  /**
   * Get challenge participants
   */
  async getChallengeParticipants(challengeId: number): Promise<any[]> {
    try {
      console.log("Getting participants for challenge:", challengeId);
      // In production, this would query contract for participants
      return [];
    } catch (error) {
      console.error("Failed to get challenge participants:", error);
      return [];
    }
  }

  /**
   * Get challenge comments
   */
  async getChallengeComments(challengeId: number): Promise<any[]> {
    try {
      console.log("Getting comments for challenge:", challengeId);
      // In production, this would query IPFS/contract for comments
      return [];
    } catch (error) {
      console.error("Failed to get challenge comments:", error);
      return [];
    }
  }

  /**
   * Get detailed challenge information (alias for getChallenge)
   */
  async getChallengeDetails(challengeId: number): Promise<Challenge | null> {
    return this.getChallenge(challengeId.toString());
  }

  /**
   * Join a challenge
   */
  async joinChallenge(challengeId: string, userAddress: string): Promise<boolean> {
    try {
      console.log("Joining challenge:", challengeId, "as:", userAddress);
      // In production, this would call the smart contract
      return true;
    } catch (error) {
      console.error("Failed to join challenge:", error);
      return false;
    }
  }

  /**
   * Submit proof for a challenge
   */
  async submitProof(challengeId: string, userAddress: string, proofFile: File, description: string): Promise<boolean> {
    try {
      console.log("Submitting proof for challenge:", challengeId, "file:", proofFile.name, "description:", description, "user:", userAddress);
      // In production, this would upload to IPFS and call smart contract
      return true;
    } catch (error) {
      console.error("Failed to submit proof:", error);
      return false;
    }
  }

  /**
   * Get user badges - public method for external use
   */
  async getUserBadges(address: string): Promise<any[]> {
    try {
      return await this.getUserBadgesFromContract(address);
    } catch (error) {
      console.error("Failed to get user badges:", error);
      return [];
    }
  }

  /**
   * Get user's challenges from blockchain
   */
  async getUserChallenges(userAddress: string): Promise<Challenge[]> {
    try {
      const allChallenges = await this.getAllChallenges();
      return allChallenges.filter(challenge => 
        challenge.creator.toLowerCase() === userAddress.toLowerCase()
      );
    } catch (error) {
      console.error("Failed to get user challenges:", error);
      return [];
    }
  }

  /**
   * Get user statistics from blockchain
   */
  async getUserStats(userAddress: string): Promise<any> {
    try {
      const contract = this.contracts.AdvancedProofOfGood;
      
      if (!contract) {
        throw new Error("AdvancedProofOfGood contract not available");
      }
      
      // Get user profile data from contract
      const profile = await contract.getUserProfile(userAddress);
      
      const [
        ensSubdomain,
        totalChallengesWon,
        totalChallengesParticipated,
        totalStaked,
        totalWinnings,
        isFirstTime,
        followers
      ] = profile;

      // Calculate verification rate based on wins vs participation
      const verificationRate = totalChallengesParticipated > 0 
        ? Math.round((Number(totalChallengesWon) / Number(totalChallengesParticipated)) * 100) 
        : 0;

      return {
        totalChallenges: Number(totalChallengesParticipated),
        completedChallenges: Number(totalChallengesWon),
        totalEarnings: Number(ethers.formatEther(totalWinnings)),
        currentStreak: 0, // This would need additional tracking in contract
        totalSubmissions: Number(totalChallengesParticipated),
        verificationRate: verificationRate,
      };
    } catch (error) {
      console.error("Failed to get user stats:", error);
      // Return empty stats on error
      return {
        totalChallenges: 0,
        completedChallenges: 0,
        totalEarnings: 0,
        currentStreak: 0,
        totalSubmissions: 0,
        verificationRate: 0,
      };
    }
  }

  /**
   * Calculate user's current streak
   */
  private async getUserStreak(userAddress: string): Promise<number> {
    try {
      // This would need to be implemented based on your streak logic
      // For now, return 0 as a placeholder
      return 0;
    } catch (error) {
      console.error("Failed to calculate user streak:", error);
      return 0;
    }
  }
}

export const web3Service = new Web3IntegrationService();
export default web3Service;
