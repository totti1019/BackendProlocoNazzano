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
  validateComandaField,
  handleValidationErrors,
} = require("../middlewares/comanda/validateComandaFields");

const {
  validateVecchiaComandaField,
  handleValidationVecchiaComandaErrors,
} = require("../middlewares/comanda/validateVecchiaComandaFields");

const {
  validateIncassoComandeField,
  handleValidationIncassoComandeErrors,
} = require("../middlewares/comanda/validateIncassoComandeFields");

const {
  validateDatiComandeField,
  handleValidationDatiComandeErrors,
} = require("../middlewares/comanda/validateDatiComandeFields");

const router = express.Router();

router.post("/", updateNumeroComanda);
router.post(
  "/save",
  [validateComandaField, handleValidationErrors],
  saveComanda
);
router.post(
  "/leggiVecchiaComanda",
  [validateVecchiaComandaField, handleValidationVecchiaComandaErrors],
  leggiVecchiaComanda
);
router.post(
  "/updateVecchiaComanda",
  [validateComandaField, handleValidationErrors],
  updateVecchiaComanda
);
router.post(
  "/leggiIncasso",
  [validateIncassoComandeField, handleValidationIncassoComandeErrors],
  leggiIncasso
);
router.post(
  "/leggiDati",
  [validateDatiComandeField, handleValidationDatiComandeErrors],
  leggiDati
);

module.exports = router;
