const express = require("express");

const {
  updateNumeroComanda,
  saveComanda,
  leggiVecchiaComanda,
} = require("../controllers/comanda");

const router = express.Router();

router.post("/", updateNumeroComanda);
router.post("/save", saveComanda);
router.post("/leggiVecchiaComanda", leggiVecchiaComanda);

module.exports = router;
