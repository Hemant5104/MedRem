import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiPackage,
  FiCalendar,
  FiClock,
  FiSettings,
  FiLogOut
} from "react-icons/fi";

const Sidebar = () => {
  const linkClass = ({ isActive }) =>
    `group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
     ${
       isActive
         ? "bg-gradient-to-r from-teal-600 to-indigo-600 text-white shadow-lg"
         : "text-gray-300 hover:bg-white/10 hover:text-white"
     }`;

  return (
    <aside
      className="
        w-64 min-h-screen flex flex-col
        bg-gradient-to-b from-[#0f172a] via-[#020617] to-black
        border-r border-white/10
      "
    >
      {/* LOGO */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
          💊
        </div>
        <span className="font-semibold text-lg text-white tracking-wide">
          MedRem
        </span>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-4 py-5 space-y-2">

        <NavLink to="/dashboard" className={linkClass}>
          <FiHome className="text-lg" />
          Dashboard
        </NavLink>

        <NavLink to="/medicines" className={linkClass}>
          <FiPackage className="text-lg" />
          Medicines
        </NavLink>

        <NavLink to="/appointments" className={linkClass}>
          <FiCalendar className="text-lg" />
          Appointments
        </NavLink>

        <NavLink to="/history" className={linkClass}>
          <FiClock className="text-lg" />
          History
        </NavLink>
        <NavLink to="/hospitals" className={linkClass}>
          <FiClock className="text-lg" />
          NearBy Hospitals
        </NavLink>

        <NavLink to="/profile" className={linkClass}>
          <FiSettings className="text-lg" />
          Profile
        </NavLink>

      </nav>

      {/* LOGOUT */}
      <div className="px-4 py-5 border-t border-white/10">
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          className="
            flex items-center gap-3 w-full px-4 py-3 rounded-xl
            text-sm font-medium text-red-400
            hover:bg-red-500/10 hover:text-red-300 transition
          "
        >
          <FiLogOut className="text-lg" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
