//expense-frontend/src/components/Navbar.jsx
import { FaBars, FaWallet } from "react-icons/fa";

function Navbar({ setOpen }) {
  const today = new Date().toLocaleDateString("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

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
          <FaWallet size={18} />
        </div>

        <div>
          <h1 className="text-lg font-bold text-gray-800 leading-none">
            ระบบบันทึกรายรับรายจ่าย
          </h1>
          <p className="text-xs text-gray-500">
            Expense Tracker
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="hidden md:flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-700">{today}</p>
          <p className="text-xs text-gray-500">Dashboard</p>
        </div>

        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-semibold text-gray-700">
          A
        </div>
      </div>

    </header>
  );
}

export default Navbar;