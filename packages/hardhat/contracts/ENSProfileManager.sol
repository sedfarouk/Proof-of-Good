// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract ENSProfileManager is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    
    struct Profile {
        string ensSubdomain;
        string displayName;
        string bio;
        string avatar;
        string[] socialLinks;
        mapping(string => string) customFields;
        bool isActive;
        uint256 createdAt;
    }

    mapping(address => Profile) public profiles;
    mapping(string => address) public subdomainToAddress;
    mapping(address => string) public addressToSubdomain;
    
    string public constant BASE_DOMAIN = ".proofofgood.eth";
    uint256 private _profileCounter;

    event ProfileCreated(address indexed user, string subdomain);
    event ProfileUpdated(address indexed user);
    event SubdomainAssigned(address indexed user, string subdomain);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    function createProfile(
        address user,
        string memory subdomain,
        string memory displayName,
        string memory bio,
        string memory avatar
    ) external onlyRole(ADMIN_ROLE) {
        require(subdomainToAddress[subdomain] == address(0), "Subdomain already taken");
        require(bytes(addressToSubdomain[user]).length == 0, "User already has profile");

        Profile storage newProfile = profiles[user];
        newProfile.ensSubdomain = subdomain;
        newProfile.displayName = displayName;
        newProfile.bio = bio;
        newProfile.avatar = avatar;
        newProfile.isActive = true;
        newProfile.createdAt = block.timestamp;

        subdomainToAddress[subdomain] = user;
        addressToSubdomain[user] = subdomain;
        _profileCounter++;

        emit ProfileCreated(user, subdomain);
        emit SubdomainAssigned(user, subdomain);
    }

    function updateProfile(
        string memory displayName,
        string memory bio,
        string memory avatar,
        string[] memory socialLinks
    ) external {
        require(bytes(addressToSubdomain[msg.sender]).length > 0, "Profile does not exist");
        
        Profile storage profile = profiles[msg.sender];
        profile.displayName = displayName;
        profile.bio = bio;
        profile.avatar = avatar;
        profile.socialLinks = socialLinks;

        emit ProfileUpdated(msg.sender);
    }

    function setCustomField(string memory key, string memory value) external {
        require(bytes(addressToSubdomain[msg.sender]).length > 0, "Profile does not exist");
        profiles[msg.sender].customFields[key] = value;
        emit ProfileUpdated(msg.sender);
    }

    function getProfile(address user) external view returns (
        string memory ensSubdomain,
        string memory displayName,
        string memory bio,
        string memory avatar,
        string[] memory socialLinks,
        bool isActive,
        uint256 createdAt
    ) {
        Profile storage profile = profiles[user];
        return (
            profile.ensSubdomain,
            profile.displayName,
            profile.bio,
            profile.avatar,
            profile.socialLinks,
            profile.isActive,
            profile.createdAt
        );
    }

    function getCustomField(address user, string memory key) external view returns (string memory) {
        return profiles[user].customFields[key];
    }

    function resolveSubdomain(string memory subdomain) external view returns (address) {
        return subdomainToAddress[subdomain];
    }

    function getSubdomain(address user) external view returns (string memory) {
        return addressToSubdomain[user];
    }

    function getTotalProfiles() external view returns (uint256) {
        return _profileCounter;
    }

    function deactivateProfile(address user) external onlyRole(ADMIN_ROLE) {
        profiles[user].isActive = false;
        emit ProfileUpdated(user);
    }

    function reactivateProfile(address user) external onlyRole(ADMIN_ROLE) {
        profiles[user].isActive = true;
        emit ProfileUpdated(user);
    }
}
