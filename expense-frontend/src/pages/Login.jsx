import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaLock, FaWallet, FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import api from "../api/axios";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/auth/login", form);

      Swal.fire({
        icon: "success",
        title: "เข้าสู่ระบบสำเร็จ",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/dashboard");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "เข้าสู่ระบบไม่สำเร็จ",
        text: err.response?.data?.message || "Email หรือ Password ไม่ถูกต้อง",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-blue-100 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-2">
        {/* Left */}
        <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-green-600 to-emerald-700 text-white p-12">
          <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mb-6">
            <img src="../public/BiwBoong.png" alt="mo" />
          </div>
          <h1 className="text-4xl font-bold mb-4">BiwBoong Finance</h1>
          <h2 className="text-xl font-bold mb-4">Personal Income & Expense Management System</h2>
          <p className="text-center text-green-100 leading-7">
            ระบบบันทึกรายรับรายจ่าย
            <br />
            จัดการการเงินของคุณได้ง่าย
            <br />
            ทุกที่ ทุกเวลา
          </p>
        </div>

        {/* Right */}
        <div className="p-10 lg:p-14">
          <h2 className="text-3xl font-bold text-center text-gray-800">
            เข้าสู่ระบบ
          </h2>
          <p className="text-gray-500 text-center mt-2 mb-8">
            ยินดีต้อนรับกลับ
          </p>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Username หรือ Email
              </label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Username หรือ Email"
                  required
                  className="w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>

              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="********"
                  required
                  className="w-full pl-12 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Forgot */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-green-600 hover:underline"
              >
                ลืมรหัสผ่าน?
              </Link>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 hover:scale-[1.01] transition text-white py-3 rounded-xl font-semibold disabled:opacity-60"
            >
              {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
