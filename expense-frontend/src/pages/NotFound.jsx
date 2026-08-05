function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">

                <h1 className="text-7xl font-bold text-red-500">
                    404
                </h1>

                <h2 className="text-2xl font-semibold mt-4">
                    ไม่พบหน้าที่คุณต้องการ
                </h2>

                <p className="text-gray-500 mt-2">
                    หน้าที่คุณกำลังค้นหาอาจถูกลบ ย้าย หรือไม่มีอยู่ในระบบ
                </p>

                <a
                    href="/"
                    className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    กลับหน้าหลัก
                </a>

            </div>
        </div>
    );
}

export default NotFound;