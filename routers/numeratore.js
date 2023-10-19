const express = require("express");

const {
  getNumber,
  saveNumber,
  deleteNumber,
} = require("../controllers/numeratore");

const router = express.Router();

router.post("/", getNumber);
router.post("/save", saveNumber);
router.post("/delete", deleteNumber);

module.exports = router;
