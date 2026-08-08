const router = require("express").Router();

const transactionController = require("../controllers/transaction.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get(
    "/",
    authMiddleware,
    transactionController.getTransactions
);

router.post(
    "/",
    authMiddleware,
    transactionController.createTransaction
);

router.put(
    "/:id",
    authMiddleware,
    transactionController.updateTransaction
);

router.delete(
    "/:id",
    authMiddleware,
    transactionController.deleteTransaction
);

module.exports = router;