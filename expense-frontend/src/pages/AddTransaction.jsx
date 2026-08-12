import { useEffect, useState } from "react";
import { FaArrowUp, FaArrowDown, FaCalendarAlt, FaSave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { createTransaction } from "../services/transaction.service";
import { getTypes } from "../services/type.service";
import { getCategories } from "../services/category.service";
import { successAlert, errorAlert } from "../utils/alert";

function AddTransaction() {
  const navigate = useNavigate();

  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    typeId: "",
    categoryId: "",
    amount: "",
    note: "",
  });

  useEffect(() => {
    loadTypes();
  }, []);

  useEffect(() => {
    if (form.typeId) {
      loadCategories(form.typeId);
    } else {
      setCategories([]);
    }
  }, [form.typeId]);

  const loadTypes = async () => {
    try {
      const data = await getTypes();
      setTypes(data || []);
    } catch (err) {
      console.error(err);
      errorAlert(
        err.response?.data?.message || "ไม่สามารถโหลดประเภทได้"
      );
    }
  };

  const loadCategories = async (typeId) => {
    try {
      const data = await getCategories(typeId);
      setCategories(data || []);
    } catch (err) {
      console.error(err);
      setCategories([]);
      errorAlert(
        err.response?.data?.message || "ไม่สามารถโหลดหมวดหมู่ได้"
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "typeId") {
      setForm((prev) => ({
        ...prev,
        typeId: value,
        categoryId: "",
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.date) {
      errorAlert("กรุณาเลือกวันที่");
      return;
    }

    if (!form.typeId) {
      errorAlert("กรุณาเลือกประเภท");
      return;
    }

    if (!form.categoryId) {
      errorAlert("กรุณาเลือกหมวดหมู่");
      return;
    }

    if (!form.amount || Number(form.amount) <= 0) {
      errorAlert("กรุณากรอกจำนวนเงิน");
      return;
    }

    try {
      setLoading(true);

      await createTransaction({
        date: form.date,
        typeId: form.typeId,
        categoryId: form.categoryId,
        amount: Number(form.amount),
        note: form.note,
      });

      successAlert("บันทึกรายการสำเร็จ");

      navigate("/transactions");
    } catch (err) {
      console.error(err);
      errorAlert(
        err.response?.data?.message || "บันทึกรายการไม่สำเร็จ"
      );
    } finally {
      setLoading(false);
    }
  };

  const selectedType = types.find(
    (item) => String(item.id) === String(form.typeId)
  );

  const isIncome =
    selectedType?.name === "รายรับ" ||
    selectedType?.name?.toLowerCase() === "income";

  const isExpense =
    selectedType?.name === "รายจ่าย" ||
    selectedType?.name?.toLowerCase() === "expense";

  return (
    <div className="min-h-full bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-gray-800">
            เพิ่มรายการ
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            บันทึกรายรับหรือรายจ่ายของคุณ
          </p>
        </div>

        <div className="rounded-2xl bg-white shadow-sm">
          <form onSubmit={handleSubmit}>
            <div className="border-b px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600">
                  <FaSave />
                </div>

                <div>
                  <h2 className="font-bold text-gray-800">
                    รายละเอียดรายการ
                  </h2>
                  <p className="text-xs text-gray-500">
                    กรอกข้อมูลรายการให้ครบถ้วน
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  ประเภท
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {types.map((item) => {
                    const income =
                      item.name === "รายรับ" ||
                      item.name?.toLowerCase() === "income";

                    const expense =
                      item.name === "รายจ่าย" ||
                      item.name?.toLowerCase() === "expense";

                    const selected =
                      String(form.typeId) === String(item.id);

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                          handleChange({
                            target: {
                              name: "typeId",
                              value: String(item.id),
                            },
                          })
                        }
                        className={`flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 font-semibold transition ${
                          selected
                            ? income
                              ? "border-green-500 bg-green-50 text-green-600"
                              : expense
                              ? "border-red-500 bg-red-50 text-red-600"
                              : "border-green-500 bg-green-50 text-green-600"
                            : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                        }`}
                      >
                        {income ? (
                          <FaArrowUp />
                        ) : expense ? (
                          <FaArrowDown />
                        ) : null}
                        {item.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  หมวดหมู่
                </label>

                <select
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  disabled={!form.typeId}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <option value="">
                    {form.typeId
                      ? "เลือกหมวดหมู่"
                      : "กรุณาเลือกประเภทก่อน"}
                  </option>

                  {categories.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  จำนวนเงิน
                </label>

                <div className="relative">
                  <input
                    type="number"
                    name="amount"
                    value={form.amount}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className={`w-full rounded-xl border bg-white px-4 py-3 pr-14 text-lg font-semibold outline-none transition focus:ring-2 ${
                      isIncome
                        ? "border-gray-300 focus:border-green-500 focus:ring-green-500/20"
                        : isExpense
                        ? "border-gray-300 focus:border-red-500 focus:ring-red-500/20"
                        : "border-gray-300 focus:border-green-500 focus:ring-green-500/20"
                    }`}
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    บาท
                  </span>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  วันที่
                </label>

                <div className="relative">
                  <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 bg-white px-11 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  รายละเอียด
                </label>

                <textarea
                  name="note"
                  value={form.note}
                  onChange={handleChange}
                  rows={4}
                  placeholder="เช่น ซื้ออาหารกลางวัน, เงินเดือน, ค่าเดินทาง"
                  className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                />
              </div>
            </div>

            <div className="border-t bg-gray-50 px-5 py-4 sm:px-6">
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3.5 font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FaSave />
                {loading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
              </button>

              <p className="mt-3 text-center text-xs text-gray-400">
                กรอกข้อมูลให้ครบก่อนกดบันทึก
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddTransaction;