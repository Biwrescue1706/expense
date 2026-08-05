const router = require("express").Router();

const typeController = require("../controllers/type.controller");

router.get("/", typeController.getTypes);

module.exports = router;