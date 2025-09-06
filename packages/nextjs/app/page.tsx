"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import { web3Service } from "../services/web3/web3IntegrationService";
import {
  FireIcon,
  TrophyIcon,
  UserGroupIcon,
  SparklesIcon,
  ArrowRightIcon,
  CheckBadgeIcon,
  RocketLaunchIcon,
  StarIcon,
  HandRaisedIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { 
  TrophyIcon as TrophySolidIcon,
  FireIcon as FireSolidIcon,
  UserGroupIcon as UserGroupSolidIcon 
} from "@heroicons/react/24/solid";

interface PlatformStats {
  totalChallenges: number;
  totalUsers: number;
  totalRewards: string;
  activeUsers: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6
    }
  }
};

export default function Home() {
  const { isConnected } = useAccount();
  const [stats, setStats] = useState<PlatformStats>({
    totalChallenges: 0,
    totalUsers: 0,
    totalRewards: "0",
    activeUsers: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPlatformStats();
  }, []);

  const fetchPlatformStats = async () => {
    try {
      setIsLoading(true);
      const platformStats = await web3Service.getPlatformStats();
      setStats(platformStats);
    } catch (error) {
      console.error("Failed to fetch platform stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: FireIcon,
      solidIcon: FireSolidIcon,
      title: "Stake & Commit",
      description: "Put your money where your mouth is. Stake tokens to prove your commitment to completing challenges.",
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20"
    },
    {
      icon: TrophyIcon,
      solidIcon: TrophySolidIcon,
      title: "Earn Rewards",
      description: "Complete challenges, earn back your stake plus rewards. Build your reputation and climb the leaderboard.",
      color: "from-yellow-500 to-orange-500",
      bgColor: "from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20"
    },
    {
      icon: UserGroupIcon,
      solidIcon: UserGroupSolidIcon,
      title: "Community Driven",
      description: "Join a community of like-minded individuals committed to personal growth and accountability.",
      color: "from-blue-500 to-purple-500",
      bgColor: "from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20"
    }
  ];

  const quickActions = [
    {
      href: "/challenges",
      title: "Browse Challenges",
      description: "Discover new challenges to take on",
      icon: RocketLaunchIcon,
      color: "from-indigo-500 to-purple-500",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20"
    },
    {
      href: "/dashboard",
      title: "My Dashboard",
      description: "Track your progress and achievements",
      icon: CheckBadgeIcon,
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20"
    },
    {
      href: "/leaderboard",
      title: "Leaderboard",
      description: "See who's leading the way",
      icon: StarIcon,
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20"
    },
    {
      href: "/agreements",
      title: "Agreements",
      description: "View and sign community agreements",
      icon: DocumentTextIcon,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <motion.div variants={itemVariants} className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/25">
                  <SparklesIcon className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-bounce"></div>
              </div>
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-7xl font-black mb-8"
            >
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Proof of Good
              </span>
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed"
            >
              Put your commitment on the blockchain. Stake tokens, complete challenges, 
              and prove your dedication to personal growth and community values.
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              {isConnected ? (
                <>
                  <Link
                    href="/challenges"
                    className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl shadow-xl shadow-indigo-500/25 hover:shadow-2xl hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-105"
                  >
                    <RocketLaunchIcon className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                    Explore Challenges
                    <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                  <Link
                    href="/dashboard"
                    className="group inline-flex items-center px-8 py-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-700 dark:text-slate-200 font-semibold rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    <CheckBadgeIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                    My Dashboard
                  </Link>
                </>
              ) : (
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 rounded-2xl p-6 shadow-xl">
                  <p className="text-slate-600 dark:text-slate-300 mb-4">Connect your wallet to get started</p>
                  <HandRaisedIcon className="w-8 h-8 text-slate-400 mx-auto" />
                </div>
              )}
            </motion.div>

            {/* Stats */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            >
              {[
                { label: "Total Challenges", value: isLoading ? "..." : stats.totalChallenges.toLocaleString(), icon: RocketLaunchIcon },
                { label: "Active Users", value: isLoading ? "..." : stats.totalUsers.toLocaleString(), icon: UserGroupIcon },
                { label: "Total Rewards", value: isLoading ? "..." : `${stats.totalRewards} ETH`, icon: TrophyIcon },
                { label: "Success Rate", value: "94%", icon: CheckBadgeIcon }
              ].map((stat, index) => (
                <div key={index} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  <stat.icon className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              How It Works
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Simple, transparent, and powered by blockchain technology
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`relative group bg-gradient-to-br ${feature.bgColor} border border-white/50 dark:border-slate-700/50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105`}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.solidIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{feature.description}</p>
                
                {/* Decorative element */}
                <div className={`absolute top-4 right-4 w-3 h-3 bg-gradient-to-br ${feature.color} rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-300`}></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="py-20 lg:py-32 bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Get Started Today
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Choose your path and start your journey towards accountability and growth
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {quickActions.map((action, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Link
                  href={action.href}
                  className={`group block ${action.bgColor} border border-white/50 dark:border-slate-700/50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105`}
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{action.title}</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">{action.description}</p>
                  <ArrowRightIcon className="w-4 h-4 text-slate-400 mt-3 group-hover:translate-x-1 group-hover:text-indigo-500 transition-all duration-300" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-12 shadow-2xl shadow-indigo-500/25"
          >
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Prove Yourself?
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are turning their commitments into achievements through blockchain accountability.
            </motion.p>
            <motion.div variants={itemVariants}>
              <Link
                href="/challenges"
                className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 font-semibold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
              >
                <FireIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Start Your First Challenge
                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
