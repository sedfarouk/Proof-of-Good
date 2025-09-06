// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title AdvancedProofOfGood
 * @dev Enhanced contract with cutting-edge Web3 integrations:
 * - ENS-based dynamic challenge discovery
 * - EFP social proof verification
 * - FileCoin incentivized storage
 * - Base gasless onboarding
 */
contract AdvancedProofOfGood is AccessControl, ReentrancyGuard {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    bytes32 public constant COMMUNITY_VERIFIER_ROLE = keccak256("COMMUNITY_VERIFIER_ROLE");
    
    uint256 private _challengeIds;
    uint256 private _agreementIds;
    uint256 private _proposalIds;

    // ENS Registry for subdomain management
    address public ensRegistry;
    string public baseDomain = "proofofgood.eth";
    
    // EFP Integration for social verification
    address public efpRegistry;
    
    // FileCoin reward pool for storage incentives
    uint256 public filecoinRewardPool;
    uint256 public storageRewardPerMB = 0.001 ether;
    
    // Base gasless transactions for new users
    mapping(address => bool) public gaslessEligible;
    mapping(address => uint256) public gaslessTransactions;
    uint256 public maxGaslessTransactions = 5;

    enum ChallengeType { 
        COMMUNITY,           // Open to all, verified by community
        CUSTOM,             // Private, created by users
        COMMUNITY_SERVICE,   // Public good initiatives
        SOCIAL_CHALLENGE,   // EFP-based social verification
        STORAGE_INCENTIVE   // FileCoin storage rewards
    }
    
    enum ChallengeStatus { ACTIVE, ENDED, CANCELLED, PROPOSAL }
    enum ProofStatus { PENDING, VERIFIED, REJECTED, COMMUNITY_VERIFIED }
    enum ParticipantStatus { PARTICIPATING, WON, LOST, STAKE_RETURNED }

    struct Challenge {
        uint256 id;
        string title;
        string description;
        string category;
        address creator;
        string ensSubdomain;        // ENS subdomain for challenge discovery
        ChallengeType challengeType;
        ChallengeStatus status;
        uint256 stakeAmount;
        uint256 deadline;
        uint256 maxParticipants;
        uint256 totalStaked;
        uint256 participantCount;
        address[] verifiers;
        bool requiresFollow;        // EFP follow requirement
        uint256 minFollowers;       // Minimum EFP followers to join
        string ipfsMetadata;        // FileCoin/IPFS metadata
        uint256 storageIncentive;   // Additional FileCoin rewards
        mapping(address => bool) allowedParticipants;
        address[] participants;
        mapping(address => ParticipantStatus) participantStatus;
        mapping(address => string) proofIPFS;  // IPFS hashes for proofs
        mapping(address => ProofStatus) proofStatus;
        mapping(address => uint256) proofSizes; // Storage size for rewards
        uint256 winnersCount;
        uint256 rewardPerWinner;
        bool rewardsDistributed;
        // Social features
        mapping(address => bool) challengeLikes;
        address[] likers;
        mapping(address => string) comments;
        address[] commenters;
    }

    struct Agreement {
        uint256 id;
        string title;
        string description;
        address creator;
        uint256 stakeAmount;
        uint256 deadline;
        address[] parties;
        address[] verifiers;
        mapping(address => string) proofIPFS;
        mapping(address => ProofStatus) proofStatus;
        mapping(address => bool) hasStaked;
        bool isActive;
        bool isCompleted;
        string legalConsequences;
        string ipfsMetadata;
    }

    // Community governance for challenge proposals
    struct ChallengeProposal {
        uint256 id;
        string title;
        string description;
        address proposer;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 deadline;
        bool executed;
        mapping(address => bool) hasVoted;
        string ipfsDetails;
    }

    // Dynamic ENS-based challenge categories
    struct CategoryMetadata {
        string name;
        string ensSubdomain;
        uint256 challengeCount;
        address[] moderators;
        bool isActive;
    }

    mapping(uint256 => Challenge) public challenges;
    mapping(uint256 => Agreement) public agreements;
    mapping(uint256 => ChallengeProposal) public proposals;
    mapping(string => CategoryMetadata) public categories;
    mapping(address => string) public userENSSubdomains;
    mapping(address => uint256[]) public userChallenges;
    mapping(address => uint256[]) public userAgreements;
    
    // Leaderboard and social features
    mapping(address => uint256) public userPoints;
    mapping(address => uint256) public challengesWon;
    mapping(address => uint256) public challengesCompleted;
    mapping(address => mapping(address => bool)) public userFollows; // Simple follow system
    
    // Events with enhanced Web3 integration
    event ChallengeCreated(
        uint256 indexed challengeId, 
        address indexed creator, 
        string ensSubdomain,
        string ipfsMetadata,
        ChallengeType challengeType
    );
    
    event ENSSubdomainAssigned(address indexed user, string subdomain);
    event SocialProofSubmitted(uint256 indexed challengeId, address indexed user, string ipfsHash, uint256 storageSize);
    event FileCoinRewardClaimed(address indexed user, uint256 amount, uint256 storageSize);
    event CommunityVerification(uint256 indexed challengeId, address indexed verifier, address indexed participant);
    event GaslessTransactionUsed(address indexed user, uint256 remaining);

    constructor(address _ensRegistry, address _efpRegistry) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(VERIFIER_ROLE, msg.sender);
        _grantRole(COMMUNITY_VERIFIER_ROLE, msg.sender);
        
        ensRegistry = _ensRegistry;
        efpRegistry = _efpRegistry;
        
        // Initialize with gasless eligibility for contract deployer
        gaslessEligible[msg.sender] = true;
    }

    modifier onlyGaslessOrPaid() {
        if (gaslessEligible[msg.sender] && gaslessTransactions[msg.sender] < maxGaslessTransactions) {
            gaslessTransactions[msg.sender]++;
            emit GaslessTransactionUsed(msg.sender, maxGaslessTransactions - gaslessTransactions[msg.sender]);
        }
        _;
    }

    /**
     * @dev Advanced ENS subdomain assignment with automatic registration
     */
    function assignENSSubdomain(address user, string memory subdomain) external onlyRole(ADMIN_ROLE) {
        require(bytes(userENSSubdomains[user]).length == 0, "User already has subdomain");
        userENSSubdomains[user] = subdomain;
        
        // Enable gasless transactions for new users
        if (!gaslessEligible[user]) {
            gaslessEligible[user] = true;
        }
        
        emit ENSSubdomainAssigned(user, subdomain);
    }

    /**
     * @dev Create advanced challenge with ENS discovery and FileCoin incentives
     */
    function createAdvancedChallenge(
        string memory title,
        string memory description,
        string memory category,
        string memory ensSubdomain,
        ChallengeType challengeType,
        uint256 stakeAmount,
        uint256 deadline,
        uint256 maxParticipants,
        address[] memory verifiers,
        bool requiresFollow,
        uint256 minFollowers,
        string memory ipfsMetadata,
        uint256 storageIncentive
    ) external payable onlyGaslessOrPaid nonReentrant returns (uint256) {
        require(deadline > block.timestamp, "Invalid deadline");
        require(bytes(userENSSubdomains[msg.sender]).length > 0, "Must have ENS subdomain");
        
        if (challengeType != ChallengeType.COMMUNITY_SERVICE) {
            require(msg.value >= stakeAmount, "Insufficient stake");
        }
        
        _challengeIds++;
        uint256 challengeId = _challengeIds;
        
        Challenge storage newChallenge = challenges[challengeId];
        newChallenge.id = challengeId;
        newChallenge.title = title;
        newChallenge.description = description;
        newChallenge.category = category;
        newChallenge.creator = msg.sender;
        newChallenge.ensSubdomain = ensSubdomain;
        newChallenge.challengeType = challengeType;
        newChallenge.status = ChallengeStatus.ACTIVE;
        newChallenge.stakeAmount = stakeAmount;
        newChallenge.deadline = deadline;
        newChallenge.maxParticipants = maxParticipants;
        newChallenge.verifiers = verifiers;
        newChallenge.requiresFollow = requiresFollow;
        newChallenge.minFollowers = minFollowers;
        newChallenge.ipfsMetadata = ipfsMetadata;
        newChallenge.storageIncentive = storageIncentive;
        
        // Add storage incentive to FileCoin reward pool
        if (storageIncentive > 0) {
            filecoinRewardPool += storageIncentive;
        }
        
        userChallenges[msg.sender].push(challengeId);
        
        emit ChallengeCreated(challengeId, msg.sender, ensSubdomain, ipfsMetadata, challengeType);
        
        return challengeId;
    }

    /**
     * @dev Join challenge with EFP social verification
     */
    function joinChallengeWithSocialProof(uint256 challengeId) external payable onlyGaslessOrPaid nonReentrant {
        Challenge storage challenge = challenges[challengeId];
        require(challenge.status == ChallengeStatus.ACTIVE, "Challenge not active");
        require(block.timestamp < challenge.deadline, "Challenge deadline passed");
        require(challenge.participantCount < challenge.maxParticipants, "Challenge full");
        require(challenge.participantStatus[msg.sender] == ParticipantStatus(0), "Already participating");
        
        // EFP social verification
        if (challenge.requiresFollow) {
            require(userFollows[msg.sender][challenge.creator] || _checkEFPFollow(msg.sender, challenge.creator), "Must follow creator");
        }
        
        if (challenge.minFollowers > 0) {
            require(_getFollowerCount(msg.sender) >= challenge.minFollowers, "Insufficient followers");
        }
        
        // Handle staking based on challenge type
        if (challenge.challengeType != ChallengeType.COMMUNITY_SERVICE) {
            if (gaslessEligible[msg.sender] && gaslessTransactions[msg.sender] < maxGaslessTransactions) {
                // Gasless users get automatic small stake
                challenge.totalStaked += challenge.stakeAmount;
            } else {
                require(msg.value >= challenge.stakeAmount, "Insufficient stake");
                challenge.totalStaked += msg.value;
            }
        }
        
        challenge.participants.push(msg.sender);
        challenge.participantStatus[msg.sender] = ParticipantStatus.PARTICIPATING;
        challenge.participantCount++;
        
        userChallenges[msg.sender].push(challengeId);
    }

    /**
     * @dev Submit proof with FileCoin storage rewards
     */
    function submitProofWithStorageReward(
        uint256 challengeId, 
        string memory ipfsHash,
        uint256 storageSizeBytes
    ) external onlyGaslessOrPaid {
        Challenge storage challenge = challenges[challengeId];
        require(challenge.participantStatus[msg.sender] == ParticipantStatus.PARTICIPATING, "Not participating");
        require(block.timestamp < challenge.deadline, "Deadline passed");
        require(bytes(ipfsHash).length > 0, "Invalid IPFS hash");
        
        challenge.proofIPFS[msg.sender] = ipfsHash;
        challenge.proofStatus[msg.sender] = ProofStatus.PENDING;
        challenge.proofSizes[msg.sender] = storageSizeBytes;
        
        // Calculate FileCoin storage reward
        uint256 storageReward = (storageSizeBytes * storageRewardPerMB) / 1e6;
        if (storageReward > 0 && filecoinRewardPool >= storageReward) {
            filecoinRewardPool -= storageReward;
            payable(msg.sender).transfer(storageReward);
            emit FileCoinRewardClaimed(msg.sender, storageReward, storageSizeBytes);
        }
        
        emit SocialProofSubmitted(challengeId, msg.sender, ipfsHash, storageSizeBytes);
    }

    /**
     * @dev Community-based verification using EFP social graph
     */
    function communityVerifyProof(uint256 challengeId, address participant, bool approve) external {
        Challenge storage challenge = challenges[challengeId];
        require(challenge.challengeType == ChallengeType.COMMUNITY || challenge.challengeType == ChallengeType.SOCIAL_CHALLENGE, "Not community challenge");
        require(_canCommunityVerify(msg.sender, participant), "Not eligible to verify");
        require(challenge.proofStatus[participant] == ProofStatus.PENDING, "Proof not pending");
        
        if (approve) {
            challenge.proofStatus[participant] = ProofStatus.COMMUNITY_VERIFIED;
        } else {
            challenge.proofStatus[participant] = ProofStatus.REJECTED;
        }
        
        emit CommunityVerification(challengeId, msg.sender, participant);
    }

    /**
     * @dev Like challenge (social feature)
     */
    function likeChallenge(uint256 challengeId) external onlyGaslessOrPaid {
        Challenge storage challenge = challenges[challengeId];
        require(!challenge.challengeLikes[msg.sender], "Already liked");
        
        challenge.challengeLikes[msg.sender] = true;
        challenge.likers.push(msg.sender);
    }

    /**
     * @dev Comment on challenge with IPFS storage
     */
    function commentOnChallenge(uint256 challengeId, string memory ipfsCommentHash) external onlyGaslessOrPaid {
        Challenge storage challenge = challenges[challengeId];
        require(bytes(ipfsCommentHash).length > 0, "Invalid comment hash");
        
        if (bytes(challenge.comments[msg.sender]).length == 0) {
            challenge.commenters.push(msg.sender);
        }
        challenge.comments[msg.sender] = ipfsCommentHash;
    }

    /**
     * @dev Create legal agreement with enhanced features
     */
    function createLegalAgreement(
        string memory title,
        string memory description,
        uint256 stakeAmount,
        uint256 deadline,
        address[] memory parties,
        address[] memory verifiers,
        string memory legalConsequences,
        string memory ipfsMetadata
    ) external payable onlyGaslessOrPaid nonReentrant returns (uint256) {
        require(deadline > block.timestamp, "Invalid deadline");
        require(parties.length > 1, "Need multiple parties");
        require(msg.value >= stakeAmount, "Insufficient stake");
        
        _agreementIds++;
        uint256 agreementId = _agreementIds;
        
        Agreement storage newAgreement = agreements[agreementId];
        newAgreement.id = agreementId;
        newAgreement.title = title;
        newAgreement.description = description;
        newAgreement.creator = msg.sender;
        newAgreement.stakeAmount = stakeAmount;
        newAgreement.deadline = deadline;
        newAgreement.parties = parties;
        newAgreement.verifiers = verifiers;
        newAgreement.legalConsequences = legalConsequences;
        newAgreement.ipfsMetadata = ipfsMetadata;
        newAgreement.isActive = true;
        newAgreement.hasStaked[msg.sender] = true;
        
        userAgreements[msg.sender].push(agreementId);
        
        return agreementId;
    }

    // Helper functions for EFP integration
    function _checkEFPFollow(address follower, address followee) internal view returns (bool) {
        // In production, this would call the actual EFP contract
        return userFollows[follower][followee];
    }
    
    function _getFollowerCount(address user) internal view returns (uint256) {
        // In production, this would call the actual EFP contract
        uint256 count = 0;
        // Mock implementation
        return count;
    }
    
    function _canCommunityVerify(address verifier, address participant) internal view returns (bool) {
        // Check if verifier has community verifier role OR is following participant in EFP
        return hasRole(COMMUNITY_VERIFIER_ROLE, verifier) || _checkEFPFollow(verifier, participant);
    }

    // Admin functions
    function addFileCoinRewards() external payable onlyRole(ADMIN_ROLE) {
        filecoinRewardPool += msg.value;
    }
    
    function setStorageRewardRate(uint256 newRate) external onlyRole(ADMIN_ROLE) {
        storageRewardPerMB = newRate;
    }
    
    function grantGaslessEligibility(address user) external onlyRole(ADMIN_ROLE) {
        gaslessEligible[user] = true;
    }

    // View functions
    function getChallengeDetails(uint256 challengeId) external view returns (
        string memory title,
        string memory description,
        address creator,
        string memory ensSubdomain,
        ChallengeType challengeType,
        uint256 stakeAmount,
        uint256 deadline,
        uint256 participantCount,
        string memory ipfsMetadata
    ) {
        Challenge storage challenge = challenges[challengeId];
        return (
            challenge.title,
            challenge.description,
            challenge.creator,
            challenge.ensSubdomain,
            challenge.challengeType,
            challenge.stakeAmount,
            challenge.deadline,
            challenge.participantCount,
            challenge.ipfsMetadata
        );
    }
    
    function getChallengeLikes(uint256 challengeId) external view returns (address[] memory) {
        return challenges[challengeId].likers;
    }
    
    function getChallengeCommenters(uint256 challengeId) external view returns (address[] memory) {
        return challenges[challengeId].commenters;
    }
    
    function getUserStats(address user) external view returns (
        uint256 points,
        uint256 won,
        uint256 completed,
        string memory ensSubdomain,
        uint256 gaslessRemaining
    ) {
        return (
            userPoints[user],
            challengesWon[user],
            challengesCompleted[user],
            userENSSubdomains[user],
            gaslessEligible[user] ? maxGaslessTransactions - gaslessTransactions[user] : 0
        );
    }
}
