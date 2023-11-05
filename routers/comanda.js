const express = require("express");

const {
  updateNumeroComanda,
  saveComanda,
  leggiVecchiaComanda,
  updateVecchiaComanda,
  leggiIncasso,
  leggiDati,
} = require("../controllers/comanda");

const {
  validateAllComanda,
  handleValidationErrors,
} = require("../middlewares/validateComandaFields");

const router = express.Router();

router.post("/", updateNumeroComanda);
router.post("/save", [validateAllComanda, handleValidationErrors], saveComanda);
router.post("/leggiVecchiaComanda", leggiVecchiaComanda);
router.post("/updateVecchiaComanda", updateVecchiaComanda);
router.post("/leggiIncasso", leggiIncasso);
router.post("/leggiDati", leggiDati);

module.exports = router;
