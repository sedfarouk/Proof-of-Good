"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import {
  Cog6ToothIcon,
  UsersIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  BellIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  Cog6ToothIcon as CogSolidIcon,
  ShieldCheckIcon as ShieldSolidIcon,
  ExclamationTriangleIcon as WarningSolidIcon,
} from "@heroicons/react/24/solid";

interface AdminStats {
  totalUsers: number;
  activeChallenges: number;
  totalStaked: string;
  pendingReports: number;
  systemHealth: "excellent" | "good" | "warning" | "critical";
  dailyActiveUsers: number;
  revenue: string;
  supportTickets: number;
}

interface PendingAction {
  id: number;
  type: "user_report" | "challenge_review" | "withdrawal_request" | "system_alert";
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  createdAt: number;
  status: "pending" | "in_review" | "resolved";
}

interface SystemMetric {
  name: string;
  value: string;
  status: "healthy" | "warning" | "critical";
  change: string;
  icon: any;
}

const AdminPage = () => {
  const { address, isConnected } = useAccount();
  const [adminStats, setAdminStats] = useState<AdminStats>({
    totalUsers: 0,
    activeChallenges: 0,
    totalStaked: "0",
    pendingReports: 0,
    systemHealth: "excellent",
    dailyActiveUsers: 0,
    revenue: "0",
    supportTickets: 0,
  });
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedTab, setSelectedTab] = useState("overview");

  const tabs = [
    { id: "overview", name: "Overview", icon: ChartBarIcon },
    { id: "users", name: "Users", icon: UsersIcon },
    { id: "challenges", name: "Challenges", icon: DocumentTextIcon },
    { id: "reports", name: "Reports", icon: ExclamationTriangleIcon },
    { id: "system", name: "System", icon: Cog6ToothIcon },
  ];

  useEffect(() => {
    if (isConnected && address) {
      checkAdminStatus();
    } else {
      setIsLoading(false);
    }
  }, [isConnected, address]);

  const checkAdminStatus = async () => {
    try {
      setIsLoading(true);
      
      // Check if user is admin (replace with real check)
      // const adminStatus = await web3Service.isAdmin(address!);
      const adminStatus = true; // Mock for demo
      setIsAdmin(adminStatus);
      
      if (adminStatus) {
        await fetchAdminData();
      }
    } catch (error) {
      console.error("Failed to check admin status:", error);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAdminData = async () => {
    try {
      // Mock admin data - replace with real blockchain calls
      setAdminStats({
        totalUsers: 2456,
        activeChallenges: 89,
        totalStaked: "1,234.56",
        pendingReports: 7,
        systemHealth: "good",
        dailyActiveUsers: 892,
        revenue: "45.67",
        supportTickets: 12,
      });

      setPendingActions([
        {
          id: 1,
          type: "user_report",
          title: "Inappropriate Challenge Content",
          description: "User reported challenge #456 for containing offensive material",
          severity: "high",
          createdAt: Date.now() - 3600000,
          status: "pending",
        },
        {
          id: 2,
          type: "withdrawal_request",
          title: "Large Stake Withdrawal",
          description: "User requesting withdrawal of 50 ETH stake",
          severity: "medium",
          createdAt: Date.now() - 7200000,
          status: "in_review",
        },
        {
          id: 3,
          type: "system_alert",
          title: "High Gas Fees Detected",
          description: "Network gas fees exceed threshold of 100 gwei",
          severity: "medium",
          createdAt: Date.now() - 10800000,
          status: "pending",
        },
        {
          id: 4,
          type: "challenge_review",
          title: "Challenge Completion Dispute",
          description: "Participants disputing challenge #789 completion requirements",
          severity: "high",
          createdAt: Date.now() - 14400000,
          status: "pending",
        },
      ]);

      setSystemMetrics([
        {
          name: "Response Time",
          value: "245ms",
          status: "healthy",
          change: "-12ms",
          icon: ClockIcon,
        },
        {
          name: "Blockchain Sync",
          value: "99.8%",
          status: "healthy",
          change: "+0.1%",
          icon: ShieldCheckIcon,
        },
        {
          name: "Error Rate",
          value: "0.05%",
          status: "healthy",
          change: "-0.02%",
          icon: CheckCircleIcon,
        },
        {
          name: "Memory Usage",
          value: "78%",
          status: "warning",
          change: "+5%",
          icon: ExclamationTriangleIcon,
        },
      ]);
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
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
      case "healthy":
        return "from-green-500 to-emerald-500";
      case "warning":
        return "from-yellow-500 to-orange-500";
      case "critical":
        return "from-red-500 to-rose-500";
      default:
        return "from-gray-500 to-slate-500";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "user_report":
        return ExclamationTriangleIcon;
      case "challenge_review":
        return DocumentTextIcon;
      case "withdrawal_request":
        return CurrencyDollarIcon;
      case "system_alert":
        return BellIcon;
      default:
        return Cog6ToothIcon;
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <ShieldSolidIcon className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Admin Access Required</h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-md">
            Connect your wallet to access the admin dashboard
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-rose-500 rounded-2xl mb-6">
              <CogSolidIcon className="w-8 h-8 text-white animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Checking Admin Access...</h2>
            <div className="w-64 h-2 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-gradient-to-r from-red-500 to-rose-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <XCircleIcon className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Access Denied</h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-md">
            You don't have admin privileges to access this dashboard
          </p>
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 rounded-2xl p-6">
            <p className="text-slate-600 dark:text-slate-300">Contact an administrator for access</p>
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
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-500 rounded-2xl flex items-center justify-center">
              <CogSolidIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
              <p className="text-slate-600 dark:text-slate-300">
                Monitor and manage the ProofOfGood platform
              </p>
            </div>
          </div>

          {/* System Health Alert */}
          {adminStats.systemHealth !== "excellent" && (
            <div className={`bg-gradient-to-r ${adminStats.systemHealth === "critical" ? "from-red-500 to-rose-500" : adminStats.systemHealth === "warning" ? "from-yellow-500 to-orange-500" : "from-blue-500 to-cyan-500"} rounded-2xl p-4 mb-6 text-white`}>
              <div className="flex items-center space-x-3">
                <WarningSolidIcon className="w-6 h-6" />
                <div>
                  <h3 className="font-semibold">System Status: {adminStats.systemHealth.toUpperCase()}</h3>
                  <p className="text-sm opacity-90">Some components require attention</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Total Users",
              value: adminStats.totalUsers.toLocaleString(),
              icon: UsersIcon,
              color: "from-blue-500 to-cyan-500",
              trend: "+124 this week"
            },
            {
              title: "Active Challenges",
              value: adminStats.activeChallenges,
              icon: DocumentTextIcon,
              color: "from-green-500 to-emerald-500",
              trend: "+8 today"
            },
            {
              title: "Total Staked",
              value: `${adminStats.totalStaked} ETH`,
              icon: CurrencyDollarIcon,
              color: "from-yellow-500 to-orange-500",
              trend: "+15% this month"
            },
            {
              title: "Pending Reports",
              value: adminStats.pendingReports,
              icon: ExclamationTriangleIcon,
              color: "from-red-500 to-rose-500",
              trend: "-2 from yesterday"
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
                        ? "border-red-500 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30"
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
            {/* System Metrics */}
            <div className="lg:col-span-2">
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">System Metrics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {systemMetrics.map((metric, index) => (
                    <div key={index} className="bg-white/50 dark:bg-slate-700/50 rounded-xl p-4 border border-white/30 dark:border-slate-600/30">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <metric.icon className="w-5 h-5 text-slate-400" />
                          <span className="font-medium text-slate-900 dark:text-white">{metric.name}</span>
                        </div>
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getStatusColor(metric.status)}`}></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{metric.value}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">{metric.change}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pending Actions */}
            <div>
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Pending Actions</h2>
                <div className="space-y-4">
                  {pendingActions.slice(0, 5).map((action) => {
                    const TypeIcon = getTypeIcon(action.type);
                    return (
                      <div key={action.id} className="bg-white/50 dark:bg-slate-700/50 rounded-xl p-4 border border-white/30 dark:border-slate-600/30">
                        <div className="flex items-start space-x-3">
                          <div className={`w-8 h-8 bg-gradient-to-br ${getSeverityColor(action.severity)} rounded-lg flex items-center justify-center`}>
                            <TypeIcon className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{action.title}</h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{action.description}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className={`px-2 py-1 bg-gradient-to-r ${getSeverityColor(action.severity)} text-white text-xs font-semibold rounded-full`}>
                                {action.severity}
                              </span>
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                {new Date(action.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-3">
                          <button className="flex-1 px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-semibold rounded-lg hover:shadow-lg transition-all duration-200">
                            Review
                          </button>
                          <button className="px-3 py-1 bg-white/50 dark:bg-slate-600/50 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg border border-white/50 dark:border-slate-500/50">
                            Dismiss
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8">
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { name: "View Users", icon: UsersIcon, color: "from-blue-500 to-cyan-500" },
                { name: "Manage Challenges", icon: DocumentTextIcon, color: "from-green-500 to-emerald-500" },
                { name: "Review Reports", icon: ExclamationTriangleIcon, color: "from-red-500 to-rose-500" },
                { name: "System Logs", icon: ClockIcon, color: "from-purple-500 to-pink-500" },
                { name: "Analytics", icon: ChartBarIcon, color: "from-yellow-500 to-orange-500" },
                { name: "Settings", icon: Cog6ToothIcon, color: "from-slate-500 to-slate-600" },
              ].map((action, index) => (
                <button
                  key={index}
                  className="group p-4 bg-white/50 dark:bg-slate-700/50 rounded-xl border border-white/30 dark:border-slate-600/30 hover:bg-white/70 dark:hover:bg-slate-700/70 transition-all duration-200 text-center"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-200`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{action.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
