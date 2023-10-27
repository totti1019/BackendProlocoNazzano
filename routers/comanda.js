const express = require("express");

const {
  updateNumeroComanda,
  saveComanda,
  leggiVecchiaComanda,
  updateVecchiaComanda,
  leggiIncasso,
} = require("../controllers/comanda");

const router = express.Router();

router.post("/", updateNumeroComanda);
router.post("/save", saveComanda);
router.post("/leggiVecchiaComanda", leggiVecchiaComanda);
router.post("/updateVecchiaComanda", updateVecchiaComanda);
router.post("/leggiIncasso", leggiIncasso);

module.exports = router;
