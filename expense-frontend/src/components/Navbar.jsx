//expense-frontend/src/components/Navbar.jsx
import { FaBars, FaWallet } from "react-icons/fa";
import { Link } from "react-router-dom";

function Navbar({ setOpen, user }) {
  const today = new Date().toLocaleDateString("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const displayName =
    user?.fullName ||
    `${user?.prefix || ""}${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    user?.username ||
    "ผู้ใช้งาน";

  const roleName = user?.role === "admin" ? "ผู้ดูแลระบบ" : "สมาชิก";

  return (
    <header className="h-16 bg-blue-500 border-b border-gray-200 shadow-sm flex items-center justify-between px-6">
      {/* Left */}

      <div className="flex items-center gap-4">
        <button
          onClick={() => setOpen(true)}
          className="lg:hidden text-gray-700 hover:text-blue-600 transition"
        >
          <FaBars size={20} />
        </button>

        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
          <img src="../public/BiwBoong.png" alt="mo" size={18} />
        </div>

        <div>
          <Link to="/dashboard" className="no-underline">
            <h1 className="text-lg font-bold text-gray-100 leading-none cursor-pointer">
              ระบบบันทึกรายรับรายจ่าย
            </h1>
          </Link>
        </div>
      </div>

      {/* Right */}

      <div className="hidden md:flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-100">{today}</p>

          <p className="text-xs text-gray-200">{roleName}</p>
        </div>

        {/* User */}

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-100">{displayName}</p>

            <p className="text-xs text-gray-200">@{user?.username || "-"}</p>
          </div>

          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-semibold text-gray-700">
            {(user?.firstName || user?.username || "U").charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
