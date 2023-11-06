const { check, validationResult } = require("express-validator");
const localizable = require("../../locales/localizables");

// Middleware di convalida che combina tutte le convalide
const validateComandaField = [
  // SALVA COMANDA
  check("numeroComanda")
    .custom((value) => {
      if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) {
        throw new Error(localizable.comandaNumeroComandaNonValida);
      }
      return true;
    })
    .notEmpty()
    .withMessage(localizable.comandaNumeroComandaNonValida)
    .isInt({ gt: 0 })
    .withMessage(localizable.comandaNumeroComandaNonValida),
  check("comanda")
    .isArray()
    .withMessage(localizable.comandaNonValida)
    .custom((value) => {
      if (!value || value.length === 0) {
        throw new Error(localizable.comandaNonValidaVuota);
      }
      return true;
    }),
  check("pagamento")
    .notEmpty()
    .withMessage(localizable.comandaPagamentoNonValida)
    .isIn(["contanti", "carta"])
    .withMessage(localizable.comandaPagamentoNonValida)
    .isString()
    .withMessage(localizable.comandaPagamentoNonValida),
  check("totaleComanda")
    .notEmpty()
    .withMessage(localizable.comandaTotaleComandaNonValida)
    .isString()
    .withMessage(localizable.comandaTotaleComandaNonValida),
  check("numeroCassa")
    .custom((value) => {
      if (
        !value ||
        typeof value !== "number" ||
        !Number.isInteger(value) ||
        value <= 0
      ) {
        throw new Error(localizable.comandaNumeroCassaNonValida);
      }
      return true;
    })
    .notEmpty()
    .withMessage(localizable.comandaNumeroCassaNonValida)
    .isInt({ gt: 0 })
    .withMessage(localizable.comandaNumeroCassaNonValida),
  check("comanda.*.piatto")
    .notEmpty()
    .withMessage(localizable.comandaPiattoNonValido)
    .isString()
    .withMessage(localizable.comandaPiattoNonValido),
  check("comanda.*.prezzo")
    .notEmpty()
    .withMessage(localizable.comandaPrezzoNonValido)
    .isString()
    .withMessage(localizable.comandaPrezzoNonValido),
  check("comanda.*.quantita")
    .custom((value) => {
      if (
        (!value && value !== 0) ||
        typeof value !== "number" ||
        !Number.isInteger(value)
      ) {
        throw new Error(localizable.comandaQuantitaNonValida);
      }
      return true;
    })
    .notEmpty()
    .withMessage(localizable.comandaQuantitaNonValida)
    .isInt()
    .withMessage(localizable.comandaQuantitaNonValida),
];

// Middleware finale per gestire gli errori di convalida
const handleValidationErrors = (req, res, next) => {
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
  validateComandaField,
  handleValidationErrors,
};
