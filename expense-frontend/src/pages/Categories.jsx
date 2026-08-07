import { useEffect, useState } from "react";
import {
  FaPlus,
  FaList,
  FaEdit,
  FaTrash,
  FaTimes,
} from "react-icons/fa";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/category.service";

import { getTypes } from "../services/type.service";

function Categories() {
  const [types, setTypes] = useState([]);
  const [typeId, setTypeId] = useState("");
  const [categories, setCategories] = useState([]);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    typeId: "",
    name: "",
  });

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

  const loadCategories = async (id) => {
    try {
      const data = await getCategories(id);
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    try {
      if (!form.typeId || !form.name) {
        return alert("กรุณากรอกข้อมูลให้ครบ");
      }

      if (editing) {
        await updateCategory(editing.id, form);
      } else {
        await createCategory(form);
      }

      setOpen(false);

      setForm({
        typeId: "",
        name: "",
      });

      loadCategories(typeId);

    } catch (err) {
      alert(err.response?.data?.message || "เกิดข้อผิดพลาด");
    }
  };

  const handleEdit = (item) => {
    setEditing(item);

    setForm({
      typeId: item.typeId,
      name: item.name,
    });

    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("ต้องการลบหมวดหมู่นี้หรือไม่ ?")) return;

    try {
      await deleteCategory(id);
      loadCategories(typeId);
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold">
            หมวดหมู่
          </h1>

          <p className="text-gray-500">
            จัดการหมวดหมู่รายรับและรายจ่าย
          </p>

        </div>

        <button
          onClick={() => {
            setEditing(null);

            setForm({
              typeId,
              name: "",
            });

            setOpen(true);
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl flex gap-2 items-center"
        >
          <FaPlus />
          เพิ่มหมวดหมู่
        </button>

      </div>

      <div className="bg-white rounded-2xl shadow p-6">

        <label className="font-medium block mb-2">
          ประเภท
        </label>

        <select
          value={typeId}
          onChange={(e) => {
            setTypeId(e.target.value);
            loadCategories(e.target.value);
          }}
          className="w-full md:w-80 border rounded-xl p-3"
        >
          <option value="">
            เลือกประเภท
          </option>

          {types.map((item) => (
            <option
              key={item.id}
              value={item.id}
            >
              {item.name}
            </option>
          ))}

        </select>

      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">

        <div className="flex justify-between items-center px-6 py-4 border-b">

          <h2 className="flex items-center gap-2 font-semibold">

            <FaList />

            รายการหมวดหมู่

          </h2>

          <span>

            {categories.length} รายการ

          </span>

        </div>

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="text-left px-6 py-4">
                ชื่อหมวดหมู่
              </th>

              <th className="text-center px-6 py-4 w-40">
                จัดการ
              </th>

            </tr>

          </thead>

          <tbody>

            {categories.length > 0 ? (

              categories.map((item) => (

                <tr
                  key={item.id}
                  className="border-t"
                >

                  <td className="px-6 py-4">

                    {item.name}

                  </td>

                  <td>

                    <div className="flex justify-center gap-5">

                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600"
                      >
                        <FaEdit />
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600"
                      >
                        <FaTrash />
                      </button>

                    </div>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan={2}
                  className="text-center py-10 text-gray-400"
                >
                  ยังไม่มีข้อมูลหมวดหมู่
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

                {editing ? "แก้ไขหมวดหมู่" : "เพิ่มหมวดหมู่"}

              </h2>

              <button
                onClick={() => setOpen(false)}
              >
                <FaTimes />
              </button>

            </div>

            <div className="p-6 space-y-4">

              <div>

                <label className="block mb-2">

                  ประเภท

                </label>

                <select
                  value={form.typeId}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      typeId: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg p-3"
                >

                  <option value="">
                    เลือกประเภท
                  </option>

                  {types.map((item) => (

                    <option
                      key={item.id}
                      value={item.id}
                    >
                      {item.name}
                    </option>

                  ))}

                </select>

              </div>

              <div>

                <label className="block mb-2">

                  ชื่อหมวดหมู่

                </label>

                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg p-3"
                />

              </div>

              <div className="flex justify-end gap-3 pt-4">

                <button
                  onClick={() => setOpen(false)}
                  className="border rounded-lg px-5 py-2"
                >
                  ยกเลิก
                </button>

                <button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-5 py-2"
                >
                  บันทึก
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Categories;