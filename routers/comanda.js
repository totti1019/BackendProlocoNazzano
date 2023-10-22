const express = require("express");

const {
  getNumeroComanda,
  saveComanda,
  deleteMenu,
} = require("../controllers/comanda");

const router = express.Router();

router.post("/", getNumeroComanda);
router.post("/save", saveComanda);
router.post("/delete", deleteMenu);

module.exports = router;
