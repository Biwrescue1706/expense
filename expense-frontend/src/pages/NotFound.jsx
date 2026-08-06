import { Link } from "react-router-dom";
import { FaExclamationTriangle, FaHome } from "react-icons/fa";

function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-gray-200 flex items-center justify-center p-6">

      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-lg w-full text-center">

        <div className="w-24 h-24 mx-auto rounded-full bg-red-100 flex items-center justify-center">
          <FaExclamationTriangle
            size={40}
            className="text-red-500"
          />
        </div>

        <h1 className="text-7xl font-extrabold text-red-500 mt-6">
          404
        </h1>

        <h2 className="text-2xl font-bold text-gray-800 mt-4">
          ไม่พบหน้าที่คุณต้องการ
        </h2>

        <p className="text-gray-500 mt-3 leading-7">
          ขออภัย หน้าที่คุณกำลังค้นหาอาจถูกลบ
          ย้ายตำแหน่ง หรือไม่มีอยู่ในระบบ
        </p>

        <Link
          to="/dashboard"
          className="mt-8 inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition shadow-lg"
        >
          <FaHome />
          กลับสู่หน้าหลัก
        </Link>

      </div>

    </div>
  );
}

export default NotFound;