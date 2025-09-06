"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import {
  GlobeAltIcon,
  UsersIcon,
  CloudArrowUpIcon,
  SparklesIcon,
  BeakerIcon,
  LightBulbIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import { revolutionaryWeb3Service } from "../../services/web3/revolutionaryWeb3Service";

interface ChallengeCard {
  id: string;
  title: string;
  description: string;
  category: string;
  creator: string;
  ensSubdomain: string;
  challengeType: string;
  stakeAmount: string;
  deadline: number;
  participantCount: number;
  likes: string[];
  comments: Array<{ user: string; ipfsHash: string; timestamp: number }>;
  storageIncentive: string;
  socialTrustScore: number;
}

export default function RevolutionaryDashboard() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState("discover");
  const [challenges, setChallenges] = useState<ChallengeCard[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [storageStats, setStorageStats] = useState<any>(null);
  const [socialNetwork, setSocialNetwork] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isConnected && address) {
      loadRevolutionaryFeatures();
    }
  }, [isConnected, address]);

  const loadRevolutionaryFeatures = async () => {
    setLoading(true);
    try {
      const [discoveredChallenges, verificationNetwork] = await Promise.all([
        revolutionaryWeb3Service.discoverChallengesByCategory("environment"),
        revolutionaryWeb3Service.getVerificationNetwork(address!),
      ]);

      setChallenges(discoveredChallenges);
      setSocialNetwork(verificationNetwork);

      // Get real user profile from contracts
      try {
        const profile = await revolutionaryService.getUserProfile(address);
        setUserProfile(profile);
        
        const storage = await revolutionaryService.getUserStorageStats(address);
        setStorageStats(storage);
      } catch (error) {
        console.error("Failed to load user profile:", error);
        // Set empty/default state instead of mock data
        setUserProfile(null);
        setStorageStats({
          contributed: "0 GB",
          earned: "0 ETH", 
          rank: "#0",
          uptime: "0%",
        });
      }
    } catch (error) {
      console.error("Failed to load revolutionary features:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChallenge = async () => {
    try {
      const result = await revolutionaryWeb3Service.createENSDiscoverableChallenge({
        title: "Revolutionary Climate Action",
        description: "Use cutting-edge Web3 tech to document climate impact",
        category: "environment",
        stakeAmount: "0.1",
        deadline: Date.now() + 30 * 24 * 60 * 60 * 1000,
        requiresFollow: true,
        minFollowers: 10,
        storageIncentive: "0.05",
      });

      alert(`Challenge created! ENS: ${result.ensSubdomain}`);
      loadRevolutionaryFeatures();
    } catch (error) {
      console.error("Failed to create challenge:", error);
    }
  };

  const handleLikeChallenge = async (challengeId: string) => {
    // Mock like functionality
    setChallenges(prev => prev.map(challenge => 
      challenge.id === challengeId 
        ? { ...challenge, likes: [...challenge.likes, address!] }
        : challenge
    ));
  };

  const formatTimeRemaining = (deadline: number) => {
    const remaining = deadline - Date.now();
    const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
    return `${days} days left`;
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="mb-8">
            <BeakerIcon className="w-20 h-20 mx-auto mb-4 text-cyan-400" />
            <h1 className="text-4xl font-bold mb-4">Revolutionary Web3 Platform</h1>
            <p className="text-xl opacity-90">Experience the future of decentralized social impact</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 max-w-4xl">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <GlobeAltIcon className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <h3 className="font-semibold">ENS Discovery</h3>
              <p className="text-sm opacity-75">Find challenges through decentralized domains</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <UsersIcon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <h3 className="font-semibold">Social Verification</h3>
              <p className="text-sm opacity-75">Community-powered proof validation</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <CloudArrowUpIcon className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <h3 className="font-semibold">FileCoin Rewards</h3>
              <p className="text-sm opacity-75">Earn crypto for storing evidence</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <SparklesIcon className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <h3 className="font-semibold">Gasless Onboarding</h3>
              <p className="text-sm opacity-75">Join without paying gas fees</p>
            </div>
          </div>
          <button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-lg transition-all">
            Connect & Experience the Future
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Revolutionary Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-400 rounded-full flex items-center justify-center">
                  <BeakerIcon className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                  <SparklesIcon className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Revolutionary Web3 Experience</h1>
                <p className="opacity-90">{userProfile?.ensSubdomain}</p>
                <div className="flex items-center space-x-4 mt-1 text-sm">
                  <span className="flex items-center">
                    <UsersIcon className="w-4 h-4 mr-1" />
                    Trust Score: {userProfile?.socialTrustScore}
                  </span>
                  <span className="flex items-center">
                    <CloudArrowUpIcon className="w-4 h-4 mr-1" />
                    {storageStats?.contributed} stored
                  </span>
                  <span className="flex items-center">
                    <SparklesIcon className="w-4 h-4 mr-1" />
                    {userProfile?.gaslessTransactions}/{userProfile?.maxGaslessTransactions} gasless
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-cyan-300">
                {userProfile?.verificationPower}
              </div>
              <div className="text-sm opacity-90">Verification Power</div>
            </div>
          </div>
        </div>
      </div>

      {/* Revolutionary Stats Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <GlobeAltIcon className="w-8 h-8 mb-2" />
                <div className="text-2xl font-bold">127</div>
                <div className="text-sm opacity-90">ENS Challenges Discovered</div>
              </div>
              <div className="text-right text-sm opacity-75">
                via decentralized domains
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <UsersIcon className="w-8 h-8 mb-2" />
                <div className="text-2xl font-bold">{socialNetwork?.eligibleVerifiers?.length || 0}</div>
                <div className="text-sm opacity-90">Social Verifiers</div>
              </div>
              <div className="text-right text-sm opacity-75">
                from your network
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <CloudArrowUpIcon className="w-8 h-8 mb-2" />
                <div className="text-2xl font-bold">{storageStats?.earned}</div>
                <div className="text-sm opacity-90">FileCoin Earned</div>
              </div>
              <div className="text-right text-sm opacity-75">
                from storage rewards
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-orange-600 text-white rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <SparklesIcon className="w-8 h-8 mb-2" />
                <div className="text-2xl font-bold">{userProfile?.gaslessTransactions}</div>
                <div className="text-sm opacity-90">Gasless Transactions</div>
              </div>
              <div className="text-right text-sm opacity-75">
                remaining this period
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl mb-8">
          <div className="flex space-x-1 p-1">
            {[
              { id: "discover", name: "ENS Discovery", icon: GlobeAltIcon },
              { id: "social", name: "Social Verification", icon: UsersIcon },
              { id: "storage", name: "Storage Rewards", icon: CloudArrowUpIcon },
              { id: "create", name: "Create Revolutionary", icon: LightBulbIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-white text-purple-600 shadow-lg"
                    : "text-white hover:bg-white/20"
                }`}
              >
                <tab.icon className="w-5 h-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "discover" && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <GlobeAltIcon className="w-8 h-8 mr-3 text-green-400" />
                ENS-Powered Challenge Discovery
              </h2>
              <p className="mb-6 opacity-90">
                Discover challenges through decentralized ENS domains. Each challenge has its own .eth address for maximum discoverability!
              </p>

              <div className="grid gap-6">
                {challenges.map((challenge) => (
                  <div key={challenge.id} className="bg-white rounded-xl p-6 text-gray-900">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold">{challenge.title}</h3>
                          <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {challenge.challengeType}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{challenge.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <GlobeAltIcon className="w-4 h-4 mr-1" />
                            {challenge.ensSubdomain}
                          </span>
                          <span className="flex items-center">
                            <UsersIcon className="w-4 h-4 mr-1" />
                            {challenge.participantCount} participants
                          </span>
                          <span className="flex items-center">
                            <CloudArrowUpIcon className="w-4 h-4 mr-1" />
                            {challenge.storageIncentive} ETH storage bonus
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600">{challenge.stakeAmount} ETH</div>
                        <div className="text-sm text-gray-500">{formatTimeRemaining(challenge.deadline)}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => handleLikeChallenge(challenge.id)}
                          className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors"
                        >
                          <HeartIcon className={`w-5 h-5 ${challenge.likes.includes(address!) ? 'text-red-500 fill-current' : ''}`} />
                          <span>{challenge.likes.length}</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors">
                          <ChatBubbleLeftIcon className="w-5 h-5" />
                          <span>{challenge.comments.length}</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-colors">
                          <ShareIcon className="w-5 h-5" />
                          <span>Share</span>
                        </button>
                      </div>
                      <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all">
                        Join Challenge
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "create" && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <LightBulbIcon className="w-8 h-8 mr-3 text-yellow-400" />
              Create Revolutionary Challenge
            </h2>
            
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">🚀 Advanced Web3 Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <GlobeAltIcon className="w-6 h-6 text-green-400" />
                  <div>
                    <div className="font-medium">ENS Autodiscovery</div>
                    <div className="text-sm opacity-75">Automatic .eth domain assignment</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <UsersIcon className="w-6 h-6 text-blue-400" />
                  <div>
                    <div className="font-medium">Social Verification</div>
                    <div className="text-sm opacity-75">Community-powered validation</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <CloudArrowUpIcon className="w-6 h-6 text-purple-400" />
                  <div>
                    <div className="font-medium">Storage Incentives</div>
                    <div className="text-sm opacity-75">FileCoin rewards for evidence</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <SparklesIcon className="w-6 h-6 text-yellow-400" />
                  <div>
                    <div className="font-medium">Gasless Participation</div>
                    <div className="text-sm opacity-75">No gas fees for new users</div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleCreateChallenge}
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-4 rounded-xl text-lg font-semibold hover:shadow-xl transition-all disabled:opacity-50"
            >
              {loading ? "Creating Revolutionary Challenge..." : "🚀 Create Revolutionary Challenge"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
