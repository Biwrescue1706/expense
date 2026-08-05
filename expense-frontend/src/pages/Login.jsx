import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../api/axios";

function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

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

            const res = await api.post("/auth/login", form);

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
                text:
                    err.response?.data?.message ||
                    "Email หรือ Password ไม่ถูกต้อง",
            });

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center">

            <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-8">

                <h1 className="text-3xl font-bold text-center text-green-600 mb-2">
                    Expense Tracker
                </h1>

                <p className="text-center text-gray-500 mb-8">
                    เข้าสู่ระบบ
                </p>

                <form onSubmit={handleSubmit}>

                    <div className="mb-4">

                        <label className="font-medium">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-3 mt-2 outline-none focus:border-green-500"
                            placeholder="example@gmail.com"
                            required
                        />

                    </div>

                    <div className="mb-5">

                        <label className="font-medium">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-3 mt-2 outline-none focus:border-green-500"
                            placeholder="********"
                            required
                        />

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
                    >
                        {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
                    </button>

                </form>

                <div className="flex justify-between mt-6 text-sm">

                    <Link
                        to="/register"
                        className="text-green-600 hover:underline"
                    >
                        สมัครสมาชิก
                    </Link>

                    <Link
                        to="/forgot-password"
                        className="text-red-500 hover:underline"
                    >
                        ลืมรหัสผ่าน
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default Login;