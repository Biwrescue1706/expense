import { useEffect, useState } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import { getTransactions } from "../services/transaction.service";
import TransactionModal from "../components/TransactionModal";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const data = await getTransactions();
      setTransactions(data);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTransactions = transactions.filter((item) =>
    `${item.category} ${item.description || ""}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">รายรับ - รายจ่าย</h1>

          <p className="text-gray-500 mt-1">จัดการรายการรายรับและรายจ่าย</p>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl shadow"
        >
          <FaPlus />
          เพิ่มรายการ
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow p-5">
        <div className="relative max-w-md">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            placeholder="ค้นหารายการ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr className="text-gray-700">
                <th className="px-6 py-4 text-left">วันที่</th>
                <th className="px-6 py-4 text-left">รายการ</th>
                <th className="px-6 py-4 text-right">รายรับ</th>
                <th className="px-6 py-4 text-right">รายจ่าย</th>
                <th className="px-6 py-4 text-right">คงเหลือ</th>
              </tr>
            </thead>

            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((item) => (
                  <tr key={item.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4">{item.date}</td>

                    <td className="px-6 py-4 font-medium">{item.category}</td>

                    <td className="px-6 py-4 text-right text-green-600 font-semibold">
                      {item.income ? Number(item.income).toLocaleString() : "-"}
                    </td>

                    <td className="px-6 py-4 text-right text-red-600 font-semibold">
                      {item.expense
                        ? Number(item.expense).toLocaleString()
                        : "-"}
                    </td>

                    <td className="px-6 py-4 text-right font-bold">
                      {Number(item.balance || 0).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-10 text-center text-gray-400">
                    ยังไม่มีข้อมูล
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <TransactionModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={loadTransactions}
      />
    </div>
  );
}

export default Transactions;
