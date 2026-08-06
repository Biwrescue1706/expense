import { useEffect, useState } from "react";
import { FaPlus, FaTags } from "react-icons/fa";
import { getTypes } from "../services/type.service";

function Types() {
  const [types, setTypes] = useState([]);

  useEffect(() => {
    loadTypes();
  }, []);

  const loadTypes = async () => {
    const data = await getTypes();
    setTypes(data);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            ประเภท
          </h1>

          <p className="text-gray-500 mt-1">
            จัดการประเภทของรายการรายรับและรายจ่าย
          </p>
        </div>

        <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl shadow transition">
          <FaPlus />
          เพิ่มประเภท
        </button>

      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">

        <div className="flex justify-between items-center px-6 py-4 border-b">

          <h2 className="flex items-center gap-2 font-semibold text-gray-700">
            <FaTags className="text-green-600" />
            รายการประเภท
          </h2>

          <span className="text-sm text-gray-500">
            ทั้งหมด {types.length} รายการ
          </span>

        </div>

        <div className="overflow-x-auto">

          <table className="min-w-full">

            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left">ID</th>
                <th className="px-6 py-4 text-left">ประเภท</th>
              </tr>
            </thead>

            <tbody>

              {types.length > 0 ? (
                types.map((type) => (
                  <tr
                    key={type.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4">
                      {type.id}
                    </td>

                    <td className="px-6 py-4">

                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                          type.name === "รายรับ"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {type.name}
                      </span>

                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={2}
                    className="py-10 text-center text-gray-400"
                  >
                    ยังไม่มีข้อมูลประเภท
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

export default Types;