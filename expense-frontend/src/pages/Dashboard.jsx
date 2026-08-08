import { useEffect, useState } from "react";
import api from "../api/axios";
import { FaArrowUp, FaArrowDown, FaWallet } from "react-icons/fa";

function Dashboard() {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    totalTransactions: 0,
  });

  const [latestTransactions, setLatestTransactions] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await api.get("/dashboard");

      setSummary(res.data.data.summary);
      setLatestTransactions(res.data.data.latestTransactions);
    } catch (err) {
      console.error(err);
    }
  };

  const cards = [
    {
      title: "รายรับ",
      value: summary.totalIncome,
      color: "bg-green-500",
      icon: <FaArrowUp />,
    },
    {
      title: "รายจ่าย",
      value: summary.totalExpense,
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

        <p className="text-gray-500 mt-1">ภาพรวมรายรับ รายจ่าย และยอดคงเหลือ</p>
      </div>

      {/* Summary */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-2xl shadow border overflow-hidden"
          >
            <div className={`${card.color} h-2`} />

            <div className="p-6 flex items-center justify-between">
              <div>
                <p className="text-gray-500">{card.title}</p>

                <h2 className="text-3xl font-bold mt-2">
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
        {/* รายการล่าสุด */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">รายการล่าสุด</h2>

          {latestTransactions.length > 0 ? (
            <div className="space-y-3">
              {latestTransactions.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <p className="font-medium">{item.description}</p>

                    <p className="text-sm text-gray-500">{item.date}</p>
                  </div>

                  <div
                    className={`font-bold ${
                      item.income > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {item.income > 0
                      ? `+${Number(item.income).toLocaleString()}`
                      : `-${Number(item.expense).toLocaleString()}`}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-10">
              ยังไม่มีข้อมูล
            </div>
          )}
        </div>

        {/* สรุป */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">สรุปข้อมูล</h2>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span>จำนวนรายการ</span>
              <span className="font-bold">{summary.totalTransactions}</span>
            </div>

            <div className="flex justify-between">
              <span>รายรับทั้งหมด</span>
              <span className="text-green-600 font-bold">
                {summary.totalIncome.toLocaleString()} บาท
              </span>
            </div>

            <div className="flex justify-between">
              <span>รายจ่ายทั้งหมด</span>
              <span className="text-red-600 font-bold">
                {summary.totalExpense.toLocaleString()} บาท
              </span>
            </div>

            <hr />

            <div className="flex justify-between text-lg">
              <span className="font-bold">คงเหลือ</span>

              <span className="text-blue-600 font-bold">
                {summary.balance.toLocaleString()} บาท
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
