import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  FaArrowUp,
  FaArrowDown,
  FaWallet,
} from "react-icons/fa";

function Dashboard() {
  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    balance: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await api.get("/dashboard");
      setSummary(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const cards = [
    {
      title: "รายรับ",
      value: summary.income,
      color: "bg-green-500",
      icon: <FaArrowUp />,
    },
    {
      title: "รายจ่าย",
      value: summary.expense,
      color: "bg-red-500",
      icon: <FaArrowDown />,
    },
    {
      title: "คงเหลือ",
      value: summary.balance,
      color: "bg-blue-500",
      icon: <FaWallet />,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-1">
          ภาพรวมรายรับ รายจ่าย และยอดคงเหลือ
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-2xl shadow border overflow-hidden"
          >
            <div className={`${card.color} h-2`} />

            <div className="p-6 flex justify-between items-center">
              <div>
                <p className="text-gray-500">
                  {card.title}
                </p>

                <h2 className="text-3xl font-bold text-gray-800 mt-2">
                  {Number(card.value).toLocaleString()} บาท
                </h2>
              </div>

              <div
                className={`${card.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl`}
              >
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div className="grid gap-6 lg:grid-cols-2">

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">
            รายการล่าสุด
          </h2>

          <div className="text-gray-400 text-center py-10">
            ยังไม่มีข้อมูล
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">
            กราฟสรุป
          </h2>

          <div className="text-gray-400 text-center py-10">
            เตรียมแสดงกราฟรายรับ-รายจ่าย
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;