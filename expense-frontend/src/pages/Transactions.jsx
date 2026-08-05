import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getTransactions } from "../services/transaction.service";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    const data = await getTransactions();

    setTransactions(data);
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">รายรับ - รายจ่าย</h1>

        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th>วันที่</th>
              <th>รายการ</th>
              <th>รายรับ</th>
              <th>รายจ่าย</th>
              <th>คงเหลือ</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((item) => (
              <tr key={item.id}>
                <td>{item.date}</td>

                <td>{item.category}</td>

                <td className="text-green-600 font-bold">
                  {item.income ? Number(item.income).toLocaleString() : "-"}
                </td>

                <td className="text-red-600 font-bold">
                  {item.expense ? Number(item.expense).toLocaleString() : "-"}
                </td>

                <td className="font-bold">
                  {Number(item.balance).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default Transactions;
