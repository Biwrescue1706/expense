import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { errorAlert } from "../utils/alert";

import { FaArrowUp, FaArrowDown, FaWallet } from "react-icons/fa";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

function Dashboard() {
  const currentDate = new Date();

  const [selectedMonth, setSelectedMonth] = useState("all");

  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);

      const res = await api.get("/transactions");

      const responseData = res.data;

      const data =
        responseData.data?.transactions ||
        responseData.data ||
        responseData.transactions ||
        [];

      if (Array.isArray(data)) {
        setTransactions(data);
      } else {
        setTransactions([]);
      }
    } catch (err) {
      errorAlert(err.response?.data?.message || "ไม่สามารถโหลดข้อมูลรายการได้");
    } finally {
      setLoading(false);
    }
  };

  const monthNames = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  const thaiMonthNames = [
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

  const formatThaiDate = (date) => {
    if (!date) {
      return "-";
    }

    const parts = String(date).split("-");

    if (parts.length !== 3) {
      return date;
    }

    const year = Number(parts[0]);
    const month = Number(parts[1]);
    const day = Number(parts[2]);

    return `${day} ${thaiMonthNames[month - 1]} ${year + 543}`;
  };

  const years = useMemo(() => {
    const yearSet = new Set();

    transactions.forEach((item) => {
      if (!item.date) {
        return;
      }

      const parts = String(item.date).split("-");

      if (parts.length !== 3) {
        return;
      }

      const year = Number(parts[0]);

      if (!isNaN(year)) {
        yearSet.add(year);
      }
    });

    yearSet.add(currentDate.getFullYear());

    return Array.from(yearSet).sort((a, b) => b - a);
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((item) => {
      if (!item.date) {
        return false;
      }

      const parts = String(item.date).split("-");

      if (parts.length !== 3) {
        return false;
      }

      const year = Number(parts[0]);
      const month = Number(parts[1]);

      return (
        year === selectedYear &&
        (selectedMonth === "all" || month === Number(selectedMonth))
      );
    });
  }, [transactions, selectedMonth, selectedYear]);

  const summary = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;
    let incomeTransactions = 0;
    let expenseTransactions = 0;

    filteredTransactions.forEach((item) => {
      const income = Number(item.income || 0);
      const expense = Number(item.expense || 0);

      totalIncome += income;
      totalExpense += expense;

      if (income > 0) {
        incomeTransactions++;
      }

      if (expense > 0) {
        expenseTransactions++;
      }
    });

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      totalTransactions: filteredTransactions.length,
      incomeTransactions,
      expenseTransactions,
    };
  }, [filteredTransactions]);

  const latestTransactions = useMemo(() => {
    return [...filteredTransactions]
      .sort((a, b) => String(b.date).localeCompare(String(a.date)))
      .slice(0, 5);
  }, [filteredTransactions]);

  const chartData = useMemo(() => {
    if (selectedMonth === "all") {
      const data = monthNames.map((month, index) => ({
        month: thaiMonthNames[index],
        income: 0,
        expense: 0,
      }));

      filteredTransactions.forEach((item) => {
        if (!item.date) {
          return;
        }

        const parts = String(item.date).split("-");

        if (parts.length !== 3) {
          return;
        }

        const monthIndex = Number(parts[1]) - 1;

        if (monthIndex >= 0 && monthIndex < 12) {
          data[monthIndex].income += Number(item.income || 0);

          data[monthIndex].expense += Number(item.expense || 0);
        }
      });

      return data;
    }

    const daysInMonth = new Date(
      selectedYear,
      Number(selectedMonth),
      0,
    ).getDate();

    const data = [];

    for (let day = 1; day <= daysInMonth; day++) {
      let income = 0;
      let expense = 0;

      filteredTransactions.forEach((item) => {
        if (!item.date) {
          return;
        }

        const parts = String(item.date).split("-");

        if (parts.length !== 3) {
          return;
        }

        const itemDay = Number(parts[2]);

        if (itemDay === day) {
          income += Number(item.income || 0);

          expense += Number(item.expense || 0);
        }
      });

      data.push({
        month: `${day}`,
        income,
        expense,
      });
    }

    return data;
  }, [filteredTransactions, selectedMonth, selectedYear]);

  const selectedMonthText =
    selectedMonth === "all" ? "ทั้งหมด" : monthNames[Number(selectedMonth) - 1];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm sm:p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            ภาพรวมการเงิน
          </h1>

          <p className="mt-1 text-sm text-gray-500">สรุปรายรับและรายจ่าย</p>
        </div>

        {/* เดือน / ปี */}
        <div className="flex gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 outline-none focus:border-green-500"
          >
            <option value="all">ทั้งหมด</option>

            {monthNames.map((month, index) => (
              <option key={index} value={index + 1}>
                {month}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 outline-none focus:border-green-500"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year + 543}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
        {/* รายรับ */}
        <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-5">
          <p className="text-sm font-medium text-gray-900">รายรับ</p>

          <p className="mt-1 text-xs text-gray-500">
            {selectedMonthText} {selectedYear + 543}
          </p>

          <p className="mt-3 text-xl font-bold text-green-600 sm:text-2xl">
            ฿ {summary.totalIncome.toLocaleString()}
          </p>
        </div>

        {/* รายจ่าย */}
        <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-5">
          <p className="text-sm font-medium text-gray-900">รายจ่าย</p>

          <p className="mt-1 text-xs text-gray-500">
            {selectedMonthText} {selectedYear + 543}
          </p>

          <p className="mt-3 text-xl font-bold text-red-500 sm:text-2xl">
            ฿ {summary.totalExpense.toLocaleString()}
          </p>
        </div>

        {/* คงเหลือ */}
        <div className="col-span-2 rounded-2xl bg-white p-4 shadow-sm sm:p-5 md:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">คงเหลือ</p>

              <p className="mt-1 text-xs text-gray-500">
                {selectedMonthText} {selectedYear + 543}
              </p>

              <p className="mt-3 text-xl font-bold text-blue-600 sm:text-2xl">
                ฿ {summary.balance.toLocaleString()}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 sm:h-14 sm:w-14">
              <FaWallet className="text-2xl text-blue-500 sm:text-3xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Graph */}
      <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-gray-900">รายรับ - รายจ่าย</h2>

          <p className="mt-1 text-sm text-gray-500">
            {selectedMonthText} {selectedYear + 543}
          </p>
        </div>

        <div className="h-[280px] w-full sm:h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" tick={{ fontSize: 11 }} />

              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={(value) => Number(value).toLocaleString()}
              />

              <Tooltip
                formatter={(value) => `${Number(value).toLocaleString()} บาท`}
                labelFormatter={(label) =>
                  selectedMonth === "all" ? label : `วันที่ ${label}`
                }
              />

              <Legend />

              <Line
                type="monotone"
                dataKey="income"
                name="รายรับ"
                stroke="#16a34a"
                strokeWidth={2.5}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />

              <Line
                type="monotone"
                dataKey="expense"
                name="รายจ่าย"
                stroke="#ef4444"
                strokeWidth={2.5}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Latest + Summary */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* รายการล่าสุด */}
        <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">รายการล่าสุด</h2>

              <p className="mt-1 text-xs text-gray-500">
                {selectedMonthText} {selectedYear + 543}
              </p>
            </div>

            <Link
              to="/transactions"
              className="text-sm font-medium text-green-600 hover:text-green-700"
            >
              ดูทั้งหมด →
            </Link>
          </div>

          {loading ? (
            <div className="py-10 text-center text-gray-400">
              กำลังโหลดข้อมูล...
            </div>
          ) : latestTransactions.length > 0 ? (
            <div className="space-y-4">
              {latestTransactions.map((item) => (
                <div
                  key={item.id}
                  className="border-b pb-4 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                          Number(item.income) > 0
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {Number(item.income) > 0 ? (
                          <FaArrowUp />
                        ) : (
                          <FaArrowDown />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-semibold text-gray-900">
                          {item.categoryName || "-"}
                        </p>

                        <p className="text-xs text-gray-500">
                          {formatThaiDate(item.date)}
                        </p>
                      </div>
                    </div>

                    <div className="flex-shrink-0 text-right">
                      {Number(item.income) > 0 ? (
                        <p className="font-bold text-green-600">
                          +{Number(item.income).toLocaleString()} บาท
                        </p>
                      ) : (
                        <p className="font-bold text-red-500">
                          -{Number(item.expense).toLocaleString()} บาท
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="ml-[52px] mt-2 space-y-1">
                    <p className="text-xs text-gray-600">
                      <span className="font-medium text-gray-900">ประเภท:</span>{" "}
                      {item.typeName || "-"}
                    </p>

                    <p className="text-xs text-gray-600">
                      <span className="font-medium text-gray-900">
                        หมวดหมู่:
                      </span>{" "}
                      {item.categoryName || "-"}
                    </p>

                    <p className="text-xs text-gray-600">
                      <span className="font-medium text-gray-900">
                        หมายเหตุ:
                      </span>{" "}
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

        {/* สรุปข้อมูล */}
        <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
          <h2 className="mb-5 text-lg font-bold text-gray-900">สรุปข้อมูล</h2>

          <div className="space-y-1">
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-gray-900">จำนวนรายการ</span>

              <strong className="text-sm font-bold text-gray-900">
                {summary.totalTransactions.toLocaleString()} รายการ
              </strong>
            </div>

            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-gray-900">จำนวนรายการรายรับ</span>

              <strong className="text-sm font-bold text-green-600">
                {summary.incomeTransactions.toLocaleString()} รายการ
              </strong>
            </div>

            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-gray-900">จำนวนรายการรายจ่าย</span>

              <strong className="text-sm font-bold text-red-500">
                {summary.expenseTransactions.toLocaleString()} รายการ
              </strong>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 py-3">
              <span className="text-sm font-medium text-gray-900">
                รายรับทั้งหมด
              </span>

              <strong className="text-sm font-bold text-green-600">
                {summary.totalIncome.toLocaleString()} บาท
              </strong>
            </div>

            <div className="flex items-center justify-between py-3">
              <span className="text-sm font-medium text-gray-900">
                รายจ่ายทั้งหมด
              </span>

              <strong className="text-sm font-bold text-red-500">
                {summary.totalExpense.toLocaleString()} บาท
              </strong>
            </div>

            <div className="my-2 border-t border-gray-200" />

            <div className="flex items-center justify-between py-3">
              <span className="font-bold text-gray-900">คงเหลือ</span>

              <strong className="text-lg font-bold text-blue-600">
                {summary.balance.toLocaleString()} บาท
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
