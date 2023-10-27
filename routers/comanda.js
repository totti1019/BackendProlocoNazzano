const express = require("express");

const {
  updateNumeroComanda,
  saveComanda,
  leggiVecchiaComanda,
  updateVecchiaComanda,
} = require("../controllers/comanda");

const router = express.Router();

router.post("/", updateNumeroComanda);
router.post("/save", saveComanda);
router.post("/leggiVecchiaComanda", leggiVecchiaComanda);
router.post("/updateVecchiaComanda", updateVecchiaComanda);

module.exports = router;
