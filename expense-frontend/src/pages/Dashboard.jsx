// expense-frontend/src/pages/Dashboard.jsx

import { useEffect, useState } from "react";
import api from "../api/axios";
import { errorAlert } from "../utils/alert";

import { FaArrowUp, FaArrowDown, FaWallet } from "react-icons/fa";

function Dashboard() {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    totalTransactions: 0,
    incomeTransactions: 0,
    expenseTransactions: 0,
  });

  const [latestTransactions, setLatestTransactions] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadDashboard();
    loadUser();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await api.get("/dashboard");

      const data = res.data.data;
      setSummary({
        totalIncome: Number(data.summary?.totalIncome || 0),
        totalExpense: Number(data.summary?.totalExpense || 0),
        balance: Number(data.summary?.balance || 0),
        totalTransactions: Number(data.summary?.totalTransactions || 0),
        incomeTransactions: Number(data.summary?.incomeTransactions || 0),
        expenseTransactions: Number(data.summary?.expenseTransactions || 0),
      });
      setLatestTransactions(data.latestTransactions || []);
    } catch (err) {
      errorAlert(
        err.response?.data?.message || "ไม่สามารถโหลดข้อมูล Dashboard ได้",
      );
    }
  };

  const loadUser = async () => {
    try {
      const res = await api.get("/auth/profile");
      setUser(res.data.user);
    } catch (err) {
      errorAlert(
        err.response?.data?.message || "ไม่สามารถโหลดข้อมูลผู้ใช้งานได้",
      );
    }
  };

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
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

        <p className="mt-1 text-gray-500">ภาพรวมรายรับ รายจ่าย และยอดคงเหลือ</p>
      </div>

      <div className="w-full overflow-hidden whitespace-nowrap">
        <div className="inline-block animate-marquee text-3xl font-bold text-gray-800">
          ยินดีต้อนรับ {user?.fullName || "-"} เข้าสู่ระบบจัดการรายรับรายจ่าย
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.title}
            className="overflow-hidden rounded-2xl border bg-white shadow"
          >
            <div className={`${card.color} h-2`} />

            <div className="flex items-center justify-between p-6">
              <div>
                <p className="text-gray-500">{card.title}</p>

                <h2 className="mt-2 text-3xl font-bold">
                  {card.value.toLocaleString()}
                </h2>
              </div>

              <div
                className={`
                  ${card.color}
                  flex h-14 w-14
                  items-center justify-center
                  rounded-2xl
                  text-xl text-white
                `}
              >
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold">รายการล่าสุด</h2>

            <span className="text-sm text-gray-400">5 รายการล่าสุด</span>
          </div>

          {latestTransactions.length > 0 ? (
            <div className="space-y-4">
              {latestTransactions.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="border-b pb-4 last:border-b-0 last:pb-0"
                >
                  <div className="flex justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <div
                          className={`
                            flex h-10 w-10
                            flex-shrink-0
                            items-center
                            justify-center
                            rounded-full
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
                          <p className="font-semibold text-gray-800">
                            {item.categoryName || "-"}
                          </p>

                          <p className="text-sm text-gray-500">
                            {formatThaiDate(item.date)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex-shrink-0 text-right">
                      {Number(item.income) > 0 ? (
                        <p className="font-bold text-green-600">
                          +{Number(item.income).toLocaleString()} บาท
                        </p>
                      ) : (
                        <p className="font-bold text-red-600">
                          -{Number(item.expense).toLocaleString()} บาท
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="ml-13 mt-3 space-y-1">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">ประเภท:</span>{" "}
                      {item.typeName || "-"}
                    </p>

                    <p className="text-sm text-gray-600">
                      <span className="font-medium">หมวดหมู่:</span>{" "}
                      {item.categoryName || "-"}
                    </p>

                    <p className="text-sm text-gray-600">
                      <span className="font-medium">หมายเหตุ:</span>{" "}
                      {item.note || "-"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-gray-400">
              <FaWallet className="mx-auto mb-3 text-4xl text-gray-300" />

              <p>ยังไม่มีรายการ</p>
            </div>
          )}
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-lg">
          <h2 className="mb-6 text-2xl font-bold text-gray-800">สรุปข้อมูล</h2>

          <div className="flex items-center justify-between py-3">
            <span className="text-lg text-gray-700">จำนวนรายการ</span>

            <strong className="text-lg font-bold text-gray-900">
              {summary.totalTransactions.toLocaleString()} รายการ
            </strong>
          </div>

          <div className="flex items-center justify-between py-3">
            <span className="text-lg text-gray-700">จำนวนรายการรายรับ</span>

            <strong className="text-lg font-bold text-green-600">
              {summary.incomeTransactions.toLocaleString()} รายการ
            </strong>
          </div>

          <div className="flex items-center justify-between py-3">
            <span className="text-lg text-gray-700">จำนวนรายการรายจ่าย</span>

            <strong className="text-lg font-bold text-red-600">
              {summary.expenseTransactions.toLocaleString()} รายการ
            </strong>
          </div>

          <div className="flex items-center justify-between py-3">
            <span className="text-lg text-gray-700">รายรับทั้งหมด</span>

            <strong className="text-lg font-bold text-green-600">
              {summary.totalIncome.toLocaleString()} บาท
            </strong>
          </div>

          <div className="flex items-center justify-between py-3">
            <span className="text-lg text-gray-700">รายจ่ายทั้งหมด</span>

            <strong className="text-lg font-bold text-red-600">
              {summary.totalExpense.toLocaleString()} บาท
            </strong>
          </div>

          <div className="my-3 border-t border-gray-400" />

          <div className="flex items-center justify-between pt-2">
            <span className="text-xl font-bold text-gray-800">คงเหลือ</span>

            <strong className="text-xl font-bold text-blue-600">
              {summary.balance.toLocaleString()} บาท
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
