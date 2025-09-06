import { createPublicClient, formatEther, http, parseEther } from "viem";
import { base, baseSepolia } from "viem/chains";

// Base Network Configuration
const BASE_MAINNET_RPC = "https://mainnet.base.org";
const BASE_SEPOLIA_RPC = "https://sepolia.base.org";
const BASE_EXPLORER = "https://basescan.org";
const BASE_SEPOLIA_EXPLORER = "https://sepolia.basescan.org";

interface BaseBridgeConfig {
  l1ChainId: number;
  l2ChainId: number;
  bridgeContract: string;
  l1StandardBridge: string;
  l1CrossDomainMessenger: string;
  l2CrossDomainMessenger: string;
}

interface GasEstimate {
  l1Gas: string;
  l2Gas: string;
  l1GasPrice: string;
  l2GasPrice: string;
  totalCostEth: string;
  totalCostUsd?: string;
}

interface BridgeTransaction {
  hash: string;
  status: "pending" | "confirmed" | "failed";
  from: string;
  to: string;
  amount: string;
  token: string;
  direction: "deposit" | "withdraw";
  timestamp: number;
  l1TxHash?: string;
  l2TxHash?: string;
}

class BaseNetworkService {
  private mainnetClient;
  private sepoliaClient;
  private bridgeConfig: BaseBridgeConfig;

  constructor() {
    this.mainnetClient = createPublicClient({
      chain: base,
      transport: http(BASE_MAINNET_RPC),
    });

    this.sepoliaClient = createPublicClient({
      chain: baseSepolia,
      transport: http(BASE_SEPOLIA_RPC),
    });

    this.bridgeConfig = {
      l1ChainId: 1, // Ethereum mainnet
      l2ChainId: 8453, // Base mainnet
      bridgeContract: "0x3154Cf16ccdb4C6d922629664174b904d80F2C35",
      l1StandardBridge: "0x3154Cf16ccdb4C6d922629664174b904d80F2C35",
      l1CrossDomainMessenger: "0x866E82a600A1414e583f7F13623F1aC5d58b0Afa",
      l2CrossDomainMessenger: "0x4200000000000000000000000000000000000007",
    };
  }

  // Network Information
  async getNetworkInfo(testnet: boolean = false) {
    const chain = testnet ? baseSepolia : base;
    const client = testnet ? this.sepoliaClient : this.mainnetClient;
    const explorer = testnet ? BASE_SEPOLIA_EXPLORER : BASE_EXPLORER;

    try {
      const [blockNumber, gasPrice] = await Promise.all([client.getBlockNumber(), client.getGasPrice()]);

      return {
        chainId: chain.id,
        name: chain.name,
        rpcUrl: chain.rpcUrls.default.http[0],
        explorer,
        blockNumber: Number(blockNumber),
        gasPrice: formatEther(gasPrice),
        currency: chain.nativeCurrency,
      };
    } catch (error) {
      console.error("Failed to get network info:", error);
      return null;
    }
  }

  // Gas Estimation
  async estimateGas(
    to: string,
    data: string,
    value: string = "0",
    testnet: boolean = false,
  ): Promise<GasEstimate | null> {
    const client = testnet ? this.sepoliaClient : this.mainnetClient;

    try {
      const [gasEstimate, gasPrice] = await Promise.all([
        client.estimateGas({
          to: to as `0x${string}`,
          data: data as `0x${string}`,
          value: parseEther(value),
        }),
        client.getGasPrice(),
      ]);

      const totalCost = gasEstimate * gasPrice;

      return {
        l1Gas: "0", // Base is L2, so L1 gas is 0 for L2 transactions
        l2Gas: gasEstimate.toString(),
        l1GasPrice: "0",
        l2GasPrice: formatEther(gasPrice),
        totalCostEth: formatEther(totalCost),
      };
    } catch (error) {
      console.error("Failed to estimate gas:", error);
      return null;
    }
  }

  // Bridge Operations
  async estimateBridgeCost(amount: string, direction: "deposit" | "withdraw"): Promise<GasEstimate | null> {
    try {
      // Mock implementation - real implementation would call bridge contracts
      const mockEstimate: GasEstimate = {
        l1Gas: direction === "deposit" ? "21000" : "150000",
        l2Gas: direction === "withdraw" ? "21000" : "150000",
        l1GasPrice: "0.00002",
        l2GasPrice: "0.000001",
        totalCostEth: direction === "deposit" ? "0.00025" : "0.003",
        totalCostUsd: direction === "deposit" ? "0.50" : "6.00",
      };

      console.log(`Estimated bridge cost for ${direction} of ${amount} ETH:`, mockEstimate);
      return mockEstimate;
    } catch (error) {
      console.error("Failed to estimate bridge cost:", error);
      return null;
    }
  }

  async bridgeToBase(amount: string, recipient: string): Promise<BridgeTransaction | null> {
    try {
      // This would interact with the actual bridge contracts
      const mockTransaction: BridgeTransaction = {
        hash: `0x${Math.random().toString(16).substring(2)}`,
        status: "pending",
        from: "0x1234567890123456789012345678901234567890",
        to: recipient,
        amount,
        token: "ETH",
        direction: "deposit",
        timestamp: Date.now(),
        l1TxHash: `0x${Math.random().toString(16).substring(2)}`,
      };

      console.log("Bridging to Base:", mockTransaction);
      return mockTransaction;
    } catch (error) {
      console.error("Failed to bridge to Base:", error);
      return null;
    }
  }

  async bridgeFromBase(amount: string, recipient: string): Promise<BridgeTransaction | null> {
    try {
      // This would interact with the actual bridge contracts
      const mockTransaction: BridgeTransaction = {
        hash: `0x${Math.random().toString(16).substring(2)}`,
        status: "pending",
        from: "0x1234567890123456789012345678901234567890",
        to: recipient,
        amount,
        token: "ETH",
        direction: "withdraw",
        timestamp: Date.now(),
        l2TxHash: `0x${Math.random().toString(16).substring(2)}`,
      };

      console.log("Bridging from Base:", mockTransaction);
      return mockTransaction;
    } catch (error) {
      console.error("Failed to bridge from Base:", error);
      return null;
    }
  }

  async getBridgeTransactionStatus(txHash: string): Promise<BridgeTransaction | null> {
    try {
      // Mock implementation - would check actual bridge status
      const mockTransaction: BridgeTransaction = {
        hash: txHash,
        status: "confirmed",
        from: "0x1234567890123456789012345678901234567890",
        to: "0x2345678901234567890123456789012345678901",
        amount: "0.1",
        token: "ETH",
        direction: "deposit",
        timestamp: Date.now() - 300000, // 5 minutes ago
        l1TxHash: txHash,
        l2TxHash: `0x${Math.random().toString(16).substring(2)}`,
      };

      return mockTransaction;
    } catch (error) {
      console.error("Failed to get bridge transaction status:", error);
      return null;
    }
  }

  // Account Management
  async getBalance(address: string, testnet: boolean = false): Promise<string | null> {
    const client = testnet ? this.sepoliaClient : this.mainnetClient;

    try {
      const balance = await client.getBalance({
        address: address as `0x${string}`,
      });

      return formatEther(balance);
    } catch (error) {
      console.error("Failed to get balance:", error);
      return null;
    }
  }

  async getTransactionHistory(address: string, limit: number = 10, _testnet: boolean = false): Promise<any[]> {
    // This would typically use an indexer or block explorer API
    try {
      const mockTransactions = Array.from({ length: limit }, (_, i) => ({
        hash: `0x${Math.random().toString(16).substring(2)}`,
        from: i % 2 === 0 ? address : `0x${Math.random().toString(16).substring(2)}`,
        to: i % 2 === 1 ? address : `0x${Math.random().toString(16).substring(2)}`,
        value: (Math.random() * 10).toFixed(4),
        timestamp: Date.now() - i * 3600000, // Every hour
        blockNumber: 5000000 - i,
        gasUsed: "21000",
        gasPrice: "0.000001",
        status: "success",
      }));

      return mockTransactions;
    } catch (error) {
      console.error("Failed to get transaction history:", error);
      return [];
    }
  }

  // Smart Contract Interaction
  async deployContract(_bytecode: string, _abi: any[], _constructorArgs: any[] = [], testnet: boolean = false) {
    try {
      // This would deploy a contract to Base
      const mockDeployment = {
        contractAddress: `0x${Math.random().toString(16).substring(2)}`,
        transactionHash: `0x${Math.random().toString(16).substring(2)}`,
        blockNumber: 5000000,
        gasUsed: "500000",
        network: testnet ? "base-sepolia" : "base-mainnet",
      };

      console.log("Deployed contract to Base:", mockDeployment);
      return mockDeployment;
    } catch (error) {
      console.error("Failed to deploy contract to Base:", error);
      return null;
    }
  }

  // Utility Functions
  getExplorerUrl(hash: string, type: "tx" | "address" | "block" = "tx", testnet: boolean = false): string {
    const baseUrl = testnet ? BASE_SEPOLIA_EXPLORER : BASE_EXPLORER;
    return `${baseUrl}/${type}/${hash}`;
  }

  formatAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  isValidAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  // Base-specific Features
  async getCoinbaseSmartWalletInfo(_address: string) {
    try {
      // Mock implementation for Coinbase Smart Wallet features
      return {
        isCoinbaseWallet: Math.random() > 0.5,
        walletVersion: "1.0.0",
        features: ["gasless-transactions", "social-recovery", "multi-sig"],
        recoveryContacts: 2,
      };
    } catch (error) {
      console.error("Failed to get Coinbase Smart Wallet info:", error);
      return null;
    }
  }

  async enableGaslessTransactions(userAddress: string): Promise<boolean> {
    try {
      // This would set up gasless transactions for new users
      console.log(`Enabling gasless transactions for ${userAddress}`);
      return true;
    } catch (error) {
      console.error("Failed to enable gasless transactions:", error);
      return false;
    }
  }

  // Integration with Base ecosystem
  getBaseEcosystemApps() {
    return [
      {
        name: "Uniswap",
        url: "https://app.uniswap.org",
        category: "DEX",
        description: "Decentralized exchange on Base",
      },
      {
        name: "Aerodrome",
        url: "https://aerodrome.finance",
        category: "DEX",
        description: "Base's leading DEX and liquidity marketplace",
      },
      {
        name: "Coinbase Wallet",
        url: "https://wallet.coinbase.com",
        category: "Wallet",
        description: "Native Base wallet experience",
      },
      {
        name: "Base Names",
        url: "https://basename.app",
        category: "Identity",
        description: "Base's naming service",
      },
    ];
  }
}

export const baseService = new BaseNetworkService();
export default baseService;
