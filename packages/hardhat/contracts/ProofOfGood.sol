// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ProofOfGood is AccessControl, ReentrancyGuard {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    
    uint256 private _challengeIds;
    uint256 private _agreementIds;

    enum ChallengeType { COMMUNITY, CUSTOM, COMMUNITY_SERVICE }
    enum ChallengeStatus { ACTIVE, ENDED, CANCELLED }
    enum ProofStatus { PENDING, VERIFIED, REJECTED }
    enum ParticipantStatus { PARTICIPATING, WON, LOST, STAKE_RETURNED }

    struct Challenge {
        uint256 id;
        string title;
        string description;
        string category;
        address creator;
        ChallengeType challengeType;
        ChallengeStatus status;
        uint256 stakeAmount;
        uint256 deadline;
        uint256 maxParticipants;
        uint256 totalStaked;
        uint256 participantCount;
        address[] verifiers;
        bool requiresFollow;
        mapping(address => bool) allowedParticipants;
        address[] participants;
        mapping(address => ParticipantStatus) participantStatus;
        mapping(address => string) proofs;
        mapping(address => ProofStatus) proofStatus;
        uint256 winnersCount;
        uint256 rewardPerWinner;
        bool rewardsDistributed;
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
        mapping(address => bool) hasStaked;
        mapping(address => string) proofs;
        mapping(address => ProofStatus) proofStatus;
        mapping(address => bool) hasWon;
        bool agreementEnded;
        uint256 totalStaked;
    }

    struct UserProfile {
        string ensSubdomain;
        uint256 totalChallengesWon;
        uint256 totalChallengesParticipated;
        uint256 totalStaked;
        uint256 totalWinnings;
        bool isFirstTime;
        mapping(address => bool) following;
        address[] followers;
    }

    struct ChallengeComment {
        address commenter;
        string content;
        uint256 timestamp;
    }

    mapping(uint256 => Challenge) public challenges;
    mapping(uint256 => Agreement) public agreements;
    mapping(address => UserProfile) public userProfiles;
    mapping(uint256 => mapping(address => bool)) public challengeLikes;
    mapping(uint256 => uint256) public challengeLikesCount;
    mapping(uint256 => ChallengeComment[]) public challengeComments;
    mapping(string => address) public ensSubdomainToAddress;
    mapping(address => string) public addressToEnsSubdomain;

    uint256 public constant PLATFORM_FEE_PERCENTAGE = 5; // 5%
    uint256 public constant COMMUNITY_FUND_PERCENTAGE = 10; // 10%
    uint256 public communityFund;
    address public platformOwner;

    event ChallengeCreated(uint256 indexed challengeId, address indexed creator, ChallengeType challengeType);
    event ChallengeJoined(uint256 indexed challengeId, address indexed participant);
    event ProofSubmitted(uint256 indexed challengeId, address indexed participant, string proof);
    event ProofVerified(uint256 indexed challengeId, address indexed participant, bool verified);
    event ChallengeEnded(uint256 indexed challengeId);
    event RewardsDistributed(uint256 indexed challengeId);
    event AgreementCreated(uint256 indexed agreementId, address indexed creator);
    event AgreementJoined(uint256 indexed agreementId, address indexed party);
    event AgreementEnded(uint256 indexed agreementId);
    event ENSSubdomainAssigned(address indexed user, string subdomain);
    event UserFollowed(address indexed follower, address indexed followed);
    event ChallengeLiked(uint256 indexed challengeId, address indexed liker);
    event ChallengeCommented(uint256 indexed challengeId, address indexed commenter, string content);

    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, msg.sender), "Not an admin");
        _;
    }

    modifier onlyVerifier() {
        require(hasRole(VERIFIER_ROLE, msg.sender), "Not a verifier");
        _;
    }

    modifier challengeExists(uint256 challengeId) {
        require(challengeId <= _challengeIds && challengeId > 0, "Challenge does not exist");
        _;
    }

    modifier agreementExists(uint256 agreementId) {
        require(agreementId <= _agreementIds && agreementId > 0, "Agreement does not exist");
        _;
    }

    constructor() {
        platformOwner = msg.sender;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(VERIFIER_ROLE, msg.sender);
    }

    function createChallenge(
        string memory title,
        string memory description,
        string memory category,
        ChallengeType challengeType,
        uint256 stakeAmount,
        uint256 deadline,
        uint256 maxParticipants,
        address[] memory verifiers,
        bool requiresFollow
    ) external returns (uint256) {
        require(deadline > block.timestamp, "Deadline must be in the future");
        require(maxParticipants > 0, "Max participants must be greater than 0");
        
        if (challengeType == ChallengeType.CUSTOM) {
            require(verifiers.length > 0, "Custom challenges require verifiers");
        }

        uint256 challengeId = ++_challengeIds;

        Challenge storage newChallenge = challenges[challengeId];
        newChallenge.id = challengeId;
        newChallenge.title = title;
        newChallenge.description = description;
        newChallenge.category = category;
        newChallenge.creator = msg.sender;
        newChallenge.challengeType = challengeType;
        newChallenge.status = ChallengeStatus.ACTIVE;
        newChallenge.stakeAmount = stakeAmount;
        newChallenge.deadline = deadline;
        newChallenge.maxParticipants = maxParticipants;
        newChallenge.verifiers = verifiers;
        newChallenge.requiresFollow = requiresFollow;

        emit ChallengeCreated(challengeId, msg.sender, challengeType);
        return challengeId;
    }

    function joinChallenge(uint256 challengeId) external payable challengeExists(challengeId) nonReentrant {
        Challenge storage challenge = challenges[challengeId];
        
        require(challenge.status == ChallengeStatus.ACTIVE, "Challenge is not active");
        require(block.timestamp < challenge.deadline, "Challenge deadline has passed");
        require(challenge.participantCount < challenge.maxParticipants, "Challenge is full");
        require(challenge.participantStatus[msg.sender] == ParticipantStatus.PARTICIPATING || 
                challenge.participantStatus[msg.sender] == ParticipantStatus(0), "Already participating");

        if (challenge.requiresFollow && challenge.challengeType == ChallengeType.CUSTOM) {
            require(userProfiles[msg.sender].following[challenge.creator], "Must be following creator");
        }

        // Handle staking
        if (challenge.challengeType != ChallengeType.COMMUNITY_SERVICE) {
            if (userProfiles[msg.sender].isFirstTime) {
                // First time users get free participation
                userProfiles[msg.sender].isFirstTime = false;
            } else {
                require(msg.value == challenge.stakeAmount, "Incorrect stake amount");
                challenge.totalStaked += msg.value;
            }
        }

        challenge.participants.push(msg.sender);
        challenge.participantStatus[msg.sender] = ParticipantStatus.PARTICIPATING;
        challenge.participantCount++;
        userProfiles[msg.sender].totalChallengesParticipated++;

        emit ChallengeJoined(challengeId, msg.sender);
    }

    function submitProof(uint256 challengeId, string memory proof) external challengeExists(challengeId) {
        Challenge storage challenge = challenges[challengeId];
        
        require(challenge.status == ChallengeStatus.ACTIVE, "Challenge is not active");
        require(challenge.participantStatus[msg.sender] == ParticipantStatus.PARTICIPATING, "Not participating");
        require(block.timestamp <= challenge.deadline, "Deadline has passed");

        challenge.proofs[msg.sender] = proof;
        challenge.proofStatus[msg.sender] = ProofStatus.PENDING;

        emit ProofSubmitted(challengeId, msg.sender, proof);
    }

    function verifyProof(uint256 challengeId, address participant, bool isValid) external challengeExists(challengeId) {
        Challenge storage challenge = challenges[challengeId];
        
        require(block.timestamp > challenge.deadline, "Challenge still active");
        require(challenge.proofStatus[participant] == ProofStatus.PENDING, "Proof not pending");
        
        // Check if sender is authorized verifier
        bool isAuthorizedVerifier = false;
        if (challenge.challengeType == ChallengeType.COMMUNITY || challenge.challengeType == ChallengeType.COMMUNITY_SERVICE) {
            isAuthorizedVerifier = hasRole(VERIFIER_ROLE, msg.sender);
        } else {
            for (uint i = 0; i < challenge.verifiers.length; i++) {
                if (challenge.verifiers[i] == msg.sender) {
                    isAuthorizedVerifier = true;
                    break;
                }
            }
        }
        require(isAuthorizedVerifier, "Not authorized to verify");

        challenge.proofStatus[participant] = isValid ? ProofStatus.VERIFIED : ProofStatus.REJECTED;
        
        if (!isValid) {
            challenge.participantStatus[participant] = ParticipantStatus.LOST;
        }

        emit ProofVerified(challengeId, participant, isValid);
    }

    function endChallenge(uint256 challengeId) external challengeExists(challengeId) {
        Challenge storage challenge = challenges[challengeId];
        
        require(block.timestamp > challenge.deadline, "Challenge still active");
        require(challenge.status == ChallengeStatus.ACTIVE, "Challenge already ended");
        require(!challenge.rewardsDistributed, "Rewards already distributed");

        challenge.status = ChallengeStatus.ENDED;

        // Count verified participants
        address[] memory verifiedParticipants = new address[](challenge.participantCount);
        uint256 verifiedCount = 0;

        for (uint i = 0; i < challenge.participants.length; i++) {
            address participant = challenge.participants[i];
            if (challenge.proofStatus[participant] == ProofStatus.VERIFIED) {
                verifiedParticipants[verifiedCount] = participant;
                verifiedCount++;
            }
        }

        if (verifiedCount > 0 && challenge.totalStaked > 0) {
            _distributeRewards(challengeId, verifiedParticipants, verifiedCount);
        }

        emit ChallengeEnded(challengeId);
    }

    function _distributeRewards(uint256 challengeId, address[] memory verifiedParticipants, uint256 verifiedCount) internal {
        Challenge storage challenge = challenges[challengeId];
        
        uint256 platformFee = (challenge.totalStaked * PLATFORM_FEE_PERCENTAGE) / 100;
        uint256 communityFundAmount = (challenge.totalStaked * COMMUNITY_FUND_PERCENTAGE) / 100;
        uint256 remainingPool = challenge.totalStaked - platformFee - communityFundAmount;

        // Transfer platform fee
        payable(platformOwner).transfer(platformFee);
        communityFund += communityFundAmount;

        // Randomly select winners (simplified random selection)
        uint256 winnersToSelect = verifiedCount > 3 ? 3 : verifiedCount;
        uint256 rewardPerWinner = remainingPool / winnersToSelect;

        for (uint i = 0; i < winnersToSelect; i++) {
            address winner = verifiedParticipants[i];
            challenge.participantStatus[winner] = ParticipantStatus.WON;
            userProfiles[winner].totalChallengesWon++;
            userProfiles[winner].totalWinnings += rewardPerWinner;
            payable(winner).transfer(rewardPerWinner);
        }

        // Return stakes to non-selected verified participants
        for (uint i = winnersToSelect; i < verifiedCount; i++) {
            address participant = verifiedParticipants[i];
            challenge.participantStatus[participant] = ParticipantStatus.STAKE_RETURNED;
            payable(participant).transfer(challenge.stakeAmount);
        }

        challenge.rewardsDistributed = true;
        challenge.winnersCount = winnersToSelect;
        challenge.rewardPerWinner = rewardPerWinner;

        emit RewardsDistributed(challengeId);
    }

    function createAgreement(
        string memory title,
        string memory description,
        uint256 stakeAmount,
        uint256 deadline,
        address[] memory parties,
        address[] memory verifiers
    ) external returns (uint256) {
        require(deadline > block.timestamp, "Deadline must be in the future");
        require(parties.length >= 2, "Agreement requires at least 2 parties");
        require(verifiers.length > 0, "Agreement requires verifiers");

        uint256 agreementId = ++_agreementIds;

        Agreement storage newAgreement = agreements[agreementId];
        newAgreement.id = agreementId;
        newAgreement.title = title;
        newAgreement.description = description;
        newAgreement.creator = msg.sender;
        newAgreement.stakeAmount = stakeAmount;
        newAgreement.deadline = deadline;
        newAgreement.parties = parties;
        newAgreement.verifiers = verifiers;

        emit AgreementCreated(agreementId, msg.sender);
        return agreementId;
    }

    function joinAgreement(uint256 agreementId) external payable agreementExists(agreementId) nonReentrant {
        Agreement storage agreement = agreements[agreementId];
        
        require(!agreement.agreementEnded, "Agreement has ended");
        require(block.timestamp < agreement.deadline, "Agreement deadline has passed");
        require(!agreement.hasStaked[msg.sender], "Already staked");
        
        // Check if sender is a party to the agreement
        bool isParty = false;
        for (uint i = 0; i < agreement.parties.length; i++) {
            if (agreement.parties[i] == msg.sender) {
                isParty = true;
                break;
            }
        }
        require(isParty, "Not a party to this agreement");

        require(msg.value == agreement.stakeAmount, "Incorrect stake amount");
        
        agreement.hasStaked[msg.sender] = true;
        agreement.totalStaked += msg.value;

        emit AgreementJoined(agreementId, msg.sender);
    }

    function submitAgreementProof(uint256 agreementId, string memory proof) external agreementExists(agreementId) {
        Agreement storage agreement = agreements[agreementId];
        
        require(!agreement.agreementEnded, "Agreement has ended");
        require(agreement.hasStaked[msg.sender], "Must stake first");
        require(block.timestamp <= agreement.deadline, "Deadline has passed");

        agreement.proofs[msg.sender] = proof;
        agreement.proofStatus[msg.sender] = ProofStatus.PENDING;
    }

    function verifyAgreementProof(uint256 agreementId, address party, bool isValid) external agreementExists(agreementId) {
        Agreement storage agreement = agreements[agreementId];
        
        require(block.timestamp > agreement.deadline, "Agreement still active");
        require(agreement.proofStatus[party] == ProofStatus.PENDING, "Proof not pending");
        
        // Check if sender is authorized verifier
        bool isAuthorizedVerifier = false;
        for (uint i = 0; i < agreement.verifiers.length; i++) {
            if (agreement.verifiers[i] == msg.sender) {
                isAuthorizedVerifier = true;
                break;
            }
        }
        require(isAuthorizedVerifier, "Not authorized to verify");

        agreement.proofStatus[party] = isValid ? ProofStatus.VERIFIED : ProofStatus.REJECTED;
        if (isValid) {
            agreement.hasWon[party] = true;
        }
    }

    function endAgreement(uint256 agreementId) external agreementExists(agreementId) nonReentrant {
        Agreement storage agreement = agreements[agreementId];
        
        require(block.timestamp > agreement.deadline, "Agreement still active");
        require(!agreement.agreementEnded, "Agreement already ended");

        agreement.agreementEnded = true;

        // Count winners
        uint256 winnersCount = 0;
        for (uint i = 0; i < agreement.parties.length; i++) {
            if (agreement.hasWon[agreement.parties[i]]) {
                winnersCount++;
            }
        }

        if (winnersCount == agreement.parties.length) {
            // All parties fulfilled agreement, return stakes
            for (uint i = 0; i < agreement.parties.length; i++) {
                payable(agreement.parties[i]).transfer(agreement.stakeAmount);
            }
        } else if (winnersCount > 0) {
            // Some parties fulfilled, winners split the pool
            uint256 rewardPerWinner = agreement.totalStaked / winnersCount;
            for (uint i = 0; i < agreement.parties.length; i++) {
                if (agreement.hasWon[agreement.parties[i]]) {
                    payable(agreement.parties[i]).transfer(rewardPerWinner);
                }
            }
        }

        emit AgreementEnded(agreementId);
    }

    function assignENSSubdomain(address user, string memory subdomain) external onlyAdmin {
        require(ensSubdomainToAddress[subdomain] == address(0), "Subdomain already taken");
        require(bytes(addressToEnsSubdomain[user]).length == 0, "User already has subdomain");
        
        ensSubdomainToAddress[subdomain] = user;
        addressToEnsSubdomain[user] = subdomain;
        userProfiles[user].ensSubdomain = subdomain;
        userProfiles[user].isFirstTime = true;

        emit ENSSubdomainAssigned(user, subdomain);
    }

    function followUser(address userToFollow) external {
        require(userToFollow != msg.sender, "Cannot follow yourself");
        require(!userProfiles[msg.sender].following[userToFollow], "Already following");

        userProfiles[msg.sender].following[userToFollow] = true;
        userProfiles[userToFollow].followers.push(msg.sender);

        emit UserFollowed(msg.sender, userToFollow);
    }

    function likeChallenge(uint256 challengeId) external challengeExists(challengeId) {
        require(!challengeLikes[challengeId][msg.sender], "Already liked");
        
        challengeLikes[challengeId][msg.sender] = true;
        challengeLikesCount[challengeId]++;

        emit ChallengeLiked(challengeId, msg.sender);
    }

    function commentOnChallenge(uint256 challengeId, string memory content) external challengeExists(challengeId) {
        require(bytes(content).length > 0, "Comment cannot be empty");
        
        challengeComments[challengeId].push(ChallengeComment({
            commenter: msg.sender,
            content: content,
            timestamp: block.timestamp
        }));

        emit ChallengeCommented(challengeId, msg.sender, content);
    }

    function grantRole(bytes32 role, address account) public override onlyAdmin {
        _grantRole(role, account);
    }

    function revokeRole(bytes32 role, address account) public override onlyAdmin {
        _revokeRole(role, account);
    }

    // View functions
    function getChallenge(uint256 challengeId) external view challengeExists(challengeId) returns (
        uint256 id,
        string memory title,
        string memory description,
        string memory category,
        address creator,
        ChallengeType challengeType,
        ChallengeStatus status,
        uint256 stakeAmount,
        uint256 deadline,
        uint256 maxParticipants,
        uint256 totalStaked,
        uint256 participantCount,
        address[] memory verifiers,
        bool requiresFollow,
        uint256 winnersCount,
        uint256 rewardPerWinner,
        bool rewardsDistributed
    ) {
        Challenge storage challenge = challenges[challengeId];
        return (
            challenge.id,
            challenge.title,
            challenge.description,
            challenge.category,
            challenge.creator,
            challenge.challengeType,
            challenge.status,
            challenge.stakeAmount,
            challenge.deadline,
            challenge.maxParticipants,
            challenge.totalStaked,
            challenge.participantCount,
            challenge.verifiers,
            challenge.requiresFollow,
            challenge.winnersCount,
            challenge.rewardPerWinner,
            challenge.rewardsDistributed
        );
    }

    function getChallengeParticipants(uint256 challengeId) external view challengeExists(challengeId) returns (address[] memory) {
        return challenges[challengeId].participants;
    }

    function getChallengeComments(uint256 challengeId) external view challengeExists(challengeId) returns (ChallengeComment[] memory) {
        return challengeComments[challengeId];
    }

    function getUserProfile(address user) external view returns (
        string memory ensSubdomain,
        uint256 totalChallengesWon,
        uint256 totalChallengesParticipated,
        uint256 totalStaked,
        uint256 totalWinnings,
        bool isFirstTime,
        address[] memory followers
    ) {
        UserProfile storage profile = userProfiles[user];
        return (
            profile.ensSubdomain,
            profile.totalChallengesWon,
            profile.totalChallengesParticipated,
            profile.totalStaked,
            profile.totalWinnings,
            profile.isFirstTime,
            profile.followers
        );
    }

    function getTotalChallenges() external view returns (uint256) {
        return _challengeIds;
    }

    function getTotalAgreements() external view returns (uint256) {
        return _agreementIds;
    }

    function isFollowing(address follower, address followed) external view returns (bool) {
        return userProfiles[follower].following[followed];
    }

    function getParticipantStatus(uint256 challengeId, address participant) external view returns (ParticipantStatus) {
        return challenges[challengeId].participantStatus[participant];
    }

    function getProofStatus(uint256 challengeId, address participant) external view returns (ProofStatus) {
        return challenges[challengeId].proofStatus[participant];
    }

    function getProof(uint256 challengeId, address participant) external view returns (string memory) {
        return challenges[challengeId].proofs[participant];
    }

    function withdrawCommunityFund(uint256 amount) external onlyAdmin nonReentrant {
        require(amount <= communityFund, "Insufficient community fund");
        communityFund -= amount;
        payable(msg.sender).transfer(amount);
    }

    receive() external payable {
        communityFund += msg.value;
    }
}
