// expense-frontend/src/pages/Dashboard.jsx

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

  // =========================
  // โหลด Dashboard
  // =========================

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await api.get("/dashboard");

      setSummary(res.data.data.summary);

      setLatestTransactions(res.data.data.latestTransactions);
    } catch (err) {
      console.error("Dashboard Error:", err);
    }
  };

  // =========================
  // แปลงวันที่
  // 2026-08-08
  // ↓
  // 8 ส.ค. 2569
  // =========================

  const formatThaiDate = (date) => {
    if (!date) {
      return "-";
    }

    const parts = date.split("-");

    if (parts.length !== 3) {
      return date;
    }

    const year = Number(parts[0]);
    const month = Number(parts[1]);
    const day = Number(parts[2]);

    const months = [
      "ม.ค.",
      "ก.พ.",
      "มี.ค.",
      "เม.ย.",
      "พ.ค.",
      "มิ.ย.",
      "ก.ค.",
      "ส.ค.",
      "ก.ย.",
      "ต.ค.",
      "พ.ย.",
      "ธ.ค.",
    ];

    return `${day} ${months[month - 1]} ${year + 543}`;
  };

  // =========================
  // Cards
  // =========================

  const cards = [
    {
      title: "รายรับ",
      value: Number(summary.totalIncome || 0),
      color: "bg-green-500",
      icon: <FaArrowUp />,
    },

    {
      title: "รายจ่าย",
      value: Number(summary.totalExpense || 0),
      color: "bg-red-500",
      icon: <FaArrowDown />,
    },

    {
      title: "คงเหลือ",
      value: Number(summary.balance || 0),
      color: "bg-blue-500",
      icon: <FaWallet />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* =========================
          Header
      ========================= */}

      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

        <p className="text-gray-500 mt-1">ภาพรวมรายรับ รายจ่าย และยอดคงเหลือ</p>
      </div>

      {/* =========================
          Summary
      ========================= */}

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
                  {card.value.toLocaleString()} บาท
                </h2>
              </div>

              <div
                className={`
                  ${card.color}
                  w-14 h-14
                  rounded-2xl
                  flex items-center justify-center
                  text-white text-xl
                `}
              >
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* =========================
          Bottom
      ========================= */}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* =========================
            รายการล่าสุด
        ========================= */}

        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold">รายการล่าสุด</h2>

            <span className="text-sm text-gray-400">5 รายการล่าสุด</span>
          </div>

          {latestTransactions.length > 0 ? (
            <div className="space-y-4">
              {latestTransactions.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="
                      border-b
                      pb-4
                      last:border-b-0
                      last:pb-0
                    "
                >
                  {/* บรรทัดบน */}

                  <div className="flex justify-between gap-4">
                    {/* ข้อมูลรายการ */}

                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        {/* Icon */}

                        <div
                          className={`
                              w-10
                              h-10
                              rounded-full
                              flex
                              items-center
                              justify-center
                              flex-shrink-0
                              ${
                                Number(item.income) > 0
                                  ? "bg-green-100 text-green-600"
                                  : "bg-red-100 text-red-600"
                              }
                            `}
                        >
                          {Number(item.income) > 0 ? (
                            <FaArrowUp />
                          ) : (
                            <FaArrowDown />
                          )}
                        </div>

                        <div>
                          {/* หมวดหมู่ */}

                          <p className="font-semibold text-gray-800">
                            {item.categoryName || "-"}
                          </p>

                          {/* วันที่ */}

                          <p className="text-sm text-gray-500">
                            {formatThaiDate(item.date)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* จำนวนเงิน */}

                    <div className="text-right flex-shrink-0">
                      {Number(item.income) > 0 ? (
                        <p className="font-bold text-green-600">
                          +{Number(item.income).toLocaleString()}
                          {" บาท"}
                        </p>
                      ) : (
                        <p className="font-bold text-red-600">
                          -{Number(item.expense).toLocaleString()}
                          {" บาท"}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* =========================
                        รายละเอียด
                    ========================= */}

                  <div className="ml-13 mt-3 space-y-1">
                    {/* ประเภท */}

                    <p className="text-sm text-gray-600">
                      <span className="font-medium">ประเภท:</span>{" "}
                      {item.typeName || "-"}
                    </p>

                    {/* หมวดหมู่ */}

                    <p className="text-sm text-gray-600">
                      <span className="font-medium">หมวดหมู่:</span>{" "}
                      {item.categoryName || "-"}
                    </p>

                    {/* Note */}

                    <p className="text-sm text-gray-600">
                      <span className="font-medium">หมายเหตุ:</span>{" "}
                      {item.note ? item.note : "-"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-10">
              <FaWallet
                className="
                  mx-auto
                  text-4xl
                  text-gray-300
                  mb-3
                "
              />

              <p>ยังไม่มีรายการ</p>
            </div>
          )}
        </div>

        {/* =========================
            สรุปข้อมูล
        ========================= */}

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">สรุปข้อมูล</h2>

          <div className="space-y-4">
            {/* จำนวนรายการ */}

            <div className="flex justify-between">
              <span>จำนวนรายการ</span>

              <span className="font-bold">
                {Number(summary.totalTransactions || 0).toLocaleString()}
              </span>
            </div>

            {/* รายรับ */}

            <div className="flex justify-between">
              <span>รายรับทั้งหมด</span>

              <span className="text-green-600 font-bold">
                {Number(summary.totalIncome || 0).toLocaleString()}

                {" บาท"}
              </span>
            </div>

            {/* รายจ่าย */}

            <div className="flex justify-between">
              <span>รายจ่ายทั้งหมด</span>

              <span className="text-red-600 font-bold">
                {Number(summary.totalExpense || 0).toLocaleString()}

                {" บาท"}
              </span>
            </div>

            <hr />

            {/* คงเหลือ */}

            <div className="flex justify-between text-lg">
              <span className="font-bold">คงเหลือ</span>

              <span className="text-blue-600 font-bold">
                {Number(summary.balance || 0).toLocaleString()}

                {" บาท"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
