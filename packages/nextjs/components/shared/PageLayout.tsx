"use client";

import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
  containerClassName?: string;
}

export const PageLayout = ({ 
  children, 
  title, 
  subtitle, 
  action,
  className = "",
  containerClassName = ""
}: PageLayoutProps) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 ${className}`}>
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${containerClassName}`}>
        {(title || subtitle || action) && (
          <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <div className="flex-1">
              {title && <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{title}</h1>}
              {subtitle && (
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl">{subtitle}</p>
              )}
            </div>
            {action && <div className="mt-4 sm:mt-0 ml-0 sm:ml-6">{action}</div>}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

interface PageSectionProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  elevated?: boolean;
}

export const PageSection = ({ 
  children, 
  title, 
  subtitle, 
  className = "", 
  elevated = true 
}: PageSectionProps) => {
  const baseClasses = elevated 
    ? "bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-white/20 dark:border-gray-700/30 rounded-xl shadow-lg dark:shadow-xl" 
    : "";
  
  return (
    <div className={`${baseClasses} ${className} mb-6`}>
      {(title || subtitle) && (
        <div className="p-6 border-b border-gray-100 dark:border-gray-700/50">
          {title && <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>}
          {subtitle && <p className="text-gray-600 dark:text-gray-300 mt-2">{subtitle}</p>}
        </div>
      )}
      <div className={elevated ? "p-6" : ""}>{children}</div>
    </div>
  );
};

export const StatsGrid = ({ children }: { children: ReactNode }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">{children}</div>
);

export const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  color = "blue" 
}: {
  title: string;
  value: string | number;
  icon?: any;
  trend?: string;
  color?: "blue" | "green" | "purple" | "orange" | "red";
}) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-emerald-600", 
    purple: "from-purple-500 to-indigo-600",
    orange: "from-orange-500 to-amber-600",
    red: "from-red-500 to-rose-600"
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-white/20 dark:border-gray-700/30 rounded-xl shadow-lg dark:shadow-xl p-6 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          {trend && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{trend}</p>}
        </div>
        {Icon && (
          <div className={`p-3 rounded-full bg-gradient-to-r ${colorClasses[color]}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        )}
      </div>
    </div>
  );
};

export const TabNavigation = ({ 
  tabs, 
  activeTab, 
  onTabChange 
}: {
  tabs: Array<{ id: string; name: string; icon?: any }>;
  activeTab: string;
  onTabChange: (tabId: string) => void;
}) => (
  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-white/20 dark:border-gray-700/30 rounded-xl shadow-lg dark:shadow-xl mb-6">
    <div className="border-b border-gray-200 dark:border-gray-700/50">
      <nav className="-mb-px flex space-x-8 px-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600"
              } whitespace-nowrap py-4 px-3 border-b-2 font-medium text-sm flex items-center space-x-2 rounded-t-lg transition-all duration-200`}
            >
              {Icon && <Icon className="w-5 h-5" />}
              <span>{tab.name}</span>
            </button>
          );
        })}
      </nav>
    </div>
  </div>
);

export const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action 
}: {
  icon?: any;
  title: string;
  description: string;
  action?: ReactNode;
}) => (
  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-white/20 dark:border-gray-700/30 rounded-xl shadow-lg dark:shadow-xl p-12 text-center">
    {Icon && <Icon className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />}
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">{description}</p>
    {action}
  </div>
);

// Additional Glassmorphism Components
export const GlassmorphismCard = ({ 
  children, 
  className = "", 
  hover = true 
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) => (
  <div 
    className={`
      bg-white/80 dark:bg-gray-800/80 
      backdrop-blur-lg 
      border border-white/20 dark:border-gray-700/30 
      rounded-xl 
      shadow-lg dark:shadow-xl 
      ${hover ? "hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300" : ""}
      ${className}
    `}
  >
    {children}
  </div>
);

export const LoadingPage = ({ title, description }: { title: string; description?: string }) => (
  <PageLayout title={title} subtitle={description}>
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Loading...</p>
    </div>
  </PageLayout>
);
