// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract MetaTransactions is EIP712, AccessControl, ReentrancyGuard {
    using ECDSA for bytes32;

    bytes32 public constant RELAYER_ROLE = keccak256("RELAYER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    bytes32 private constant META_TRANSACTION_TYPEHASH = keccak256(
        "MetaTransaction(uint256 nonce,address from,bytes functionSignature)"
    );

    mapping(address => uint256) public nonces;
    mapping(address => bool) public isGaslessEligible;
    mapping(address => uint256) public gaslessTransactionCount;
    
    uint256 public constant MAX_GASLESS_TRANSACTIONS = 5;
    
    event MetaTransactionExecuted(
        address indexed userAddress,
        address indexed relayerAddress,
        bytes functionSignature
    );

    event GaslessEligibilityGranted(address indexed user);
    event GaslessEligibilityRevoked(address indexed user);

    constructor() EIP712("MetaTransactions", "1") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(RELAYER_ROLE, msg.sender);
    }

    struct MetaTransaction {
        uint256 nonce;
        address from;
        bytes functionSignature;
    }

    function executeMetaTransaction(
        address userAddress,
        bytes memory functionSignature,
        bytes32 sigR,
        bytes32 sigS,
        uint8 sigV
    ) external onlyRole(RELAYER_ROLE) nonReentrant returns (bytes memory) {
        require(isGaslessEligible[userAddress], "User not eligible for gasless transactions");
        require(gaslessTransactionCount[userAddress] < MAX_GASLESS_TRANSACTIONS, "Gasless limit exceeded");

        MetaTransaction memory metaTx = MetaTransaction({
            nonce: nonces[userAddress],
            from: userAddress,
            functionSignature: functionSignature
        });

        require(verify(userAddress, metaTx, sigR, sigS, sigV), "Invalid signature");

        nonces[userAddress]++;
        gaslessTransactionCount[userAddress]++;

        emit MetaTransactionExecuted(userAddress, msg.sender, functionSignature);

        // Execute the function call
        (bool success, bytes memory returnData) = address(this).call(
            abi.encodePacked(functionSignature, userAddress)
        );

        require(success, "Function call failed");
        return returnData;
    }

    function verify(
        address user,
        MetaTransaction memory metaTx,
        bytes32 sigR,
        bytes32 sigS,
        uint8 sigV
    ) internal view returns (bool) {
        bytes32 digest = _hashTypedDataV4(
            keccak256(
                abi.encode(
                    META_TRANSACTION_TYPEHASH,
                    metaTx.nonce,
                    metaTx.from,
                    keccak256(metaTx.functionSignature)
                )
            )
        );

        address recoveredAddress = digest.recover(sigV, sigR, sigS);
        return recoveredAddress == user;
    }

    function grantGaslessEligibility(address user) external onlyRole(ADMIN_ROLE) {
        isGaslessEligible[user] = true;
        gaslessTransactionCount[user] = 0;
        emit GaslessEligibilityGranted(user);
    }

    function revokeGaslessEligibility(address user) external onlyRole(ADMIN_ROLE) {
        isGaslessEligible[user] = false;
        emit GaslessEligibilityRevoked(user);
    }

    function batchGrantGaslessEligibility(address[] memory users) external onlyRole(ADMIN_ROLE) {
        for (uint i = 0; i < users.length; i++) {
            isGaslessEligible[users[i]] = true;
            gaslessTransactionCount[users[i]] = 0;
            emit GaslessEligibilityGranted(users[i]);
        }
    }

    function getNonce(address user) external view returns (uint256) {
        return nonces[user];
    }

    function getRemainingGaslessTransactions(address user) external view returns (uint256) {
        if (!isGaslessEligible[user]) {
            return 0;
        }
        return MAX_GASLESS_TRANSACTIONS - gaslessTransactionCount[user];
    }

    function resetGaslessCount(address user) external onlyRole(ADMIN_ROLE) {
        gaslessTransactionCount[user] = 0;
    }

    function getDomainSeparator() external view returns (bytes32) {
        return _domainSeparatorV4();
    }

    function getChainID() external view returns (uint256) {
        uint256 id;
        assembly {
            id := chainid()
        }
        return id;
    }
}
