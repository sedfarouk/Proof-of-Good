// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract TestToken is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    uint256 public constant INITIAL_SUPPLY = 1000000 * 10**18; // 1 million tokens
    uint256 public constant FAUCET_AMOUNT = 100 * 10**18; // 100 tokens per faucet request
    
    mapping(address => uint256) public lastFaucetRequest;
    mapping(address => uint256) public faucetRequestCount;
    
    uint256 public constant FAUCET_COOLDOWN = 1 hours;
    uint256 public constant MAX_FAUCET_REQUESTS = 10;

    event FaucetRequest(address indexed user, uint256 amount);
    event TokensMinted(address indexed to, uint256 amount);

    constructor() ERC20("ProofOfGood Test Token", "POGT") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    function faucet() external {
        require(
            block.timestamp >= lastFaucetRequest[msg.sender] + FAUCET_COOLDOWN,
            "Faucet cooldown not met"
        );
        require(
            faucetRequestCount[msg.sender] < MAX_FAUCET_REQUESTS,
            "Max faucet requests exceeded"
        );

        lastFaucetRequest[msg.sender] = block.timestamp;
        faucetRequestCount[msg.sender]++;
        
        _mint(msg.sender, FAUCET_AMOUNT);
        
        emit FaucetRequest(msg.sender, FAUCET_AMOUNT);
    }

    function adminFaucet(address to, uint256 amount) external onlyRole(ADMIN_ROLE) {
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    function resetFaucetCount(address user) external onlyRole(ADMIN_ROLE) {
        faucetRequestCount[user] = 0;
        lastFaucetRequest[user] = 0;
    }

    function getRemainingFaucetRequests(address user) external view returns (uint256) {
        return MAX_FAUCET_REQUESTS - faucetRequestCount[user];
    }

    function getNextFaucetTime(address user) external view returns (uint256) {
        return lastFaucetRequest[user] + FAUCET_COOLDOWN;
    }

    function canRequestFaucet(address user) external view returns (bool) {
        return (block.timestamp >= lastFaucetRequest[user] + FAUCET_COOLDOWN) &&
               (faucetRequestCount[user] < MAX_FAUCET_REQUESTS);
    }
}
