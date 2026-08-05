import { FaWallet } from "react-icons/fa";

function Navbar() {
    return (
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">

            <div className="flex items-center gap-3">

                <FaWallet
                    className="text-green-600"
                    size={24}
                />

                <h1 className="text-xl font-bold">

                    Expense Tracker

                </h1>

            </div>

            <div className="text-gray-500">

                ระบบบันทึกรายรับรายจ่าย

            </div>

        </header>
    );
}

export default Navbar;