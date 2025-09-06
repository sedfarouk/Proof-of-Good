"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import {
  TrophyIcon,
  StarIcon,
  FireIcon,
  ChartBarIcon,
  UserIcon,
  ClockIcon,
  CheckBadgeIcon,
  HandRaisedIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/outline";
import {
  TrophyIcon as TrophySolidIcon,
  StarIcon as StarSolidIcon,
  FireIcon as FireSolidIcon,
} from "@heroicons/react/24/solid";

interface LeaderboardEntry {
  address: string;
  ensName?: string;
  displayName?: string;
  totalScore: number;
  challengesCompleted: number;
  agreementsSigned: number;
  currentStreak: number;
  rank: number;
  previousRank?: number;
  change: number;
  level: number;
  badges: number;
}

interface TopChallenge {
  id: number;
  title: string;
  category: string;
  participants: number;
  totalStaked: string;
  topPerformer: string;
  topPerformerEns?: string;
}

const LeaderboardPage = () => {
  const { address, isConnected } = useAccount();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [topChallenges, setTopChallenges] = useState<TopChallenge[]>([]);
  const [period, setPeriod] = useState<"all" | "month" | "week">("all");
  const [category, setCategory] = useState<"overall" | "challenges" | "agreements" | "streaks">("overall");
  const [isLoading, setIsLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);

  const periods = [
    { value: "all", label: "All Time" },
    { value: "month", label: "This Month" },
    { value: "week", label: "This Week" },
  ];

  const categories = [
    { value: "overall", label: "Overall Score", icon: TrophyIcon, color: "from-yellow-500 to-orange-500" },
    { value: "challenges", label: "Challenges", icon: FireIcon, color: "from-red-500 to-rose-500" },
    { value: "agreements", label: "Agreements", icon: HandRaisedIcon, color: "from-blue-500 to-cyan-500" },
    { value: "streaks", label: "Streaks", icon: StarIcon, color: "from-purple-500 to-pink-500" },
  ];

  useEffect(() => {
    fetchLeaderboardData();
  }, [period, category]);

  const fetchLeaderboardData = async () => {
    try {
      setIsLoading(true);
      
      // Mock leaderboard data - replace with real blockchain calls
      const mockLeaderboard: LeaderboardEntry[] = [
        {
          address: "0x1234...5678",
          ensName: "alice.eth",
          displayName: "Alice Thompson",
          totalScore: 2456,
          challengesCompleted: 89,
          agreementsSigned: 12,
          currentStreak: 15,
          rank: 1,
          previousRank: 2,
          change: 1,
          level: 8,
          badges: 24,
        },
        {
          address: "0x2345...6789",
          ensName: "bob.eth",
          displayName: "Bob Wilson",
          totalScore: 2234,
          challengesCompleted: 76,
          agreementsSigned: 15,
          currentStreak: 8,
          rank: 2,
          previousRank: 1,
          change: -1,
          level: 7,
          badges: 18,
        },
        {
          address: "0x3456...7890",
          displayName: "Charlie Brown",
          totalScore: 2123,
          challengesCompleted: 84,
          agreementsSigned: 10,
          currentStreak: 22,
          rank: 3,
          previousRank: 4,
          change: 1,
          level: 7,
          badges: 21,
        },
        {
          address: "0x4567...8901",
          ensName: "diana.eth",
          displayName: "Diana Prince",
          totalScore: 1998,
          challengesCompleted: 67,
          agreementsSigned: 18,
          currentStreak: 5,
          rank: 4,
          previousRank: 3,
          change: -1,
          level: 6,
          badges: 16,
        },
        {
          address: "0x5678...9012",
          displayName: "Eve Adams",
          totalScore: 1876,
          challengesCompleted: 52,
          agreementsSigned: 14,
          currentStreak: 12,
          rank: 5,
          previousRank: 6,
          change: 1,
          level: 6,
          badges: 14,
        },
      ];

      // Add more entries to fill the leaderboard
      for (let i = 6; i <= 50; i++) {
        mockLeaderboard.push({
          address: `0x${i.toString().padStart(4, '0')}...${(i + 1000).toString()}`,
          displayName: `User ${i}`,
          totalScore: Math.max(100, 1800 - (i * 30) + Math.floor(Math.random() * 100)),
          challengesCompleted: Math.max(1, 60 - i + Math.floor(Math.random() * 20)),
          agreementsSigned: Math.max(0, 20 - Math.floor(i / 3) + Math.floor(Math.random() * 5)),
          currentStreak: Math.floor(Math.random() * 30),
          rank: i,
          previousRank: i + Math.floor(Math.random() * 3) - 1,
          change: Math.floor(Math.random() * 3) - 1,
          level: Math.max(1, 8 - Math.floor(i / 8)),
          badges: Math.max(0, 25 - Math.floor(i / 2) + Math.floor(Math.random() * 5)),
        });
      }

      setLeaderboard(mockLeaderboard);

      // Find user's rank if connected
      if (isConnected && address) {
        const userEntry = mockLeaderboard.find(entry => entry.address.toLowerCase() === address.toLowerCase());
        setUserRank(userEntry?.rank || null);
      }

      // Mock top challenges
      setTopChallenges([
        {
          id: 1,
          title: "30-Day Fitness Challenge",
          category: "fitness",
          participants: 156,
          totalStaked: "12.5",
          topPerformer: "0x1234...5678",
          topPerformerEns: "alice.eth",
        },
        {
          id: 2,
          title: "Daily Reading Goal",
          category: "education",
          participants: 89,
          totalStaked: "8.2",
          topPerformer: "0x2345...6789",
          topPerformerEns: "bob.eth",
        },
        {
          id: 3,
          title: "Zero Waste Week",
          category: "environment",
          participants: 234,
          totalStaked: "15.7",
          topPerformer: "0x3456...7890",
        },
      ]);
    } catch (error) {
      console.error("Failed to fetch leaderboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <TrophySolidIcon className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <TrophySolidIcon className="w-6 h-6 text-gray-400" />;
      case 3:
        return <TrophySolidIcon className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-slate-500 dark:text-slate-400">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "from-yellow-400 to-orange-500";
      case 2:
        return "from-gray-300 to-gray-400";
      case 3:
        return "from-amber-500 to-amber-600";
      default:
        return "from-slate-400 to-slate-500";
    }
  };

  const getTrendIcon = (change: number) => {
    if (change > 0) return <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />;
    if (change < 0) return <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />;
    return <span className="w-4 h-4 text-slate-400">-</span>;
  };

  const formatAddress = (address: string, ensName?: string) => {
    if (ensName) return ensName;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl mb-6">
              <TrophySolidIcon className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Loading Leaderboard...</h2>
            <div className="w-64 h-2 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
              <TrophySolidIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Leaderboard</h1>
              <p className="text-slate-600 dark:text-slate-300">
                See who's leading the way in the ProofOfGood community
              </p>
            </div>
          </div>

          {/* User Rank Badge */}
          {isConnected && userRank && (
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-4 mb-6 text-white">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <UserIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Your Current Rank</h3>
                  <p className="text-indigo-100">#{userRank} out of {leaderboard.length} participants</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 rounded-2xl p-6 mb-8 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Time Period */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Time Period</h3>
              <div className="flex space-x-2">
                {periods.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setPeriod(p.value as "all" | "month" | "week")}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      period === p.value
                        ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Category</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.value}
                      onClick={() => setCategory(cat.value as "overall" | "challenges" | "agreements" | "streaks")}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        category === cat.value
                          ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                          : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Leaderboard */}
          <div className="lg:col-span-2">
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-slate-700/50">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Top Performers</h2>
              </div>
              
              <div className="divide-y divide-slate-200 dark:divide-slate-700/50">
                {leaderboard.slice(0, 20).map((entry, index) => (
                  <motion.div
                    key={entry.address}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 hover:bg-white/50 dark:hover:bg-slate-700/50 transition-all duration-200 ${
                      entry.address.toLowerCase() === address?.toLowerCase() ? "bg-indigo-50 dark:bg-indigo-900/20" : ""
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      {/* Rank */}
                      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                        {entry.rank <= 3 ? (
                          <div className={`w-10 h-10 bg-gradient-to-br ${getRankBadgeColor(entry.rank)} rounded-xl flex items-center justify-center`}>
                            {getRankIcon(entry.rank)}
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                            <span className="text-lg font-bold text-slate-600 dark:text-slate-300">#{entry.rank}</span>
                          </div>
                        )}
                      </div>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                            {entry.displayName || formatAddress(entry.address, entry.ensName)}
                          </h3>
                          <div className="flex items-center space-x-1">
                            <div className={`w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center`}>
                              <span className="text-white text-xs font-bold">{entry.level}</span>
                            </div>
                            {getTrendIcon(entry.change)}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                          <div className="flex items-center space-x-1">
                            <StarIcon className="w-4 h-4" />
                            <span>{entry.totalScore}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FireIcon className="w-4 h-4" />
                            <span>{entry.challengesCompleted}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <HandRaisedIcon className="w-4 h-4" />
                            <span>{entry.agreementsSigned}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <CheckBadgeIcon className="w-4 h-4" />
                            <span>{entry.badges}</span>
                          </div>
                        </div>
                      </div>

                      {/* Score */}
                      <div className="text-right">
                        <div className="text-lg font-bold text-slate-900 dark:text-white">
                          {category === "overall" && entry.totalScore}
                          {category === "challenges" && entry.challengesCompleted}
                          {category === "agreements" && entry.agreementsSigned}
                          {category === "streaks" && entry.currentStreak}
                        </div>
                        {category === "streaks" && (
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            {entry.currentStreak > 0 ? "🔥 Active" : "Inactive"}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Challenges */}
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Popular Challenges</h2>
              <div className="space-y-4">
                {topChallenges.map((challenge, index) => (
                  <div key={challenge.id} className="bg-white/50 dark:bg-slate-700/50 rounded-xl p-4 border border-white/30 dark:border-slate-600/30">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{challenge.title}</h3>
                    <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
                      <span>{challenge.participants} participants</span>
                      <span>{challenge.totalStaked} ETH staked</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-6 h-6 bg-gradient-to-br ${getRankBadgeColor(index + 1)} rounded-lg flex items-center justify-center`}>
                        <TrophySolidIcon className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {formatAddress(challenge.topPerformer, challenge.topPerformerEns)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Community Stats</h2>
              <div className="space-y-4">
                {[
                  { label: "Total Participants", value: leaderboard.length.toLocaleString(), icon: UserIcon, color: "from-blue-500 to-cyan-500" },
                  { label: "Total Challenges", value: "1,456", icon: FireSolidIcon, color: "from-red-500 to-rose-500" },
                  { label: "Total Score", value: "125,678", icon: StarSolidIcon, color: "from-yellow-500 to-orange-500" },
                  { label: "Active Streaks", value: "89", icon: ChartBarIcon, color: "from-purple-500 to-pink-500" },
                ].map((stat, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">{stat.value}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
