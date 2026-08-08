import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

import { createTransaction } from "../services/transaction.service";
import { getTypes } from "../services/type.service";
import { getCategories } from "../services/category.service";

import { successAlert, errorAlert } from "../utils/alert";

function TransactionModal({ open, onClose, onSuccess }) {
  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    typeId: "",
    categoryId: "",
    amount: "",
    note: "",
  });

  useEffect(() => {
    if (open) {
      loadTypes();
    }
  }, [open]);

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

      setTypes(data);
    } catch (err) {
      console.error(err);

      errorAlert(err.response?.data?.message || "ไม่สามารถโหลดประเภทได้");
    }
  };

  const loadCategories = async (typeId) => {
    try {
      const data = await getCategories(typeId);

      setCategories(data);
    } catch (err) {
      console.error(err);

      setCategories([]);

      errorAlert(err.response?.data?.message || "ไม่สามารถโหลดหมวดหมู่ได้");
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

  const resetForm = () => {
    setForm({
      date: new Date().toISOString().slice(0, 10),
      typeId: "",
      categoryId: "",
      amount: "",
      note: "",
    });

    setCategories([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
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

      if (!form.amount) {
        errorAlert("กรุณากรอกจำนวนเงิน");
        return;
      }

      await createTransaction({
        date: form.date,
        typeId: form.typeId,
        categoryId: form.categoryId,
        amount: Number(form.amount),
        note: form.note,
      });

      successAlert("บันทึกรายการสำเร็จ");

      resetForm();

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);

      errorAlert(err.response?.data?.message || "บันทึกรายการไม่สำเร็จ");
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between border-b p-5">
          <h2 className="text-xl font-bold">เพิ่มรายการ</h2>

          <button
            type="button"
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block mb-1 font-medium">วันที่</label>

            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">ประเภท</label>

            <select
              name="typeId"
              value={form.typeId}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            >
              <option value="">เลือกประเภท</option>

              {types.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">หมวดหมู่</label>

            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              disabled={!form.typeId}
              className="w-full border rounded-lg p-3 disabled:bg-gray-100"
            >
              <option value="">
                {form.typeId ? "เลือกหมวดหมู่" : "กรุณาเลือกประเภทก่อน"}
              </option>

              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">จำนวนเงิน</label>

            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="0.00"
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">หมายเหตุ</label>

            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="border rounded-lg px-5 py-2"
            >
              ยกเลิก
            </button>

            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-5 py-2"
            >
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TransactionModal;
