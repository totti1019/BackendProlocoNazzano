const express = require("express");

const {
  getNumeroComanda,
  readSaveNumeroComanda,
  deleteMenu,
} = require("../controllers/comanda");

const router = express.Router();

router.post("/", getNumeroComanda);
router.post("/readSaveNumero", readSaveNumeroComanda);
router.post("/delete", deleteMenu);

module.exports = router;
