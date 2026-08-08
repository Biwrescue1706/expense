import { useEffect, useState } from "react";
import { FaPlus, FaTags, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { successAlert, errorAlert, confirmDelete } from "../utils/alert";

import {
  getTypes,
  createType,
  updateType,
  deleteType,
} from "../services/type.service";

function Types() {
  const [types, setTypes] = useState([]);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [name, setName] = useState("");

  useEffect(() => {
    loadTypes();
  }, []);

  const loadTypes = async () => {
    try {
      const data = await getTypes();
      setTypes(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = () => {
    setEditing(null);
    setName("");
    setOpen(true);
  };

  const handleEdit = (item) => {
    setEditing(item);
    setName(item.name);
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      if (!name.trim()) {
        return errorAlert("กรุณากรอกชื่อประเภท");
      }

      if (editing) {
        const result = await updateType(editing.id, {
          name: name.trim(),
        });

        setOpen(false);
        await loadTypes();

        successAlert(result?.message || "แก้ไขประเภทสำเร็จ");
      } else {
        const result = await createType({
          name: name.trim(),
        });

        setOpen(false);
        await loadTypes();

        successAlert(result?.message || "เพิ่มประเภทสำเร็จ");
      }
    } catch (err) {
      errorAlert(
        err.response?.data?.message || err.message || "เกิดข้อผิดพลาด",
      );
    }
  };

  const handleDelete = async (id) => {
    const result = await confirmDelete();

    if (!result.isConfirmed) {
      return;
    }

    try {
      const response = await deleteType(id);

      await loadTypes();

      successAlert(response?.message || "ลบประเภทสำเร็จ");
    } catch (err) {
      errorAlert(
        err.response?.data?.message || err.message || "เกิดข้อผิดพลาด",
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">ประเภท</h1>

          <p className="text-gray-500">จัดการประเภทของรายการ</p>
        </div>

        <button
          onClick={handleAdd}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl flex items-center gap-2"
        >
          <FaPlus />
          เพิ่มประเภท
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="flex items-center gap-2 font-semibold">
            <FaTags className="text-green-600" />
            รายการประเภท
          </h2>

          <span>{types.length} รายการ</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-6 py-4">ประเภท</th>

                <th className="text-center px-6 py-4 w-40">แก้ไข</th>
                <th className="text-center px-6 py-4 w-40"> ลบ</th>
              </tr>
            </thead>

            <tbody>
              {types.length > 0 ? (
                types.map((item) => (
                  <tr key={item.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          item.name === "รายรับ"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {item.name}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="w-9 h-9 flex items-center justify-center rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white transition"
                          title="แก้ไข"
                        >
                          <FaEdit />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-500 hover:bg-red-600 text-white transition"
                          title="ลบ"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="text-center py-10 text-gray-400">
                    ยังไม่มีข้อมูล
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {open && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl w-full max-w-md">
              <div className="flex justify-between items-center border-b p-5">
                <h2 className="text-xl font-bold">
                  {editing ? "แก้ไขประเภท" : "เพิ่มประเภท"}
                </h2>

                <button onClick={() => setOpen(false)}>
                  <FaTimes />
                </button>
              </div>

              <div className="p-6">
                <label className="block mb-2 font-medium">ชื่อประเภท</label>

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border rounded-lg p-3"
                  placeholder="เช่น รายรับ"
                />

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setOpen(false)}
                    className="border px-5 py-2 rounded-lg"
                  >
                    ยกเลิก
                  </button>

                  <button
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
                  >
                    บันทึก
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Types;
