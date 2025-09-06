// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract CommunityBadges is ERC721, ERC721URIStorage, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    uint256 private _tokenIdCounter;

    enum BadgeType { CHALLENGE_WINNER, CHALLENGE_PARTICIPANT, VERIFIER, COMMUNITY_CONTRIBUTOR, AGREEMENT_KEEPER }

    struct Badge {
        string name;
        string description;
        BadgeType badgeType;
        uint256 challengeId;
        uint256 timestamp;
    }

    mapping(uint256 => Badge) public badges;
    mapping(address => uint256[]) public userBadges;
    mapping(address => mapping(BadgeType => uint256)) public userBadgeCount;

    event BadgeMinted(
        address indexed recipient,
        uint256 indexed tokenId,
        BadgeType badgeType,
        uint256 challengeId
    );

    constructor() ERC721("ProofOfGood Badges", "POGB") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    function mintBadge(
        address to,
        string memory name,
        string memory description,
        string memory badgeTokenURI,
        BadgeType badgeType,
        uint256 challengeId
    ) public onlyRole(MINTER_ROLE) returns (uint256) {
        uint256 tokenId = ++_tokenIdCounter;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, badgeTokenURI);

        badges[tokenId] = Badge({
            name: name,
            description: description,
            badgeType: badgeType,
            challengeId: challengeId,
            timestamp: block.timestamp
        });

        userBadges[to].push(tokenId);
        userBadgeCount[to][badgeType]++;

        emit BadgeMinted(to, tokenId, badgeType, challengeId);
        return tokenId;
    }

    function mintChallengeWinnerBadge(address to, uint256 challengeId, string memory badgeTokenURI) external onlyRole(MINTER_ROLE) returns (uint256) {
        return mintBadge(
            to,
            "Challenge Winner",
            "Awarded for winning a challenge",
            badgeTokenURI,
            BadgeType.CHALLENGE_WINNER,
            challengeId
        );
    }

    function mintParticipationBadge(address to, uint256 challengeId, string memory badgeTokenURI) external onlyRole(MINTER_ROLE) returns (uint256) {
        return mintBadge(
            to,
            "Challenge Participant",
            "Awarded for participating in a challenge",
            badgeTokenURI,
            BadgeType.CHALLENGE_PARTICIPANT,
            challengeId
        );
    }

    function mintVerifierBadge(address to, string memory badgeTokenURI) external onlyRole(MINTER_ROLE) returns (uint256) {
        return mintBadge(
            to,
            "Trusted Verifier",
            "Awarded for being a trusted verifier",
            badgeTokenURI,
            BadgeType.VERIFIER,
            0
        );
    }

    function mintCommunityContributorBadge(address to, string memory badgeTokenURI) external onlyRole(MINTER_ROLE) returns (uint256) {
        return mintBadge(
            to,
            "Community Contributor",
            "Awarded for contributing to the community",
            badgeTokenURI,
            BadgeType.COMMUNITY_CONTRIBUTOR,
            0
        );
    }

    function mintAgreementKeeperBadge(address to, uint256 agreementId, string memory badgeTokenURI) external onlyRole(MINTER_ROLE) returns (uint256) {
        return mintBadge(
            to,
            "Agreement Keeper",
            "Awarded for fulfilling an agreement",
            badgeTokenURI,
            BadgeType.AGREEMENT_KEEPER,
            agreementId
        );
    }

    function getUserBadges(address user) external view returns (uint256[] memory) {
        return userBadges[user];
    }

    function getUserBadgeCount(address user, BadgeType badgeType) external view returns (uint256) {
        return userBadgeCount[user][badgeType];
    }

    function getBadge(uint256 tokenId) external view returns (Badge memory) {
        require(_ownerOf(tokenId) != address(0), "Badge does not exist");
        return badges[tokenId];
    }

    function getUserBadgesByType(address user, BadgeType badgeType) external view returns (uint256[] memory) {
        uint256[] memory allBadges = userBadges[user];
        uint256[] memory typeBadges = new uint256[](userBadgeCount[user][badgeType]);
        uint256 index = 0;
        
        for (uint256 i = 0; i < allBadges.length; i++) {
            if (badges[allBadges[i]].badgeType == badgeType) {
                typeBadges[index] = allBadges[i];
                index++;
            }
        }
        
        return typeBadges;
    }

    function addMinter(address minter) external onlyRole(ADMIN_ROLE) {
        _grantRole(MINTER_ROLE, minter);
    }

    function removeMinter(address minter) external onlyRole(ADMIN_ROLE) {
        _revokeRole(MINTER_ROLE, minter);
    }

    function getTotalBadges() external view returns (uint256) {
        return _tokenIdCounter;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721URIStorage, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function tokenURI(uint256 tokenId) public view virtual override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
}
