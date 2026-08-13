import {
  FaChartPie,
  FaMoneyBillWave,
  FaPlus,
  FaTimes,
  FaSignOutAlt,
  FaCog,
  FaDownload,
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
    name: "เพิ่มรายการ",
    icon: <FaPlus className="text-lg" />,
    path: "/add-transaction",
  },
  {
    name: "ตั้งค่า",
    icon: <FaCog className="text-lg" />,
    path: "/setting",
  },
];

function Sidebar({ open, setOpen, user }) {
  const navigate = useNavigate();

  // ==========================================
  // ติดตั้ง PWA
  // ==========================================
  const handleInstallApp = async () => {
    console.log("Sidebar installApp:", {
      userAgent: navigator.userAgent,
      os: navigator.platform,
      browser: "Chrome / Edge",
    });

    // ตรวจสอบว่าติดตั้งเป็น App แล้วหรือยัง
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    if (isStandalone) {
      console.log("PWA ติดตั้งอยู่แล้ว");
      return;
    }

    // ดึง Prompt ที่ main.jsx เก็บไว้
    const promptEvent = window.__deferredPrompt;

    console.log("deferredPrompt:", promptEvent);

    // ถ้า Chrome ยังไม่ส่ง Prompt มา
    if (!promptEvent) {
      alert(
        "ยังไม่พร้อมติดตั้งแอป\n\n" +
          'หากต้องการติดตั้ง ให้เปิดเมนู "⋮" ของ Chrome แล้วเลือก "ติดตั้งแอป"',
      );

      return;
    }

    try {
      // เปิดหน้าต่าง Install App ของ Chrome
      promptEvent.prompt();

      const { outcome } = await promptEvent.userChoice;

      console.log("User response to the install prompt:", outcome);

      if (outcome === "accepted") {
        console.log("PWA install accepted");
      } else {
        console.log("PWA install dismissed");
      }

      // Prompt ใช้ได้ครั้งเดียว
      window.__deferredPrompt = null;
    } catch (error) {
      console.error("PWA Install Error:", error);
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================
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

  // ==========================================
  // USER
  // ==========================================
  const displayName =
    user?.fullName ||
    `${user?.prefix || ""}${user?.firstName || ""} ${
      user?.lastName || ""
    }`.trim() ||
    user?.username ||
    "ผู้ใช้งาน";

  const roleName = user?.role === "admin" ? "ผู้ดูแลระบบ" : "สมาชิก";

  const avatarText =
    user?.firstName?.charAt(0) || user?.username?.charAt(0) || "U";

  return (
    <>
      {/* Overlay มือถือ */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-64 transform flex-col bg-slate-900 text-white transition-transform duration-300 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-700 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500">
              <img
                src="/BiwBoong.png"
                alt="BiwBoong"
                className="h-full w-full object-contain"
              />
            </div>

            <div>
              <h2 className="text-base font-bold text-white">
                บันทึกค่าใช้จ่าย
              </h2>

              <p className="text-xs text-slate-400">รายรับรายจ่าย</p>
            </div>
          </div>

          {/* ปิด Sidebar มือถือ */}
          <button
            onClick={() => setOpen(false)}
            className="text-white transition hover:text-red-400 lg:hidden"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* User */}
        <div className="px-4 pt-5">
          <div className="flex items-center gap-3 rounded-xl bg-slate-100 p-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-500 font-bold uppercase text-white">
              {avatarText}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-black">
                {displayName}
              </p>

              <p className="truncate text-sm font-semibold text-slate-400">
                {roleName}
              </p>

              <p className="truncate text-sm font-semibold text-green-600">
                @{user?.username || "-"}
              </p>
            </div>
          </div>
        </div>

        {/* Menu Title */}
        <div className="px-5 pb-2 pt-5 text-xs uppercase tracking-wider text-slate-500">
          เมนูหลัก
        </div>

        {/* Menu */}
        <nav className="flex-1 space-y-2 overflow-y-auto px-3">
          {menus.map((menu) => (
            <NavLink
              key={menu.path}
              to={menu.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                  isActive
                    ? "bg-green-500 text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              {menu.icon}

              <span>{menu.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="border-t border-slate-700 p-5">
          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 py-3 font-medium text-white transition hover:bg-red-600"
          >
            <FaSignOutAlt />
            ออกจากระบบ
          </button>

          {/* Install App */}
          <button
            type="button"
            onClick={handleInstallApp}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-green-500 bg-green-500/10 py-3 font-medium text-green-400 transition hover:bg-green-500 hover:text-white"
          >
            <FaDownload />
            ติดตั้งแอป
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
