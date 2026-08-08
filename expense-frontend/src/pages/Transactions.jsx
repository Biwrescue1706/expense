import { useEffect, useState } from "react";
import {
  FaPlus,
  FaArrowUp,
  FaArrowDown,
  FaEdit,
  FaTrash,
  FaList,
} from "react-icons/fa";

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

  // =========================
  // โหลดรายการ
  // =========================

  useEffect(() => {
    loadTransactions();
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

  // =========================
  // แปลงวันที่เป็นไทย
  // 2026-08-08
  // =>
  // 8 ส.ค. 2569
  // =========================

  const formatThaiDate = (date) => {
    if (!date) {
      return "-";
    }

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

  // =========================
  // เพิ่มรายการ
  // =========================

  const handleAdd = () => {
    setEditTransaction(null);

    setModalOpen(true);
  };

  // =========================
  // แก้ไขรายการ
  // =========================

  const handleEdit = (transaction) => {
    setEditTransaction(transaction);

    setModalOpen(true);
  };

  // =========================
  // ลบรายการ
  // =========================

  const handleDelete = async (id) => {
    const result = await confirmDelete();

    if (!result.isConfirmed) {
      return;
    }

    try {
      await deleteTransaction(id);

      successAlert("ลบรายการสำเร็จ");

      await loadTransactions();
    } catch (err) {
      console.error(err);

      errorAlert(err.response?.data?.message || "ไม่สามารถลบรายการได้");
    }
  };

  // =========================
  // หลังบันทึก
  // =========================

  const handleSuccess = async () => {
    await loadTransactions();
  };

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            รายการรายรับรายจ่าย
          </h1>

          <p className="text-gray-500 mt-1">
            จัดการรายการรายรับและรายจ่ายของคุณ
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl shadow transition"
        >
          <FaPlus />
          เพิ่มรายการ
        </button>
      </div>

      {/* Table */}

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        {/* Table Header */}

        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="flex items-center gap-2 font-semibold text-gray-700">
            <FaList className="text-green-600" />
            รายการทั้งหมด
          </h2>

          <span className="text-sm text-gray-500">
            ทั้งหมด {transactions.length} รายการ
          </span>
        </div>

        {/* Loading */}

        {loading ? (
          <div className="py-16 text-center text-gray-400">
            กำลังโหลดข้อมูล...
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-gray-400">ยังไม่มีรายการ</p>

            <button
              onClick={handleAdd}
              className="mt-4 text-green-600 hover:underline"
            >
              + เพิ่มรายการแรก
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left whitespace-nowrap">
                    วันที่
                  </th>

                  <th className="px-6 py-4 text-left whitespace-nowrap">
                    ประเภท
                  </th>

                  <th className="px-6 py-4 text-left whitespace-nowrap">
                    หมวดหมู่
                  </th>

                  <th className="px-6 py-4 text-right whitespace-nowrap">
                    รายรับ
                  </th>

                  <th className="px-6 py-4 text-right whitespace-nowrap">
                    รายจ่าย
                  </th>

                  <th className="px-6 py-4 text-right whitespace-nowrap">
                    คงเหลือ
                  </th>

                  <th className="px-6 py-4 text-left whitespace-nowrap">
                    หมายเหตุ
                  </th>

                  <th className="px-6 py-4 text-center whitespace-nowrap">
                    จัดการ
                  </th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    {/* วันที่ */}

                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatThaiDate(transaction.date)}
                    </td>

                    {/* ประเภท */}

                    <td className="px-6 py-4">
                      {transaction.typeName === "รายรับ" ? (
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                          <FaArrowUp />

                          {transaction.typeName}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium">
                          <FaArrowDown />

                          {transaction.typeName || "รายจ่าย"}
                        </span>
                      )}
                    </td>

                    {/* หมวดหมู่ */}

                    <td className="px-6 py-4 font-medium">
                      {transaction.categoryName || "-"}
                    </td>

                    {/* รายรับ */}

                    <td className="px-6 py-4 text-right">
                      {Number(transaction.income) > 0 ? (
                        <span className="font-semibold text-green-600">
                          +{Number(transaction.income).toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>

                    {/* รายจ่าย */}

                    <td className="px-6 py-4 text-right">
                      {Number(transaction.expense) > 0 ? (
                        <span className="font-semibold text-red-600">
                          -{Number(transaction.expense).toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>

                    {/* คงเหลือ */}

                    <td className="px-6 py-4 text-right font-semibold">
                      {Number(transaction.balance || 0).toLocaleString()} บาท
                    </td>

                    {/* หมายเหตุ */}

                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                      {transaction.note || "-"}
                    </td>

                    {/* จัดการ */}

                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(transaction)}
                          className="w-9 h-9 flex items-center justify-center rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white transition"
                          title="แก้ไข"
                        >
                          <FaEdit />
                        </button>

                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-500 hover:bg-red-600 text-white transition"
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

      {/* Modal */}

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
