const router = require("express").Router();

const controller = require("../controllers/transaction.controller");

// ดึงรายการทั้งหมด
router.get("/", controller.getTransactions);

// ดึงรายการตาม id
router.get("/:id", controller.getTransaction);

// เพิ่มรายการ
router.post("/", controller.createTransaction);

// แก้ไขรายการ
router.put("/:id", controller.updateTransaction);

// ลบรายการ
router.delete("/:id", controller.deleteTransaction);

module.exports = router;