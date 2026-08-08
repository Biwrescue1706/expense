// expense-frontend/src/components/Sidebar.jsx

import {
  FaChartPie,
  FaMoneyBillWave,
  FaList,
  FaTags,
  FaTimes,
  FaWallet,
  FaSignOutAlt,
} from "react-icons/fa";

import { NavLink, useNavigate } from "react-router-dom";
import api from "../api/axios";

const menus = [
  {
    name: "Dashboard",
    icon: <FaChartPie className="text-lg" />,
    path: "/dashboard",
  },
  {
    name: "รายการ",
    icon: <FaMoneyBillWave className="text-lg" />,
    path: "/transactions",
  },
  {
    name: "หมวดหมู่",
    icon: <FaList className="text-lg" />,
    path: "/categories",
  },
  {
    name: "ประเภท",
    icon: <FaTags className="text-lg" />,
    path: "/types",
  },
  {
    name: "สมาชิก",
    icon: <FaWallet className="text-lg" />,
    path: "/register",
  },
];

function Sidebar({ open, setOpen, user }) {

  const navigate = useNavigate();

  // =========================
  // Logout
  // =========================

  const handleLogout = async () => {

    try {

      await api.post("/auth/logout");

    } catch (err) {

      console.error(err);

    } finally {

      navigate("/", {
        replace: true,
      });

    }

  };

  // =========================
  // ชื่อผู้ใช้งาน
  // =========================

  const displayName =
    user?.fullName ||
    `${user?.prefix || ""}${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    user?.username ||
    "ผู้ใช้งาน";

  // =========================
  // Role
  // =========================

  const roleName =
    user?.role === "admin"
      ? "ผู้ดูแลระบบ"
      : "สมาชิก";

  // =========================
  // ตัวอักษร Avatar
  // =========================

  const avatarText =
    user?.firstName?.charAt(0) ||
    user?.username?.charAt(0) ||
    "U";

  return (

    <>

      {/* =========================
          Overlay Mobile
      ========================= */}

      {open && (

        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />

      )}


      {/* =========================
          Sidebar
      ========================= */}

      <aside
        className={`
          fixed lg:static
          top-0 left-0
          h-screen
          w-64
          bg-slate-900
          text-white
          z-40
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          flex flex-col
        `}
      >

        {/* =========================
            Logo
        ========================= */}

        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-700">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center">

              <FaWallet />

            </div>

            <div>

              <h2 className="text-base font-bold text-white">
                Expense Tracker
              </h2>

              <p className="text-xs text-slate-400">
                Management System
              </p>

            </div>

          </div>


          {/* Close Mobile */}

          <button
            onClick={() => setOpen(false)}
            className="lg:hidden text-white hover:text-red-400 transition"
          >

            <FaTimes size={20} />

          </button>

        </div>


        {/* =========================
            User Profile
            อยู่ก่อนเมนูหลัก
        ========================= */}

        <div className="px-4 pt-5">

          <div className="bg-slate-800 rounded-xl p-3 flex items-center gap-3">

            {/* Avatar */}

            <div className="w-10 h-10 rounded-full bg-green-500 flex-shrink-0 flex items-center justify-center font-bold text-white uppercase">

              {avatarText}

            </div>


            {/* User Information */}

            <div className="min-w-0">

              <p className="text-sm font-semibold text-white truncate">

                {displayName}

              </p>

              <p className="text-xs text-slate-400 truncate">

                {roleName}

              </p>

            </div>

          </div>

        </div>


        {/* =========================
            Menu Title
        ========================= */}

        <div className="px-5 pt-5 pb-2 text-xs uppercase tracking-wider text-slate-500">

          เมนูหลัก

        </div>


        {/* =========================
            Menu
        ========================= */}

        <nav className="flex-1 px-3 space-y-2 overflow-y-auto">

          {menus.map((menu) => (

            <NavLink
              key={menu.path}
              to={menu.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `
                flex items-center gap-3
                rounded-xl
                px-4 py-3
                transition-all duration-200

                ${
                  isActive
                    ? "bg-green-500 text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }
                `
              }
            >

              {menu.icon}

              <span>
                {menu.name}
              </span>

            </NavLink>

          ))}

        </nav>


        {/* =========================
            Footer
        ========================= */}

        <div className="border-t border-slate-700 p-5">

          {/* Logout */}

          <button
            onClick={handleLogout}
            className="
              w-full
              flex items-center justify-center gap-2
              rounded-xl
              bg-red-500
              hover:bg-red-600
              py-3
              text-white
              font-medium
              transition
            "
          >

            <FaSignOutAlt />

            ออกจากระบบ

          </button>


          {/* Version */}

          <div className="mt-4 text-center text-xs text-slate-500">

            Expense Tracker

            <br />

            Version 1.0.0

          </div>

        </div>

      </aside>

    </>

  );
}

export default Sidebar;