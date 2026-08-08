import { useEffect, useState } from "react";
import { FaPlus, FaUsers, FaSearch, FaEdit, FaTrash } from "react-icons/fa";

import Swal from "sweetalert2";

import RegisterModal from "../components/RegisterModal";

import { getUsers, deleteUser } from "../services/user.service";

function Register() {
  const [users, setUsers] = useState([]);
  const [keyword, setKeyword] = useState("");

  const [openModal, setOpenModal] = useState(false);

  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getUsers();

      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = () => {
    setEditUser(null);

    setOpenModal(true);
  };

  const handleEdit = (user) => {
    setEditUser(user);

    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "ยืนยันการลบ",

      text: "ต้องการลบสมาชิกนี้ใช่หรือไม่",

      icon: "warning",

      showCancelButton: true,

      confirmButtonText: "ลบ",

      cancelButtonText: "ยกเลิก",

      confirmButtonColor: "#dc2626",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteUser(id);

      Swal.fire({
        icon: "success",

        title: "ลบสำเร็จ",

        timer: 1500,

        showConfirmButton: false,
      });

      loadUsers();
    } catch (err) {
      Swal.fire({
        icon: "error",

        title: "ผิดพลาด",

        text: err.response?.data?.message,
      });
    }
  };

  const filteredUsers = users.filter((user) => {
    const key = keyword.toLowerCase();

    return (
      user.fullName?.toLowerCase().includes(key) ||
      user.username?.toLowerCase().includes(key) ||
      user.email?.toLowerCase().includes(key)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">สมาชิกทั้งหมด</h1>

          <p className="text-gray-500 mt-1">จัดการสมาชิกของระบบ</p>
        </div>

        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl shadow"
        >
          <FaPlus />
          เพิ่มสมาชิก
        </button>
      </div>

      {/* Search */}

      <div className="bg-white rounded-2xl shadow p-5">
        <div className="relative max-w-md">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="ค้นหาสมาชิก..."
            className="w-full border rounded-xl py-3 pl-11 pr-4"
          />
        </div>
      </div>

      {/* Table */}

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="flex items-center gap-2 font-semibold">
            <FaUsers />
            รายชื่อสมาชิก
          </h2>

          <span className="text-sm text-gray-500">
            ทั้งหมด {filteredUsers.length} คน
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left">ชื่อ</th>

                <th className="px-6 py-4 text-left">Username</th>

                <th className="px-6 py-4 text-left">Email</th>

                <th className="px-6 py-4 text-center">สิทธิ์</th>

                <th className="px-6 py-4 text-center">จัดการ</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4">{user.fullName}</td>

                    <td className="px-6 py-4">{user.username}</td>

                    <td className="px-6 py-4">{user.email}</td>

                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-lg"
                        >
                          <FaEdit />
                        </button>

                        <button
                          onClick={() => handleDelete(user.id)}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-10 text-center text-gray-400">
                    ยังไม่มีสมาชิก
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal */}
      <RegisterModal
        open={openModal}
        editUser={editUser}
        onClose={() => {
          setOpenModal(false);
          setEditUser(null);
        }}
        onSuccess={() => {
          loadUsers();

          Swal.fire({
            icon: "success",
            title: editUser ? "แก้ไขสมาชิกสำเร็จ" : "เพิ่มสมาชิกสำเร็จ",
            timer: 1500,
            showConfirmButton: false,
          });
        }}
      />
    </div>
  );
}

export default Register;
