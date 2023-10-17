const express = require("express");

const { getAllMenu } = require("../controllers/menu");

const router = express.Router();

router.post("/", getAllMenu);

module.exports = router;
