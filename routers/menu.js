const express = require("express");

const { getAllMenu, saveMenu, deleteMenu } = require("../controllers/menu");

const router = express.Router();

router.post("/", getAllMenu);
router.post("/save", saveMenu);
router.post("/delete", deleteMenu);

module.exports = router;
