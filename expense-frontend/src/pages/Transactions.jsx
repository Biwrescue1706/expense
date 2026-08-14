// src/pages/Transactions.jsx

import { useEffect, useMemo, useState } from "react";
import {
  FaArrowUp,
  FaArrowDown,
  FaEdit,
  FaTrash,
  FaList,
  FaFilePdf,
} from "react-icons/fa";

import api from "../api/axios";

import {
  getTransactions,
  deleteTransaction,
} from "../services/transaction.service";

import TransactionModal from "../components/TransactionModal";

import { successAlert, errorAlert, confirmDelete } from "../utils/alert";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState(null);

  const [user, setUser] = useState(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  // LOAD DATA
  useEffect(() => {
    loadTransactions();
    loadUser();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);

      const data = await getTransactions();

      setTransactions(data || []);
    } catch (err) {
      console.error(err);

      errorAlert(err.response?.data?.message || "ไม่สามารถโหลดรายการได้");
    } finally {
      setLoading(false);
    }
  };

  const loadUser = async () => {
    try {
      const res = await api.get("/auth/profile");

      setUser(res.data.user);
    } catch (err) {
      console.error(err);

      errorAlert(
        err.response?.data?.message || "ไม่สามารถโหลดข้อมูลผู้ใช้งานได้",
      );
    }
  };
  // DATE
  const formatThaiDate = (date) => {
    if (!date) return "-";

    const [year, month, day] = date.split("-").map(Number);

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

    if (!year || !month || !day || !months[month - 1]) {
      return date;
    }

    return `${day} ${months[month - 1]} ${year + 543}`;
  };
  // EDIT / DELETE
  const handleEdit = (transaction) => {
    setEditTransaction(transaction);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await confirmDelete();

    if (!result.isConfirmed) return;

    try {
      await deleteTransaction(id);

      successAlert("ลบรายการสำเร็จ");

      await loadTransactions();
    } catch (err) {
      errorAlert(err.response?.data?.message || "ไม่สามารถลบรายการได้");
    }
  };

  const handleSuccess = async () => {
    await loadTransactions();
  };
  // FILTER
  const handleStartDateChange = (value) => {
    setSelectedYear("");
    setStartDate(value);
  };

  const handleEndDateChange = (value) => {
    setSelectedYear("");
    setEndDate(value);
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);

    if (year) {
      setStartDate(`${year}-01-01`);
      setEndDate(`${year}-12-31`);
    } else {
      setStartDate("");
      setEndDate("");
    }
  };

  const handleClearFilter = () => {
    setSelectedYear("");
    setStartDate("");
    setEndDate("");
  };
  // AVAILABLE YEARS
  const availableYears = useMemo(() => {
    const years = transactions
      .map((transaction) => {
        if (!transaction.date) return null;

        return transaction.date.substring(0, 4);
      })
      .filter(Boolean);

    return [...new Set(years)].sort((a, b) => Number(b) - Number(a));
  }, [transactions]);
  // FILTERED TRANSACTIONS
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    if (startDate) {
      result = result.filter((transaction) => transaction.date >= startDate);
    }

    if (endDate) {
      result = result.filter((transaction) => transaction.date <= endDate);
    }

    // เรียงวันที่เก่า -> ใหม่
    return result.sort((a, b) =>
      String(a.date || "").localeCompare(String(b.date || "")),
    );
  }, [transactions, startDate, endDate]);
  // SUMMARY
  // รวมรายรับทั้งหมด
  const totalIncome = useMemo(() => {
    return filteredTransactions.reduce(
      (sum, transaction) => sum + Number(transaction.income || 0),
      0,
    );
  }, [filteredTransactions]);

  // รวมรายจ่ายทั้งหมด
  const totalExpense = useMemo(() => {
    return filteredTransactions.reduce(
      (sum, transaction) => sum + Number(transaction.expense || 0),
      0,
    );
  }, [filteredTransactions]);
  // IMPORTANT
  // เอา BALANCE ของรายการสุดท้าย
  const latestBalance = useMemo(() => {
    if (filteredTransactions.length === 0) {
      return 0;
    }

    const lastTransaction =
      filteredTransactions[filteredTransactions.length - 1];

    return Number(lastTransaction.balance || 0);
  }, [filteredTransactions]);
  // PDF
  const arrayBufferToBase64 = (buffer) => {
    let binary = "";

    const bytes = new Uint8Array(buffer);

    const chunkSize = 0x8000;

    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));

      binary += String.fromCharCode(...chunk);
    }

    return btoa(binary);
  };

  const handleExportPDF = async () => {
    if (startDate && endDate && startDate > endDate) {
      errorAlert("วันที่เริ่มต้นต้องไม่มากกว่าวันที่สิ้นสุด");

      return;
    }

    if (filteredTransactions.length === 0) {
      errorAlert("ไม่มีข้อมูลในช่วงวันที่หรือปีที่เลือก");

      return;
    }

    try {
      const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
        import("jspdf"),
        import("jspdf-autotable"),
      ]);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // FONT

      const fontUrl = "/fonts/THSarabunNew.ttf";

      const response = await fetch(fontUrl);

      if (!response.ok) {
        throw new Error("ไม่พบไฟล์ฟอนต์ THSarabunNew.ttf");
      }

      const fontBuffer = await response.arrayBuffer();

      const fontBase64 = arrayBufferToBase64(fontBuffer);

      pdf.addFileToVFS("THSarabunNew.ttf", fontBase64);

      pdf.addFont("THSarabunNew.ttf", "THSarabunNew", "normal");

      pdf.setFont("THSarabunNew", "normal");

      // USER

      const userName = user?.fullName || user?.FullName || "-";

      // PDF TRANSACTIONS

      const pdfTransactions = [...filteredTransactions].sort((a, b) =>
        String(a.date || "").localeCompare(String(b.date || "")),
      );

      // REPORT DATE

      const reportStartDate =
        startDate ||
        (selectedYear
          ? `${selectedYear}-01-01`
          : pdfTransactions[0]?.date || "");

      const reportEndDate =
        endDate ||
        (selectedYear
          ? `${selectedYear}-12-31`
          : pdfTransactions[pdfTransactions.length - 1]?.date || "");

      const today = new Date().toISOString().split("T")[0];

      // PDF TABLE DATA

      const tableData = pdfTransactions.map((transaction) => [
        formatThaiDate(transaction.date),

        transaction.categoryName || "-",

        Number(transaction.income || 0) > 0
          ? Number(transaction.income).toLocaleString()
          : "-",

        Number(transaction.expense || 0) > 0
          ? Number(transaction.expense).toLocaleString()
          : "-",

        Number(transaction.balance || 0).toLocaleString(),

        transaction.note || "-",
      ]);

      // HEADER

      const drawPageHeader = () => {
        pdf.setFont("THSarabunNew", "normal");

        pdf.setTextColor(0, 0, 0);

        pdf.setFontSize(22);

        pdf.text("รายงานรายการรายรับรายจ่าย", 105, 18, {
          align: "center",
        });

        pdf.setFontSize(15);

        pdf.text(userName, 15, 27);

        pdf.text(
          `ช่วงวันที่: ${formatThaiDate(reportStartDate)} - ${formatThaiDate(
            reportEndDate,
          )}`,
          15,
          35,
        );

        pdf.setFontSize(14);

        // รายรับ
        pdf.setTextColor(22, 163, 74);

        pdf.text(`รายรับทั้งหมด: ${totalIncome.toLocaleString()} บาท`, 15, 43);

        // รายจ่าย
        pdf.setTextColor(220, 38, 38);

        pdf.text(
          `รายจ่ายทั้งหมด: ${totalExpense.toLocaleString()} บาท`,
          75,
          43,
        );

        // คงเหลือ
        pdf.setTextColor(37, 99, 235);

        pdf.text(`คงเหลือ: ${latestBalance.toLocaleString()} บาท`, 155, 43);

        pdf.setTextColor(0, 0, 0);
      };

      // FOOTER

      const drawPageFooter = (page, pageCount) => {
        pdf.setFont("THSarabunNew", "normal");

        pdf.setFontSize(10);

        pdf.setTextColor(0, 0, 0);

        pdf.text(`วันที่ออกรายงาน: ${formatThaiDate(today)}`, 105, 287, {
          align: "center",
        });

        pdf.text(`หน้า ${page} / ${pageCount}`, 200, 287, {
          align: "right",
        });
      };

      // TABLE

      autoTable(pdf, {
        startY: 50,

        head: [
          ["วันที่", "รายการ", "รายรับ", "รายจ่าย", "คงเหลือ", "หมายเหตุ"],
        ],

        body: tableData,

        theme: "grid",

        styles: {
          font: "THSarabunNew",
          fontStyle: "normal",
          fontSize: 14,
          cellPadding: 3,
          textColor: [31, 41, 55],
          lineColor: [180, 180, 180],
          lineWidth: 0.3,
        },

        headStyles: {
          font: "THSarabunNew",
          fontStyle: "normal",
          fontSize: 14,
          fillColor: [243, 244, 246],
          textColor: [17, 24, 39],
          halign: "center",
          lineColor: [150, 150, 150],
          lineWidth: 0.3,
        },

        columnStyles: {
          0: {
            cellWidth: 25,
            halign: "center",
          },

          1: {
            cellWidth: 40,
            halign: "center",
          },

          2: {
            cellWidth: 20,
            halign: "center",
          },

          3: {
            cellWidth: 20,
            halign: "right",
          },

          4: {
            cellWidth: 20,
            halign: "right",
          },

          5: {
            cellWidth: "auto",
            halign: "left",
          },
        },

        didParseCell: (data) => {
          if (data.section !== "body") {
            return;
          }

          // รายรับ = สีเขียว
          if (data.column.index === 2) {
            data.cell.styles.textColor = [22, 163, 74];
          }

          // รายจ่าย = สีแดง
          if (data.column.index === 3) {
            data.cell.styles.textColor = [220, 38, 38];
          }

          // คงเหลือ = สีน้ำเงิน
          if (data.column.index === 4) {
            data.cell.styles.textColor = [37, 99, 235];
          }
        },

        margin: {
          top: 50,
          bottom: 20,
          left: 10,
          right: 10,
        },

        didDrawPage: () => {
          drawPageHeader();
        },
      });

      // PAGE NUMBER
      const pageCount = pdf.internal.getNumberOfPages();

      for (let page = 1; page <= pageCount; page++) {
        pdf.setPage(page);

        drawPageFooter(page, pageCount);
      }

      // FILE NAME

      let fileName = "รายงานรายรับรายจ่าย";

      if (selectedYear) {
        fileName += `_พ.ศ.${Number(selectedYear) + 543}`;
      } else if (startDate || endDate) {
        fileName += `_${startDate || "เริ่มต้น"}_ถึง_${endDate || "สิ้นสุด"}`;
      } else {
        fileName += `_${today}`;
      }
      pdf.save(`${fileName}.pdf`);
      successAlert("ส่งออก PDF สำเร็จ");
    } catch (err) {
      errorAlert(err.message || "ไม่สามารถสร้างไฟล์ PDF ได้");
    }
  };
  // UI
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            รายการรายรับรายจ่าย
          </h1>

          <p className="mt-1 text-gray-500">
            จัดการรายการรายรับและรายจ่ายของคุณ
          </p>
        </div>

        <button
          onClick={handleExportPDF}
          disabled={loading || filteredTransactions.length === 0}
          className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-white shadow transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          <FaFilePdf />
          ส่งออก PDF
        </button>
      </div>

      {/* FILTER */}
      <div className="rounded-2xl bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-bold text-gray-800">กรองข้อมูล</h2>

        <div className="grid gap-4 md:grid-cols-3">
          {/* START DATE */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              วันที่เริ่มต้น
            </label>

            <input
              type="date"
              value={startDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
              className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* END DATE */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              วันที่สิ้นสุด
            </label>

            <input
              type="date"
              value={endDate}
              onChange={(e) => handleEndDateChange(e.target.value)}
              className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* YEAR */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              เลือกปี
            </label>

            <select
              value={selectedYear}
              onChange={(e) => handleYearChange(e.target.value)}
              className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">-- เลือกปี --</option>

              {availableYears.map((year) => (
                <option key={year} value={year}>
                  พ.ศ. {Number(year) + 543}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            พบข้อมูล {filteredTransactions.length.toLocaleString()} รายการ
          </p>

          <button
            onClick={handleClearFilter}
            className="rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition hover:bg-gray-200"
          >
            ล้างตัวกรอง
          </button>
        </div>
      </div>

      {/* REPORT */}
      <div className="overflow-hidden rounded-2xl bg-white shadow">
        {/* REPORT HEADER */}
        <div className="border-b p-6">
          <h2 className="text-2xl font-bold text-gray-800">
            รายงานรายการรายรับรายจ่าย
          </h2>

          <p className="mt-1 text-gray-500">
            รายการทั้งหมด {filteredTransactions.length.toLocaleString()} รายการ
          </p>
        </div>

        {/* SUMMARY */}
        {!loading && filteredTransactions.length > 0 && (
          <div className="grid grid-cols-1 gap-4 border-b p-6 md:grid-cols-3">
            {/* INCOME */}
            <div className="rounded-xl border p-4">
              <p className="text-sm text-gray-500">รายรับทั้งหมด</p>

              <p className="mt-1 text-xl font-bold text-green-600">
                +{totalIncome.toLocaleString()} บาท
              </p>
            </div>

            {/* EXPENSE */}
            <div className="rounded-xl border p-4">
              <p className="text-sm text-gray-500">รายจ่ายทั้งหมด</p>

              <p className="mt-1 text-xl font-bold text-red-600">
                -{totalExpense.toLocaleString()} บาท
              </p>
            </div>

            {/* BALANCE */}
            <div className="rounded-xl border p-4">
              <p className="text-sm text-gray-500">คงเหลือ</p>

              <p className="mt-1 text-xl font-bold text-blue-600">
                {latestBalance.toLocaleString()} บาท
              </p>
            </div>
          </div>
        )}

        {/* TABLE HEADER */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="flex items-center gap-2 font-semibold text-gray-700">
            <FaList className="text-green-600" />
            รายการทั้งหมด
          </h2>

          <span className="text-sm text-gray-500">
            ทั้งหมด {filteredTransactions.length.toLocaleString()} รายการ
          </span>
        </div>

        {/* TABLE */}
        {loading ? (
          <div className="py-16 text-center text-gray-400">
            กำลังโหลดข้อมูล...
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-gray-400">ไม่พบรายการในช่วงที่เลือก</p>

            <button
              onClick={handleClearFilter}
              className="mt-4 text-green-600 hover:underline"
            >
              ล้างตัวกรอง
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="whitespace-nowrap px-6 py-4 text-left">
                    วันที่
                  </th>

                  <th className="whitespace-nowrap px-6 py-4 text-center">
                    รายการ
                  </th>

                  <th className="whitespace-nowrap px-6 py-4 text-right">
                    รายรับ
                  </th>

                  <th className="whitespace-nowrap px-6 py-4 text-right">
                    รายจ่าย
                  </th>

                  <th className="whitespace-nowrap px-6 py-4 text-right">
                    คงเหลือ
                  </th>

                  <th className="whitespace-nowrap px-6 py-4 text-center">
                    หมายเหตุ
                  </th>

                  <th className="whitespace-nowrap px-6 py-4 text-center">
                    แก้ไข
                  </th>

                  <th className="whitespace-nowrap px-6 py-4 text-center">
                    ลบ
                  </th>
                </tr>
              </thead>

              <tbody className="text-center">
                {filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-t transition hover:bg-gray-50"
                  >
                    {/* DATE */}
                    <td className="whitespace-nowrap px-6 py-4">
                      {formatThaiDate(transaction.date)}
                    </td>

                    {/* CATEGORY */}
                    <td className="px-6 py-4 font-medium">
                      {transaction.categoryName || "-"}
                    </td>

                    {/* INCOME */}
                    <td className="px-6 py-4 text-right">
                      {Number(transaction.income) > 0 ? (
                        <span className="font-semibold text-green-600">
                          {Number(transaction.income).toLocaleString()}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>

                    {/* EXPENSE */}
                    <td className="px-6 py-4 text-right">
                      {Number(transaction.expense) > 0 ? (
                        <span className="font-semibold text-red-600">
                          {Number(transaction.expense).toLocaleString()}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>

                    {/* BALANCE */}
                    <td className="px-6 py-4 text-right font-semibold">
                      {Number(transaction.balance || 0).toLocaleString()}
                    </td>

                    {/* NOTE */}
                    <td className="max-w-xs truncate px-6 py-4 text-center">
                      {transaction.note || "-"}
                    </td>

                    {/* EDIT */}
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleEdit(transaction)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-500 text-white transition hover:bg-yellow-600"
                          title="แก้ไข"
                        >
                          <FaEdit />
                        </button>
                      </div>
                    </td>

                    {/* DELETE */}
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500 text-white transition hover:bg-red-600"
                          title="ลบ"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL */}
      <TransactionModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditTransaction(null);
        }}
        onSuccess={handleSuccess}
        editTransaction={editTransaction}
      />
    </div>
  );
}

export default Transactions;
