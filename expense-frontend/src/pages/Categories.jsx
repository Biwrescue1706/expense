import { useEffect, useState } from "react";
import { FaPlus, FaList } from "react-icons/fa";

import { getCategories } from "../services/category.service";
import { getTypes } from "../services/type.service";

function Categories() {
  const [types, setTypes] = useState([]);
  const [typeId, setTypeId] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadTypes();
  }, []);

  const loadTypes = async () => {
    const data = await getTypes();
    setTypes(data);
  };

  const loadCategory = async (id) => {
    const data = await getCategories(id);
    setCategories(data);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            หมวดหมู่
          </h1>

          <p className="text-gray-500 mt-1">
            จัดการหมวดหมู่ของรายรับและรายจ่าย
          </p>
        </div>

        <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl shadow">
          <FaPlus />
          เพิ่มหมวดหมู่
        </button>

      </div>

      {/* Filter */}
      <div className="bg-white rounded-2xl shadow p-6">

        <label className="block font-medium mb-2">
          ประเภท
        </label>

        <select
          value={typeId}
          onChange={(e) => {
            setTypeId(e.target.value);
            loadCategory(e.target.value);
          }}
          className="w-full md:w-80 border rounded-xl p-3 focus:ring-2 focus:ring-green-500 outline-none"
        >
          <option value="">เลือกประเภท</option>

          {types.map((type) => (
            <option
              key={type.id}
              value={type.id}
            >
              {type.typeName}
            </option>
          ))}
        </select>

      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">

        <div className="flex justify-between items-center px-6 py-4 border-b">

          <h2 className="font-semibold flex items-center gap-2">
            <FaList />
            รายการหมวดหมู่
          </h2>

          <span className="text-sm text-gray-500">
            ทั้งหมด {categories.length} รายการ
          </span>

        </div>

        <div className="overflow-x-auto">

          <table className="min-w-full">

            <thead className="bg-gray-100">

              <tr>
                <th className="px-6 py-4 text-left">
                  ID
                </th>

                <th className="px-6 py-4 text-left">
                  ชื่อหมวดหมู่
                </th>
              </tr>

            </thead>

            <tbody>

              {categories.length > 0 ? (
                categories.map((category) => (
                  <tr
                    key={category.id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      {category.id}
                    </td>

                    <td className="px-6 py-4 font-medium">
                      {category.name}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={2}
                    className="py-10 text-center text-gray-400"
                  >
                    ยังไม่มีข้อมูลหมวดหมู่
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Categories;