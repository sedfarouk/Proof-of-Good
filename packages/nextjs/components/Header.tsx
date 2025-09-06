"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import {
  HomeIcon,
  TrophyIcon,
  ChartBarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  CogIcon,
  Bars3Icon,
  XMarkIcon,
  SparklesIcon,
  FireIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeSolidIcon,
  TrophyIcon as TrophySolidIcon,
  ChartBarIcon as ChartSolidIcon,
  UserGroupIcon as UserGroupSolidIcon,
  DocumentTextIcon as DocumentSolidIcon,
  CogIcon as CogSolidIcon,
  UserIcon as UserSolidIcon,
} from "@heroicons/react/24/solid";
import { ThemeToggle } from "./ThemeToggle";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  solidIcon: React.ElementType;
  description: string;
  color: string;
  adminOnly?: boolean;
}

const Header = () => {
  const pathname = usePathname();
  const { isConnected, address } = useAccount();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    {
      label: "Home",
      href: "/",
      icon: HomeIcon,
      solidIcon: HomeSolidIcon,
      description: "Welcome dashboard",
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Challenges",
      href: "/challenges",
      icon: TrophyIcon,
      solidIcon: TrophySolidIcon,
      description: "Discover & join challenges",
      color: "from-purple-500 to-pink-500",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: ChartBarIcon,
      solidIcon: ChartSolidIcon,
      description: "Your progress & stats",
      color: "from-indigo-500 to-purple-500",
    },
    {
      label: "Leaderboard",
      href: "/leaderboard",
      icon: UserGroupIcon,
      solidIcon: UserGroupSolidIcon,
      description: "Community rankings",
      color: "from-green-500 to-emerald-500",
    },
    {
      label: "Agreements",
      href: "/agreements",
      icon: DocumentTextIcon,
      solidIcon: DocumentSolidIcon,
      description: "Community governance",
      color: "from-yellow-500 to-orange-500",
    },
    {
      label: "Profile",
      href: "/profile",
      icon: UserIcon,
      solidIcon: UserSolidIcon,
      description: "Your profile & achievements",
      color: "from-pink-500 to-rose-500",
    },
    {
      label: "Admin",
      href: "/admin",
      icon: CogIcon,
      solidIcon: CogSolidIcon,
      description: "System administration",
      color: "from-red-500 to-rose-500",
      adminOnly: true,
    },
  ];

  const isActiveRoute = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const getNavItemColor = (item: NavItem, isActive: boolean) => {
    if (isActive) {
      return `bg-gradient-to-r ${item.color} text-white shadow-lg shadow-${item.color.split(' ')[1]}/25`;
    }
    return "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white";
  };

  const filteredNavItems = navItems.filter(item => {
    if (item.adminOnly) {
      // For demo purposes, show admin to all connected users
      // In production, you'd check for admin role
      return isConnected;
    }
    return true;
  });

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 animate-pulse"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                ProofOfGood
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Prove Your Dedication
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {filteredNavItems.map((item) => {
              const isActive = isActiveRoute(item.href);
              const Icon = isActive ? item.solidIcon : item.icon;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative"
                >
                  <div
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                      isActive
                        ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <div className="bg-slate-900 dark:bg-slate-700 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                      {item.description}
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-900 dark:bg-slate-700 rotate-45"></div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Connect Button */}
            <div className="hidden sm:block">
              <ConnectButton.Custom>
                {({
                  account,
                  chain,
                  openAccountModal,
                  openChainModal,
                  openConnectModal,
                  authenticationStatus,
                  mounted,
                }) => {
                  const ready = mounted && authenticationStatus !== "loading";
                  const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus ||
                      authenticationStatus === "authenticated");

                  return (
                    <div
                      {...(!ready && {
                        "aria-hidden": true,
                        style: {
                          opacity: 0,
                          pointerEvents: "none",
                          userSelect: "none",
                        },
                      })}
                    >
                      {(() => {
                        if (!connected) {
                          return (
                            <button
                              onClick={openConnectModal}
                              type="button"
                              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
                            >
                              <span>Connect Wallet</span>
                              <FireIcon className="w-4 h-4" />
                            </button>
                          );
                        }

                        if (chain.unsupported) {
                          return (
                            <button
                              onClick={openChainModal}
                              type="button"
                              className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                              Wrong network
                            </button>
                          );
                        }

                        return (
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={openChainModal}
                              type="button"
                              className="flex items-center space-x-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 px-3 py-2 rounded-xl font-medium text-sm transition-all duration-200 hover:bg-white/80 dark:hover:bg-slate-700/80"
                            >
                              {chain.hasIcon && (
                                <div className="w-4 h-4 rounded-full overflow-hidden">
                                  {chain.iconUrl && (
                                    <Image
                                      alt={chain.name ?? "Chain icon"}
                                      src={chain.iconUrl}
                                      width={16}
                                      height={16}
                                    />
                                  )}
                                </div>
                              )}
                              <span>{chain.name}</span>
                            </button>

                            <button
                              onClick={openAccountModal}
                              type="button"
                              className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 hover:shadow-lg"
                            >
                              <div className="w-4 h-4 bg-white/20 rounded-full"></div>
                              <span>
                                {account.displayName}
                                {account.displayBalance
                                  ? ` (${account.displayBalance})`
                                  : ""}
                              </span>
                            </button>
                          </div>
                        );
                      })()}
                    </div>
                  );
                }}
              </ConnectButton.Custom>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-white/20 dark:border-slate-700/50"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
              <div className="space-y-2">
                {filteredNavItems.map((item) => {
                  const isActive = isActiveRoute(item.href);
                  const Icon = isActive ? item.solidIcon : item.icon;
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMobileMenu}
                      className="block group"
                    >
                      <div
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                          isActive
                            ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                            : "text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <div className="flex-1">
                          <div className="font-medium">{item.label}</div>
                          <div className={`text-xs ${
                            isActive 
                              ? "text-white/80" 
                              : "text-slate-500 dark:text-slate-400"
                          }`}>
                            {item.description}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
              
              {/* Mobile Connect Button */}
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700/50">
                <div className="sm:hidden">
                  <ConnectButton.Custom>
                    {({
                      account,
                      chain,
                      openAccountModal,
                      openChainModal,
                      openConnectModal,
                      authenticationStatus,
                      mounted,
                    }) => {
                      const ready = mounted && authenticationStatus !== "loading";
                      const connected =
                        ready &&
                        account &&
                        chain &&
                        (!authenticationStatus ||
                          authenticationStatus === "authenticated");

                      return (
                        <div
                          {...(!ready && {
                            "aria-hidden": true,
                            style: {
                              opacity: 0,
                              pointerEvents: "none",
                              userSelect: "none",
                            },
                          })}
                        >
                          {(() => {
                            if (!connected) {
                              return (
                                <button
                                  onClick={openConnectModal}
                                  type="button"
                                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                                >
                                  <span>Connect Wallet</span>
                                  <FireIcon className="w-5 h-5" />
                                </button>
                              );
                            }

                            if (chain.unsupported) {
                              return (
                                <button
                                  onClick={openChainModal}
                                  type="button"
                                  className="w-full bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                  Wrong network
                                </button>
                              );
                            }

                            return (
                              <div className="space-y-2">
                                <button
                                  onClick={openChainModal}
                                  type="button"
                                  className="w-full flex items-center justify-center space-x-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 px-4 py-3 rounded-xl font-medium transition-all duration-200 hover:bg-white/80 dark:hover:bg-slate-700/80"
                                >
                                  {chain.hasIcon && (
                                    <div className="w-5 h-5 rounded-full overflow-hidden">
                                      {chain.iconUrl && (
                                        <Image
                                          alt={chain.name ?? "Chain icon"}
                                          src={chain.iconUrl}
                                          width={20}
                                          height={20}
                                        />
                                      )}
                                    </div>
                                  )}
                                  <span>{chain.name}</span>
                                </button>

                                <button
                                  onClick={openAccountModal}
                                  type="button"
                                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg"
                                >
                                  <div className="w-5 h-5 bg-white/20 rounded-full"></div>
                                  <span>
                                    {account.displayName}
                                    {account.displayBalance
                                      ? ` (${account.displayBalance})`
                                      : ""}
                                  </span>
                                </button>
                              </div>
                            );
                          })()}
                        </div>
                      );
                    }}
                  </ConnectButton.Custom>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
