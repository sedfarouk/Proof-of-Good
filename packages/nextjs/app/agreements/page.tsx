"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import {
  DocumentTextIcon,
  CheckBadgeIcon,
  ClockIcon,
  UserGroupIcon,
  HandRaisedIcon,
  PencilSquareIcon,
  SparklesIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import {
  DocumentTextIcon as DocumentSolidIcon,
  CheckBadgeIcon as CheckSolidIcon,
} from "@heroicons/react/24/solid";

interface Agreement {
  id: number;
  title: string;
  description: string;
  content: string;
  category: string;
  signaturesRequired: number;
  currentSignatures: number;
  createdAt: number;
  deadline?: number;
  status: "active" | "completed" | "expired";
  isSigned: boolean;
  importance: "low" | "medium" | "high" | "critical";
}

const AgreementsPage = () => {
  const { address, isConnected } = useAccount();
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [filteredAgreements, setFilteredAgreements] = useState<Agreement[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    { value: "all", label: "All Categories", color: "from-slate-500 to-slate-600" },
    { value: "community", label: "Community Rules", color: "from-blue-500 to-cyan-500" },
    { value: "governance", label: "Governance", color: "from-purple-500 to-indigo-500" },
    { value: "ethics", label: "Code of Ethics", color: "from-green-500 to-emerald-500" },
    { value: "platform", label: "Platform Terms", color: "from-orange-500 to-red-500" },
    { value: "conduct", label: "Conduct Guidelines", color: "from-pink-500 to-rose-500" },
  ];

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
    { value: "expired", label: "Expired" },
  ];

  useEffect(() => {
    fetchAgreements();
  }, []);

  useEffect(() => {
    filterAgreements();
  }, [agreements, selectedCategory, selectedStatus]);

  const fetchAgreements = async () => {
    try {
      setIsLoading(true);
      
      // Mock data - replace with real blockchain calls
      const mockAgreements: Agreement[] = [
        {
          id: 1,
          title: "Community Code of Conduct",
          description: "Essential guidelines for respectful and constructive community participation",
          content: "We, the members of ProofOfGood, commit to fostering an inclusive, respectful, and supportive environment...",
          category: "conduct",
          signaturesRequired: 1000,
          currentSignatures: 847,
          createdAt: Date.now() - 604800000,
          status: "active",
          isSigned: true,
          importance: "critical"
        },
        {
          id: 2,
          title: "Fair Challenge Creation Guidelines",
          description: "Standards for creating balanced and achievable challenges",
          content: "Challenge creators agree to design challenges that are fair, achievable, and promote positive outcomes...",
          category: "community",
          signaturesRequired: 500,
          currentSignatures: 342,
          createdAt: Date.now() - 432000000,
          status: "active",
          isSigned: false,
          importance: "high"
        },
        {
          id: 3,
          title: "Data Privacy and Security Agreement",
          description: "Commitment to protecting user data and maintaining platform security",
          content: "This agreement outlines our collective responsibility for data protection and security best practices...",
          category: "platform",
          signaturesRequired: 750,
          currentSignatures: 623,
          createdAt: Date.now() - 259200000,
          status: "active",
          isSigned: false,
          importance: "critical"
        },
        {
          id: 4,
          title: "Environmental Responsibility Pledge",
          description: "Commitment to sustainable practices and environmental consciousness",
          content: "We pledge to consider environmental impact in all platform decisions and promote eco-friendly challenges...",
          category: "ethics",
          signaturesRequired: 300,
          currentSignatures: 298,
          deadline: Date.now() + 86400000,
          createdAt: Date.now() - 1209600000,
          status: "active",
          isSigned: true,
          importance: "medium"
        },
        {
          id: 5,
          title: "Governance Participation Framework",
          description: "Rules and procedures for community governance and decision-making",
          content: "This framework establishes how community members can participate in platform governance...",
          category: "governance",
          signaturesRequired: 200,
          currentSignatures: 200,
          createdAt: Date.now() - 1814400000,
          status: "completed",
          isSigned: true,
          importance: "high"
        },
      ];

      setAgreements(mockAgreements);
    } catch (error) {
      console.error("Failed to fetch agreements:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAgreements = () => {
    let filtered = agreements;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(agreement => agreement.category === selectedCategory);
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter(agreement => agreement.status === selectedStatus);
    }

    setFilteredAgreements(filtered);
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "low":
        return "from-green-500 to-emerald-500";
      case "medium":
        return "from-yellow-500 to-orange-500";
      case "high":
        return "from-orange-500 to-red-500";
      case "critical":
        return "from-red-500 to-rose-500";
      default:
        return "from-gray-500 to-slate-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "from-blue-500 to-cyan-500";
      case "completed":
        return "from-green-500 to-emerald-500";
      case "expired":
        return "from-gray-500 to-slate-500";
      default:
        return "from-gray-500 to-slate-500";
    }
  };

  const getCategoryColor = (category: string) => {
    const categoryData = categories.find(cat => cat.value === category);
    return categoryData?.color || "from-gray-500 to-slate-500";
  };

  const getImportanceIcon = (importance: string) => {
    switch (importance) {
      case "critical":
        return ExclamationTriangleIcon;
      case "high":
        return InformationCircleIcon;
      default:
        return SparklesIcon;
    }
  };

  const formatTimeLeft = (deadline?: number) => {
    if (!deadline) return null;
    
    const now = Date.now();
    const timeLeft = deadline - now;
    
    if (timeLeft <= 0) return "Expired";
    
    const days = Math.floor(timeLeft / 86400000);
    const hours = Math.floor((timeLeft % 86400000) / 3600000);
    
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <DocumentSolidIcon className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Community Agreements</h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-md">
            Connect your wallet to view and sign community agreements
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
              <DocumentSolidIcon className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Loading Agreements...</h2>
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
              <DocumentSolidIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Community Agreements</h1>
              <p className="text-slate-600 dark:text-slate-300">
                Participate in community governance by reviewing and signing agreements
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              {
                label: "Total Agreements",
                value: agreements.length,
                icon: DocumentTextIcon,
                color: "from-blue-500 to-cyan-500"
              },
              {
                label: "Your Signatures",
                value: agreements.filter(a => a.isSigned).length,
                icon: CheckSolidIcon,
                color: "from-green-500 to-emerald-500"
              },
              {
                label: "Pending Signatures",
                value: agreements.filter(a => !a.isSigned && a.status === "active").length,
                icon: PencilSquareIcon,
                color: "from-orange-500 to-red-500"
              },
              {
                label: "Community Participation",
                value: "84%",
                icon: UserGroupIcon,
                color: "from-purple-500 to-pink-500"
              }
            ].map((stat, index) => (
              <div key={index} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 rounded-2xl p-6 shadow-lg">
                <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 rounded-2xl p-6 mb-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            {/* Status */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Status</h3>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((status) => (
                  <button
                    key={status.value}
                    onClick={() => setSelectedStatus(status.value)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      selectedStatus === status.value
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                    }`}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Agreements List */}
        <div className="space-y-6">
          {filteredAgreements.map((agreement) => {
            const ImportanceIcon = getImportanceIcon(agreement.importance);
            const progress = (agreement.currentSignatures / agreement.signaturesRequired) * 100;
            
            return (
              <motion.div
                key={agreement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${getCategoryColor(agreement.category)} rounded-xl flex items-center justify-center`}>
                        <DocumentTextIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{agreement.title}</h3>
                          {agreement.importance !== "low" && (
                            <div className={`flex items-center space-x-1 px-2 py-1 bg-gradient-to-r ${getImportanceColor(agreement.importance)} text-white text-xs font-semibold rounded-full`}>
                              <ImportanceIcon className="w-3 h-3" />
                              <span>{agreement.importance}</span>
                            </div>
                          )}
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 mb-3">{agreement.description}</p>
                        
                        {/* Tags */}
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 bg-gradient-to-r ${getCategoryColor(agreement.category)} text-white text-sm font-semibold rounded-full`}>
                            {agreement.category}
                          </span>
                          <span className={`px-3 py-1 bg-gradient-to-r ${getStatusColor(agreement.status)} text-white text-sm font-semibold rounded-full`}>
                            {agreement.status}
                          </span>
                          {agreement.isSigned && (
                            <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-semibold rounded-full flex items-center space-x-1">
                              <CheckSolidIcon className="w-3 h-3" />
                              <span>Signed</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      {agreement.deadline && (
                        <div className="flex items-center space-x-1 text-sm text-slate-500 dark:text-slate-400 mb-2">
                          <ClockIcon className="w-4 h-4" />
                          <span>{formatTimeLeft(agreement.deadline)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Community Support</span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {agreement.currentSignatures} / {agreement.signaturesRequired} signatures
                      </span>
                    </div>
                    <div className="relative">
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${getStatusColor(agreement.status)} rounded-full transition-all duration-500`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {progress.toFixed(1)}% complete
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      Created {new Date(agreement.createdAt).toLocaleDateString()}
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Link
                        href={`/agreements/${agreement.id}`}
                        className="px-4 py-2 bg-white/50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 font-medium rounded-xl border border-white/50 dark:border-slate-600/50 hover:bg-white/70 dark:hover:bg-slate-700/70 transition-all duration-200"
                      >
                        Read Full Text
                      </Link>
                      
                      {!agreement.isSigned && agreement.status === "active" && (
                        <button className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 flex items-center space-x-2">
                          <HandRaisedIcon className="w-4 h-4" />
                          <span>Sign Agreement</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredAgreements.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <DocumentTextIcon className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">No agreements found</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8">Try adjusting your filters</p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSelectedStatus("all");
              }}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Create Agreement CTA */}
        <div className="mt-12">
          <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-8 text-center shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-4">Propose a New Agreement</h2>
            <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
              Have an idea for a community agreement? Propose it to the community and gather support.
            </p>
            <button className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 inline-flex items-center space-x-2">
              <PencilSquareIcon className="w-5 h-5" />
              <span>Create Proposal</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgreementsPage;
