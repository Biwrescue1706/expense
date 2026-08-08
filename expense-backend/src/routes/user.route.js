const router = require("express").Router();

const userController = require("../controllers/user.controller");
const auth = require("../middlewares/auth.middleware");

// GET ALL
router.get("/", auth, userController.getUsers);

// GET ONE
router.get("/:id", auth, userController.getUser);

// CREATE
router.post("/", auth, userController.createUser);

// UPDATE
router.patch("/:id", auth, userController.updateUser);

// DELETE
router.delete("/:id", auth, userController.deleteUser);

module.exports = router;