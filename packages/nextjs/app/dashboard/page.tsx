"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import { web3Service } from "../../services/web3/web3IntegrationService";
import {
  TrophyIcon,
  FireIcon,
  CheckBadgeIcon,
  ClockIcon,
  UserGroupIcon,
  StarIcon,
  RocketLaunchIcon,
  HeartIcon,
  SparklesIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";
import {
  TrophyIcon as TrophySolidIcon,
  FireIcon as FireSolidIcon,
  StarIcon as StarSolidIcon,
} from "@heroicons/react/24/solid";

interface UserStats {
  totalScore: number;
  challengesCompleted: number;
  activeStake: string;
  successRate: number;
  currentStreak: number;
  level: number;
  nextLevelScore: number;
  rank: number;
}

interface UserChallenge {
  id: number;
  title: string;
  category: string;
  stakeAmount: string;
  deadline: number;
  progress: number;
  status: "active" | "completed" | "failed";
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  unlockedAt?: number;
}

const Dashboard = () => {
  const { address, isConnected } = useAccount();
  const [userStats, setUserStats] = useState<UserStats>({
    totalScore: 0,
    challengesCompleted: 0,
    activeStake: "0",
    successRate: 0,
    currentStreak: 0,
    level: 1,
    nextLevelScore: 100,
    rank: 0,
  });
  const [userChallenges, setUserChallenges] = useState<UserChallenge[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isConnected && address) {
      fetchUserData();
    } else {
      setIsLoading(false);
    }
  }, [isConnected, address]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch user stats
      const stats = await web3Service.getUserStats(address!);
      setUserStats(stats);

      // Fetch user challenges
      const challenges = await web3Service.getUserChallenges(address!);
      setUserChallenges(challenges);

      // Mock achievements for now
      setAchievements([
        {
          id: 1,
          title: "First Steps",
          description: "Complete your first challenge",
          icon: "🎯",
          rarity: "common",
          unlockedAt: Date.now() - 86400000,
        },
        {
          id: 2,
          title: "Rising Star",
          description: "Reach level 5",
          icon: "⭐",
          rarity: "rare",
        },
        {
          id: 3,
          title: "Dedication",
          description: "Maintain a 7-day streak",
          icon: "🔥",
          rarity: "epic",
        },
        {
          id: 4,
          title: "Champion",
          description: "Complete 50 challenges",
          icon: "🏆",
          rarity: "legendary",
        },
      ]);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "from-blue-500 to-cyan-500";
      case "completed":
        return "from-green-500 to-emerald-500";
      case "failed":
        return "from-red-500 to-rose-500";
      default:
        return "from-gray-500 to-slate-500";
    }
  };

  const formatTimeLeft = (deadline: number) => {
    const now = Math.floor(Date.now() / 1000);
    const timeLeft = deadline - now;
    
    if (timeLeft <= 0) return "Ended";
    
    const days = Math.floor(timeLeft / 86400);
    const hours = Math.floor((timeLeft % 86400) / 3600);
    
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  const levelProgress = (userStats.totalScore % 100) / 100 * 100;

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <UserGroupIcon className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Welcome to ProofOfGood</h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-md">
            Connect your wallet to access your personal dashboard and start tracking your progress
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
              <ChartBarIcon className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Loading Your Dashboard...</h2>
            <div className="w-64 h-2 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse"></div>
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
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center">
              <ChartBarIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
              <p className="text-slate-600 dark:text-slate-300">Track your progress and achievements</p>
            </div>
          </div>

          {/* Level Progress */}
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 rounded-2xl p-6 mb-8 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center`}>
                  <StarSolidIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Level {userStats.level}</h3>
                  <p className="text-slate-600 dark:text-slate-300">Rank #{userStats.rank}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{userStats.totalScore}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Total Score</div>
              </div>
            </div>
            <div className="relative">
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${levelProgress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 mt-2">
                <span>Level {userStats.level}</span>
                <span>{userStats.nextLevelScore - userStats.totalScore} points to next level</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Challenges Completed",
              value: userStats.challengesCompleted,
              icon: CheckBadgeIcon,
              color: "from-green-500 to-emerald-500",
              trend: "+12% this month"
            },
            {
              title: "Active Stake",
              value: `${userStats.activeStake} ETH`,
              icon: FireSolidIcon,
              color: "from-orange-500 to-red-500",
              trend: "Locked in challenges"
            },
            {
              title: "Success Rate",
              value: `${userStats.successRate}%`,
              icon: TrophySolidIcon,
              color: "from-yellow-500 to-orange-500",
              trend: "Above average"
            },
            {
              title: "Current Streak",
              value: `${userStats.currentStreak} days`,
              icon: BoltIcon,
              color: "from-purple-500 to-pink-500",
              trend: "Keep it up!"
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{stat.title}</div>
                </div>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{stat.trend}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Challenges */}
          <div className="lg:col-span-2">
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Active Challenges</h2>
                <Link
                  href="/challenges"
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium text-sm"
                >
                  View All
                </Link>
              </div>

              {userChallenges.length === 0 ? (
                <div className="text-center py-12">
                  <RocketLaunchIcon className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No Active Challenges</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Start your journey by joining a challenge
                  </p>
                  <Link
                    href="/challenges"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200"
                  >
                    Browse Challenges
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {userChallenges.slice(0, 3).map((challenge) => (
                    <div
                      key={challenge.id}
                      className="bg-white/50 dark:bg-slate-700/50 rounded-xl p-4 border border-white/30 dark:border-slate-600/30"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 bg-gradient-to-br ${getStatusColor(challenge.status)} rounded-lg flex items-center justify-center`}>
                            <FireIcon className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900 dark:text-white">{challenge.title}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{challenge.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-slate-900 dark:text-white">{challenge.stakeAmount} ETH</div>
                          <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center">
                            <ClockIcon className="w-3 h-3 mr-1" />
                            {formatTimeLeft(challenge.deadline)}
                          </div>
                        </div>
                      </div>
                      <div className="relative">
                        <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                            style={{ width: `${challenge.progress}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {challenge.progress}% complete
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Achievements */}
          <div>
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Achievements</h2>
              
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`bg-white/50 dark:bg-slate-700/50 rounded-xl p-4 border border-white/30 dark:border-slate-600/30 ${
                      achievement.unlockedAt ? "opacity-100" : "opacity-50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 bg-gradient-to-br ${getRarityColor(achievement.rarity)} rounded-xl flex items-center justify-center text-xl`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white">{achievement.title}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{achievement.description}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 bg-gradient-to-r ${getRarityColor(achievement.rarity)} text-white text-xs font-semibold rounded-full`}>
                            {achievement.rarity}
                          </span>
                          {achievement.unlockedAt && (
                            <span className="text-xs text-green-600 dark:text-green-400">✓ Unlocked</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 rounded-2xl p-6 shadow-lg mt-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/challenges"
                  className="block w-full p-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-center font-semibold rounded-xl hover:shadow-lg transition-all duration-200"
                >
                  Join New Challenge
                </Link>
                <Link
                  href="/leaderboard"
                  className="block w-full p-3 bg-white/50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 text-center font-semibold rounded-xl border border-white/50 dark:border-slate-600/50 hover:bg-white/70 dark:hover:bg-slate-700/70 transition-all duration-200"
                >
                  View Leaderboard
                </Link>
                <Link
                  href="/profile"
                  className="block w-full p-3 bg-white/50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 text-center font-semibold rounded-xl border border-white/50 dark:border-slate-600/50 hover:bg-white/70 dark:hover:bg-slate-700/70 transition-all duration-200"
                >
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Recent Activity</h2>
            
            <div className="space-y-4">
              {[
                {
                  type: "challenge_completed",
                  title: "Completed 30-Day Fitness Challenge",
                  description: "Earned 0.5 ETH reward + reputation boost",
                  time: "2 hours ago",
                  icon: CheckBadgeIcon,
                  color: "from-green-500 to-emerald-500"
                },
                {
                  type: "challenge_joined",
                  title: "Joined Daily Reading Challenge",
                  description: "Staked 0.1 ETH for 30 days",
                  time: "1 day ago",
                  icon: RocketLaunchIcon,
                  color: "from-blue-500 to-cyan-500"
                },
                {
                  type: "achievement_unlocked",
                  title: "Unlocked 'Consistent Performer' badge",
                  description: "Complete 10 challenges in a row",
                  time: "3 days ago",
                  icon: StarSolidIcon,
                  color: "from-yellow-500 to-orange-500"
                }
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-white/30 dark:bg-slate-700/30 rounded-xl">
                  <div className={`w-10 h-10 bg-gradient-to-br ${activity.color} rounded-xl flex items-center justify-center`}>
                    <activity.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{activity.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{activity.description}</p>
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
