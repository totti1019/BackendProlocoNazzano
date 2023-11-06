const { check, validationResult } = require("express-validator");
const localizable = require("../../locales/localizables");

// Middleware di convalida che combina tutte le convalide
const validateVecchiaComandaField = [
  // LEGGI VECCCHIA COMANDA
  check("numeroVecchiaComanda")
    .custom((value) => {
      if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) {
        throw new Error(localizable.comandaNumeroVecchiaComandaNonValida);
      }
      return true;
    })
    .notEmpty()
    .withMessage(localizable.comandaNumeroVecchiaComandaNonValida)
    .isInt({ gt: 0 })
    .withMessage(localizable.comandaNumeroVecchiaComandaNonValida),
];

// Middleware finale per gestire gli errori di convalida
const handleValidationVecchiaComandaErrors = (req, res, next) => {
  const result = validationResult(req);
  if (result.errors.length > 0) {
    const lastError = result.errors[result.errors.length - 1];
    let value = lastError.value;
    if (value === undefined) {
      value = "Controlla la chiave";
    } else if (value === "") {
      value = "Campo vuoto";
    }
    return res.status(400).json({
      code: res.statusCode,
      esito: false,
      response: null,
      message: `${lastError.msg}: ${value}`,
    });
  }

  // Se non ci sono errori, chiamare next() per proseguire con la richiesta
  next();
};

module.exports = {
  validateVecchiaComandaField,
  handleValidationVecchiaComandaErrors,
};
