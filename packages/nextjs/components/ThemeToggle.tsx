"use client";

import { useTheme } from "./ThemeProvider";
import { SunIcon, MoonIcon, ComputerDesktopIcon } from "@heroicons/react/24/outline";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const getIcon = () => {
    switch (theme) {
      case "light":
        return <SunIcon className="w-5 h-5" />;
      case "dark":
        return <MoonIcon className="w-5 h-5" />;
      default:
        return <ComputerDesktopIcon className="w-5 h-5" />;
    }
  };

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle" aria-label="Toggle theme">
        {getIcon()}
      </div>
      <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
        <li>
          <button
            onClick={() => setTheme("light")}
            className={`flex items-center gap-2 ${theme === "light" ? "active" : ""}`}
          >
            <SunIcon className="w-4 h-4" />
            Light
          </button>
        </li>
        <li>
          <button
            onClick={() => setTheme("dark")}
            className={`flex items-center gap-2 ${theme === "dark" ? "active" : ""}`}
          >
            <MoonIcon className="w-4 h-4" />
            Dark
          </button>
        </li>
        <li>
          <button
            onClick={() => setTheme("system")}
            className={`flex items-center gap-2 ${theme === "system" ? "active" : ""}`}
          >
            <ComputerDesktopIcon className="w-4 h-4" />
            System
          </button>
        </li>
      </ul>
    </div>
  );
};
