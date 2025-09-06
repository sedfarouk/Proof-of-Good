"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import {
  UserIcon,
  PencilIcon,
  CameraIcon,
  CheckBadgeIcon,
  TrophyIcon,
  FireIcon,
  StarIcon,
  CalendarDaysIcon,
  LinkIcon,
  MapPinIcon,
  GlobeAltIcon,
  HeartIcon,
  ChartBarIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import {
  UserIcon as UserSolidIcon,
  CheckBadgeIcon as CheckSolidIcon,
  TrophyIcon as TrophySolidIcon,
  StarIcon as StarSolidIcon,
} from "@heroicons/react/24/solid";

interface UserProfile {
  address: string;
  ensName?: string;
  displayName: string;
  bio: string;
  avatar?: string;
  coverImage?: string;
  website?: string;
  twitter?: string;
  location?: string;
  joinedAt: number;
  verified: boolean;
}

interface UserStats {
  totalScore: number;
  challengesCompleted: number;
  challengesFailed: number;
  agreementsSigned: number;
  currentStreak: number;
  maxStreak: number;
  level: number;
  rank: number;
  badgesEarned: number;
  totalStaked: string;
  totalEarned: string;
}

interface Badge {
  id: number;
  name: string;
  description: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  earnedAt: number;
  icon: string;
}

interface Activity {
  id: number;
  type: "challenge_completed" | "challenge_joined" | "challenge_failed" | "agreement_signed" | "badge_earned" | "level_up";
  title: string;
  description: string;
  timestamp: number;
  points?: number;
}

const ProfilePage = () => {
  const { address, isConnected } = useAccount();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTab, setSelectedTab] = useState("overview");

  const tabs = [
    { id: "overview", name: "Overview", icon: ChartBarIcon },
    { id: "badges", name: "Badges", icon: CheckBadgeIcon },
    { id: "activity", name: "Activity", icon: ClockIcon },
  ];

  useEffect(() => {
    if (isConnected && address) {
      fetchUserProfile();
    } else {
      setIsLoading(false);
    }
  }, [isConnected, address]);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      
      // Mock profile data - replace with real blockchain calls
      setProfile({
        address: address!,
        ensName: "alice.eth",
        displayName: "Alice Thompson",
        bio: "Web3 enthusiast passionate about accountability and personal growth. Building better habits one challenge at a time! 🚀",
        avatar: "/api/placeholder/150/150",
        coverImage: "/api/placeholder/800/200",
        website: "https://alice.xyz",
        twitter: "@alice_web3",
        location: "San Francisco, CA",
        joinedAt: Date.now() - 15552000000, // 6 months ago
        verified: true,
      });

      setStats({
        totalScore: 2456,
        challengesCompleted: 89,
        challengesFailed: 12,
        agreementsSigned: 15,
        currentStreak: 18,
        maxStreak: 32,
        level: 8,
        rank: 1,
        badgesEarned: 24,
        totalStaked: "5.67",
        totalEarned: "8.92",
      });

      setBadges([
        {
          id: 1,
          name: "First Steps",
          description: "Complete your first challenge",
          rarity: "common",
          earnedAt: Date.now() - 15552000000,
          icon: "🎯"
        },
        {
          id: 2,
          name: "Streak Master",
          description: "Maintain a 30-day streak",
          rarity: "epic",
          earnedAt: Date.now() - 2592000000,
          icon: "🔥"
        },
        {
          id: 3,
          name: "Community Leader",
          description: "Sign 10 community agreements",
          rarity: "rare",
          earnedAt: Date.now() - 1296000000,
          icon: "👑"
        },
        {
          id: 4,
          name: "Champion",
          description: "Reach the #1 spot on leaderboard",
          rarity: "legendary",
          earnedAt: Date.now() - 604800000,
          icon: "🏆"
        },
        {
          id: 5,
          name: "Fitness Guru",
          description: "Complete 20 fitness challenges",
          rarity: "rare",
          earnedAt: Date.now() - 2592000000,
          icon: "💪"
        },
        {
          id: 6,
          name: "Bookworm",
          description: "Complete 15 reading challenges",
          rarity: "rare",
          earnedAt: Date.now() - 1296000000,
          icon: "📚"
        },
      ]);

      setActivities([
        {
          id: 1,
          type: "challenge_completed",
          title: "Completed 30-Day Meditation Challenge",
          description: "Earned 150 points and 0.3 ETH reward",
          timestamp: Date.now() - 86400000,
          points: 150,
        },
        {
          id: 2,
          type: "badge_earned",
          title: "Earned 'Champion' Badge",
          description: "Reached #1 on the leaderboard",
          timestamp: Date.now() - 604800000,
          points: 500,
        },
        {
          id: 3,
          type: "challenge_joined",
          title: "Joined Daily Coding Challenge",
          description: "Staked 0.1 ETH for 30 days",
          timestamp: Date.now() - 1209600000,
        },
        {
          id: 4,
          type: "level_up",
          title: "Reached Level 8",
          description: "Unlocked new challenge categories",
          timestamp: Date.now() - 2592000000,
          points: 100,
        },
        {
          id: 5,
          type: "agreement_signed",
          title: "Signed Community Code of Conduct",
          description: "Committed to community values",
          timestamp: Date.now() - 5184000000,
        },
      ]);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "from-gray-400 to-gray-500";
      case "rare":
        return "from-blue-400 to-blue-500";
      case "epic":
        return "from-purple-400 to-purple-500";
      case "legendary":
        return "from-yellow-400 to-orange-500";
      default:
        return "from-gray-400 to-gray-500";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "challenge_completed":
        return CheckSolidIcon;
      case "challenge_joined":
        return FireIcon;
      case "challenge_failed":
        return ClockIcon;
      case "agreement_signed":
        return UserIcon;
      case "badge_earned":
        return TrophySolidIcon;
      case "level_up":
        return StarSolidIcon;
      default:
        return UserIcon;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "challenge_completed":
        return "from-green-500 to-emerald-500";
      case "challenge_joined":
        return "from-blue-500 to-cyan-500";
      case "challenge_failed":
        return "from-red-500 to-rose-500";
      case "agreement_signed":
        return "from-purple-500 to-pink-500";
      case "badge_earned":
        return "from-yellow-500 to-orange-500";
      case "level_up":
        return "from-indigo-500 to-purple-500";
      default:
        return "from-gray-500 to-slate-500";
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <UserSolidIcon className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Profile Access</h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-md">
            Connect your wallet to view and edit your profile
          </p>
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 rounded-2xl p-6">
            <p className="text-slate-600 dark:text-slate-300">Please connect your wallet above</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl mb-6">
              <UserSolidIcon className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Loading Profile...</h2>
            <div className="w-64 h-2 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile || !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <UserIcon className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Profile Not Found</h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-md">
            Unable to load profile data. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cover Image */}
        <div className="relative h-48 md:h-64 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl mb-8 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30 transition-all duration-200">
            <CameraIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Header */}
        <div className="relative -mt-24 mb-8">
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 rounded-2xl p-6 shadow-lg">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                  {profile.displayName.charAt(0).toUpperCase()}
                </div>
                <button className="absolute -bottom-2 -right-2 p-2 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-white/50 dark:border-slate-700/50 hover:scale-105 transition-all duration-200">
                  <CameraIcon className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                </button>
                {profile.verified && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <CheckSolidIcon className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{profile.displayName}</h1>
                  {profile.ensName && (
                    <span className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-semibold rounded-full">
                      {profile.ensName}
                    </span>
                  )}
                  <div className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-semibold rounded-full">
                    <StarSolidIcon className="w-3 h-3" />
                    <span>Level {stats.level}</span>
                  </div>
                </div>
                
                <p className="text-slate-600 dark:text-slate-300 mb-4 max-w-2xl">{profile.bio}</p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                  {profile.location && (
                    <div className="flex items-center space-x-1">
                      <MapPinIcon className="w-4 h-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile.website && (
                    <div className="flex items-center space-x-1">
                      <GlobeAltIcon className="w-4 h-4" />
                      <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                        {profile.website.replace('https://', '')}
                      </a>
                    </div>
                  )}
                  {profile.twitter && (
                    <div className="flex items-center space-x-1">
                      <span>🐦</span>
                      <span>{profile.twitter}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <CalendarDaysIcon className="w-4 h-4" />
                    <span>Joined {new Date(profile.joinedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
                >
                  <PencilIcon className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          {[
            { label: "Total Score", value: stats.totalScore.toLocaleString(), icon: StarSolidIcon, color: "from-yellow-500 to-orange-500" },
            { label: "Rank", value: `#${stats.rank}`, icon: TrophySolidIcon, color: "from-yellow-400 to-orange-500" },
            { label: "Completed", value: stats.challengesCompleted, icon: CheckSolidIcon, color: "from-green-500 to-emerald-500" },
            { label: "Current Streak", value: `${stats.currentStreak} days`, icon: FireIcon, color: "from-red-500 to-rose-500" },
            { label: "Badges", value: stats.badgesEarned, icon: CheckBadgeIcon, color: "from-purple-500 to-pink-500" },
            { label: "Total Earned", value: `${stats.totalEarned} ETH`, icon: TrophyIcon, color: "from-blue-500 to-cyan-500" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 rounded-2xl p-4 shadow-lg text-center"
            >
              <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-white">{stat.value}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 rounded-2xl mb-8 shadow-lg">
          <div className="border-b border-slate-200 dark:border-slate-700/50">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`${
                      selectedTab === tab.id
                        ? "border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30"
                        : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600"
                    } whitespace-nowrap py-4 px-3 border-b-2 font-medium text-sm flex items-center space-x-2 rounded-t-lg transition-all duration-200`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {selectedTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Performance Chart */}
            <div className="lg:col-span-2">
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Performance Overview</h2>
                
                {/* Success Rate */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-700 dark:text-slate-300">Success Rate</span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {stats.challengesCompleted} / {stats.challengesCompleted + stats.challengesFailed} challenges
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${(stats.challengesCompleted / (stats.challengesCompleted + stats.challengesFailed)) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {Math.round((stats.challengesCompleted / (stats.challengesCompleted + stats.challengesFailed)) * 100)}% success rate
                  </div>
                </div>

                {/* Level Progress */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-700 dark:text-slate-300">Level Progress</span>
                    <span className="text-slate-500 dark:text-slate-400">Level {stats.level}</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${(stats.totalScore % 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {100 - (stats.totalScore % 100)} points to next level
                  </div>
                </div>

                {/* Recent Performance */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/50 dark:bg-slate-700/50 rounded-xl p-4 border border-white/30 dark:border-slate-600/30">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.currentStreak}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Current Streak</div>
                    <div className="text-xs text-green-600 dark:text-green-400 mt-1">🔥 Active</div>
                  </div>
                  <div className="bg-white/50 dark:bg-slate-700/50 rounded-xl p-4 border border-white/30 dark:border-slate-600/30">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.maxStreak}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Best Streak</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Personal record</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-6">
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Financial Summary</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Total Staked</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{stats.totalStaked} ETH</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Total Earned</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">{stats.totalEarned} ETH</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700/50">
                    <span className="text-slate-600 dark:text-slate-400">Net Profit</span>
                    <span className="font-bold text-green-600 dark:text-green-400">
                      +{(parseFloat(stats.totalEarned) - parseFloat(stats.totalStaked)).toFixed(2)} ETH
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Recent Badges</h3>
                <div className="space-y-3">
                  {badges.slice(0, 3).map((badge) => (
                    <div key={badge.id} className="flex items-center space-x-3">
                      <div className={`w-10 h-10 bg-gradient-to-br ${getRarityColor(badge.rarity)} rounded-xl flex items-center justify-center text-lg`}>
                        {badge.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-900 dark:text-white text-sm">{badge.name}</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">{badge.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === "badges" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {badges.map((badge) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${getRarityColor(badge.rarity)} rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl shadow-lg`}>
                  {badge.icon}
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{badge.name}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{badge.description}</p>
                <div className="flex items-center justify-center space-x-2">
                  <span className={`px-3 py-1 bg-gradient-to-r ${getRarityColor(badge.rarity)} text-white text-xs font-semibold rounded-full`}>
                    {badge.rarity}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date(badge.earnedAt).toLocaleDateString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {selectedTab === "activity" && (
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 rounded-2xl shadow-lg">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700/50">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Activity</h2>
            </div>
            <div className="divide-y divide-slate-200 dark:divide-slate-700/50">
              {activities.map((activity) => {
                const Icon = getActivityIcon(activity.type);
                return (
                  <div key={activity.id} className="p-6 hover:bg-white/50 dark:hover:bg-slate-700/50 transition-all duration-200">
                    <div className="flex items-start space-x-4">
                      <div className={`w-10 h-10 bg-gradient-to-br ${getActivityColor(activity.type)} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white">{activity.title}</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">{activity.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {new Date(activity.timestamp).toLocaleDateString()}
                          </span>
                          {activity.points && (
                            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                              +{activity.points} points
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
