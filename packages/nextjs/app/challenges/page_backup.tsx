"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import { web3Service } from "../../services/web3/web3IntegrationService";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ClockIcon,
  UserGroupIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  FireIcon,
  TrophyIcon,
  SparklesIcon,
  RocketLaunchIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon, FireIcon as FireSolidIcon } from "@heroicons/react/24/solid";

interface Challenge {
  id: number;
  title: string;
  description: string;
  category: string;
  creator: string;
  creatorEns?: string;
  stakeAmount: string;
  deadline: number;
  maxParticipants: number;
  currentParticipants: number;
  challengeType: "community" | "custom" | "community_service";
  likes: number;
  comments: number;
  isLiked: boolean;
  proofRequired: string;
  status: "active" | "ended" | "upcoming";
}

const ChallengesPage = () => {
  const { isConnected } = useAccount();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [filteredChallenges, setFilteredChallenges] = useState<Challenge[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { value: "all", label: "All Categories", color: "from-slate-500 to-slate-600" },
    { value: "fitness", label: "Fitness", color: "from-red-500 to-orange-500" },
    { value: "education", label: "Education", color: "from-blue-500 to-indigo-500" },
    { value: "productivity", label: "Productivity", color: "from-green-500 to-emerald-500" },
    { value: "health", label: "Health", color: "from-pink-500 to-rose-500" },
    { value: "creativity", label: "Creativity", color: "from-purple-500 to-violet-500" },
    { value: "social", label: "Social", color: "from-cyan-500 to-blue-500" },
    { value: "environment", label: "Environment", color: "from-green-600 to-teal-600" },
    { value: "finance", label: "Finance", color: "from-yellow-500 to-orange-500" },
  ];

  const challengeTypes = [
    { value: "all", label: "All Types", icon: SparklesIcon },
    { value: "community", label: "Community", icon: UserGroupIcon },
    { value: "custom", label: "Custom", icon: RocketLaunchIcon },
    { value: "community_service", label: "Community Service", icon: HeartIcon },
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "popular", label: "Most Popular" },
    { value: "stake", label: "Highest Stake" },
    { value: "deadline", label: "Ending Soon" },
  ];

  useEffect(() => {
    fetchChallenges();
  }, []);

  useEffect(() => {
    filterChallenges();
  }, [challenges, searchTerm, selectedCategory, selectedType, sortBy]);

  const fetchChallenges = async () => {
    try {
      setIsLoading(true);
      const isConnected = await web3Service.testConnection();
      if (!isConnected) {
        setChallenges([]);
        return;
      }

      const realChallenges = await web3Service.getAllChallenges();
      const transformedChallenges: Challenge[] = realChallenges.map((challenge, index) => ({
        id: parseInt(challenge.id) || index + 1,
        title: challenge.title,
        description: challenge.description,
        category: challenge.category,
        creator: challenge.creator,
        creatorEns: challenge.creatorEns,
        stakeAmount: challenge.stakeAmount,
        deadline: challenge.deadline,
        maxParticipants: challenge.maxParticipants,
        currentParticipants: challenge.currentParticipants,
        challengeType: challenge.challengeType as "community" | "custom" | "community_service",
        likes: Math.floor(Math.random() * 50),
        comments: Math.floor(Math.random() * 20),
        isLiked: false,
        proofRequired: challenge.proofRequired,
        status: challenge.isActive ? "active" : "ended",
      }));

      setChallenges(transformedChallenges);
    } catch (error) {
      console.error("Failed to fetch challenges:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterChallenges = () => {
    let filtered = challenges;

    if (searchTerm) {
      filtered = filtered.filter(
        challenge =>
          challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          challenge.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(challenge => challenge.category === selectedCategory);
    }

    if (selectedType !== "all") {
      filtered = filtered.filter(challenge => challenge.challengeType === selectedType);
    }

    // Sort challenges
    switch (sortBy) {
      case "popular":
        filtered = filtered.sort((a, b) => b.likes - a.likes);
        break;
      case "stake":
        filtered = filtered.sort((a, b) => parseFloat(b.stakeAmount) - parseFloat(a.stakeAmount));
        break;
      case "deadline":
        filtered = filtered.sort((a, b) => a.deadline - b.deadline);
        break;
      case "oldest":
        filtered = filtered.sort((a, b) => a.id - b.id);
        break;
      default:
        filtered = filtered.sort((a, b) => b.id - a.id);
    }

    setFilteredChallenges(filtered);
  };

  const getChallengeTypeColor = (type: string) => {
    switch (type) {
      case "community":
        return "from-blue-500 to-cyan-500";
      case "custom":
        return "from-purple-500 to-pink-500";
      case "community_service":
        return "from-green-500 to-emerald-500";
      default:
        return "from-gray-500 to-slate-500";
    }
  };

  const getCategoryColor = (category: string) => {
    const categoryData = categories.find(cat => cat.value === category);
    return categoryData?.color || "from-gray-500 to-slate-500";
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl mb-6">
              <FireSolidIcon className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Loading Challenges...</h2>
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
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center">
              <FireSolidIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Challenges</h1>
              <p className="text-slate-600 dark:text-slate-300">Discover challenges, stake your commitment, and prove your dedication</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Challenges", value: challenges.length, icon: RocketLaunchIcon, color: "from-blue-500 to-cyan-500" },
              { label: "Active Users", value: "1.2k", icon: UserGroupIcon, color: "from-green-500 to-emerald-500" },
              { label: "Total Staked", value: "245 ETH", icon: TrophyIcon, color: "from-yellow-500 to-orange-500" },
              { label: "Success Rate", value: "87%", icon: SparklesIcon, color: "from-purple-500 to-pink-500" }
            ].map((stat, index) => (
              <div key={index} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 rounded-2xl p-4 shadow-lg">
                <div className={`w-8 h-8 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center mb-2`}>
                  <stat.icon className="w-4 h-4 text-white" />
                </div>
                <div className="text-lg font-bold text-slate-900 dark:text-white">{stat.value}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 rounded-2xl p-6 mb-8 shadow-lg">
          {/* Search Bar */}
          <div className="relative mb-6">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search challenges..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-white/50 dark:border-slate-600/50 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Filter Toggle and Refresh */}
          <div className="flex items-center space-x-3 mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-xl hover:bg-indigo-200 dark:hover:bg-indigo-900/70 transition-all duration-200"
            >
              <FunnelIcon className="w-4 h-4" />
              <span>Filters</span>
            </button>
            
            <button
              onClick={fetchChallenges}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-xl hover:bg-green-200 dark:hover:bg-green-900/70 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowPathIcon className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-6"
            >
              {/* Categories */}
              <div>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.value}
                      onClick={() => setSelectedCategory(category.value)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        selectedCategory === category.value
                          ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                          : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                      }`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Challenge Types */}
              <div>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Challenge Types</h3>
                <div className="flex flex-wrap gap-2">
                  {challengeTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        onClick={() => setSelectedType(type.value)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                          selectedType === type.value
                            ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                            : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-white/50 dark:bg-slate-700/50 border border-white/50 dark:border-slate-600/50 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
          )}
        </div>

        {/* Challenges Grid */}
        {filteredChallenges.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MagnifyingGlassIcon className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">No challenges found</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8">Try adjusting your filters or search terms</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSelectedType("all");
              }}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChallenges.map((challenge) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                {/* Challenge Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 bg-gradient-to-br ${getChallengeTypeColor(challenge.challengeType)} rounded-xl flex items-center justify-center`}>
                        <FireIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <span className={`inline-block px-3 py-1 bg-gradient-to-r ${getCategoryColor(challenge.category)} text-white text-xs font-semibold rounded-full`}>
                          {challenge.category}
                        </span>
                      </div>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                      {challenge.isLiked ? (
                        <HeartSolidIcon className="w-5 h-5 text-red-500" />
                      ) : (
                        <HeartIcon className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {challenge.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4 line-clamp-3">
                    {challenge.description}
                  </p>

                  {/* Challenge Stats */}
                  <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-4">
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="w-4 h-4" />
                      <span>{formatTimeLeft(challenge.deadline)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <UserGroupIcon className="w-4 h-4" />
                      <span>{challenge.currentParticipants}/{challenge.maxParticipants}</span>
                    </div>
                  </div>

                  {/* Stake Amount */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {challenge.stakeAmount} ETH
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-500 dark:text-slate-400">Stake Required</div>
                    </div>
                  </div>

                  {/* Engagement */}
                  <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center space-x-1">
                      <HeartIcon className="w-4 h-4" />
                      <span>{challenge.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ChatBubbleLeftIcon className="w-4 h-4" />
                      <span>{challenge.comments}</span>
                    </div>
                  </div>
                </div>

                {/* Challenge Footer */}
                <div className="px-6 pb-6">
                  <Link
                    href={`/challenges/${challenge.id}`}
                    className="block w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-center font-semibold rounded-xl hover:shadow-lg transition-all duration-200 group-hover:scale-105"
                  >
                    Join Challenge
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {filteredChallenges.length > 0 && (
          <div className="text-center mt-12">
            <button className="px-8 py-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 font-semibold rounded-2xl hover:bg-white/80 dark:hover:bg-slate-800/80 hover:shadow-lg transition-all duration-200">
              Load More Challenges
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallengesPage;
