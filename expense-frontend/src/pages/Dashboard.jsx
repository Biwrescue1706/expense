import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";

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

  return (
    <Layout>
      <h1 className="text-3xl text-black font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* รายรับ */}
        <div className="bg-green-500 text-white rounded-xl p-6 shadow-lg">
          <h2 className="text-lg font-medium">รายรับ</h2>

          <p className="text-4xl font-bold mt-3">
            {Number(summary.income).toLocaleString()} บาท
          </p>
        </div>

        {/* รายจ่าย */}
        <div className="bg-red-500 text-white rounded-xl p-6 shadow-lg">
          <h2 className="text-lg font-medium">รายจ่าย</h2>

          <p className="text-4xl font-bold mt-3">
            {Number(summary.expense).toLocaleString()} บาท
          </p>
        </div>

        {/* คงเหลือ */}
        <div className="bg-blue-500 text-white rounded-xl p-6 shadow-lg">
          <h2 className="text-lg font-medium">คงเหลือ</h2>

          <p className="text-4xl font-bold mt-3">
            {Number(summary.balance).toLocaleString()} บาท
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
