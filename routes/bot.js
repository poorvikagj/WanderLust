const express = require("express");
const router = express.Router();
const botController = require("../controllers/bot")

router.post("/chat", botController.msg);

module.exports = router;