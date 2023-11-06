const { check, validationResult } = require("express-validator");
const localizable = require("../../locales/localizables");

// Middleware di convalida che combina tutte le convalide
const validateDatiComandeField = [
  // LEGGI INCASSI
  check("anno")
    .notEmpty()
    .withMessage(localizable.comandaAnnoNonValido)
    .isString()
    .withMessage(localizable.comandaAnnoNonValido),
  check("sagra")
    .notEmpty()
    .withMessage(localizable.comandaSagraNonValida)
    .isString()
    .withMessage(localizable.comandaSagraNonValida),
];

// Middleware finale per gestire gli errori di convalida
const handleValidationDatiComandeErrors = (req, res, next) => {
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
  validateDatiComandeField,
  handleValidationDatiComandeErrors,
};
