import {
  FaUser,
  FaLock,
  FaTags,
  FaList,
  FaUsers,
  FaChevronRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Settings() {
  const navigate = useNavigate();

  const menus = [
    {
      title: "ข้อมูลส่วนตัว",
      description: "จัดการชื่อ อีเมล เบอร์โทรศัพท์ และข้อมูลบัญชี",
      icon: <FaUser />,
      path: "/profile",
    },
    {
      title: "เปลี่ยนรหัสผ่าน",
      description: "เปลี่ยนรหัสผ่านสำหรับเข้าสู่ระบบ",
      icon: <FaLock />,
      path: "/change-password",
    },
    {
      title: "ประเภท",
      description: "จัดการประเภทของรายรับและรายจ่าย",
      icon: <FaTags />,
      path: "/types",
    },
    {
      title: "หมวดหมู่",
      description: "จัดการหมวดหมู่รายรับและรายจ่าย",
      icon: <FaList />,
      path: "/categories",
    },
    {
      title: "สมาชิก",
      description: "จัดการข้อมูลสมาชิกและผู้ใช้งานระบบ",
      icon: <FaUsers />,
      path: "/register",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">ตั้งค่า</h1>

          <p className="mt-1 text-sm text-gray-500">
            จัดการข้อมูลและการตั้งค่าของระบบ
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          {menus.map((menu, index) => (
            <button
              key={menu.path}
              onClick={() => navigate(menu.path)}
              className={`
                                flex w-full items-center gap-4 px-5 py-5
                                text-left transition
                                hover:bg-gray-50
                                ${
                                  index !== menus.length - 1
                                    ? "border-b border-gray-100"
                                    : ""
                                }
                            `}
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
                {menu.icon}
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-gray-800">{menu.title}</h2>

                <p className="mt-1 text-sm text-gray-500">{menu.description}</p>
              </div>

              <FaChevronRight className="flex-shrink-0 text-gray-400" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Settings;
