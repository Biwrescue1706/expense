import { FaWallet } from "react-icons/fa";

function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-64">

      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-green-200"></div>

        <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-green-600 border-t-transparent animate-spin"></div>

        <div className="absolute inset-0 flex items-center justify-center">
          <FaWallet className="text-green-600 text-xl" />
        </div>
      </div>

      <h3 className="mt-5 text-lg font-semibold text-gray-700">
        กำลังโหลดข้อมูล...
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        กรุณารอสักครู่
      </p>

    </div>
  );
}

export default Loading;