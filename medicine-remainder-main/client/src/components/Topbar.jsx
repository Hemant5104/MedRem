import { useEffect, useState } from "react";
import api from "../services/api";
import {
  FiBell,
  FiChevronDown,
  FiClock
} from "react-icons/fi";
import { MdHealthAndSafety } from "react-icons/md";

const Topbar = ({ title }) => {
  const [time, setTime] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get("/profile");
        setUser(res.data);
      } catch (e) {
        // silently ignore
      }
    };
    loadProfile();
  }, []);

  const initials = (() => {
    const name = user?.name || "";
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] || "";
    const second = parts.length > 1 ? parts[1]?.[0] || "" : "";
    return (first + second).toUpperCase() || first.toUpperCase() || "U";
  })();

  return (
    <header
      className="
        h-16 px-6 flex items-center justify-between
        bg-gradient-to-r from-black via-[#020617] to-teal-600
        border-b border-white/10
        text-white
      "
    >
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-white/10 backdrop-blur flex items-center justify-center">
          <MdHealthAndSafety className="text-2xl text-teal-300" />
        </div>

        <div className="flex flex-col leading-tight">
          <h1 className="text-lg font-semibold tracking-wide">
            {title}
          </h1>
          <span className="text-xs text-gray-400">
            Smart medicine & health tracking
          </span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-6">

        {/* CLOCK */}
        <div className="hidden md:flex items-center gap-2 text-sm text-gray-300">
          <FiClock />
          <span>{time}</span>
        </div>

        {/* NOTIFICATIONS */}
        <div className="relative cursor-pointer">
          <FiBell className="text-xl text-gray-300 hover:text-white transition" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
        </div>

        {/* PROFILE */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-teal-400 to-indigo-500 flex items-center justify-center text-sm font-bold shadow">
            {initials}
          </div>

          <div className="hidden md:flex flex-col leading-tight">
            <span className="text-sm font-medium text-white">
              {user?.name || "User"}
            </span>
            <span className="text-xs text-gray-400">
              Patient
            </span>
          </div>

          <FiChevronDown className="text-gray-400 group-hover:text-white transition" />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
