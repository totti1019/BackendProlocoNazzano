const { check, validationResult } = require("express-validator");
const localizable = require("../locales/localizables");

const validateFields = async (req, res, next) => {
  // Definisci le regole di convalida per ciascun campo come oggetto
  const validationRules = {
    email: check("email")
      .notEmpty()
      .escape()
      .isEmail()
      .withMessage(localizable.emailNonValida),
    password: check("password")
      .isString()
      .withMessage(localizable.passwordNonValida)
      .isLength({ min: 8 })
      .withMessage(localizable.passwordMinCaratteri)
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
      )
      .withMessage(localizable.passwordCaratteriSpeciali),
    fullName: check("fullName")
      .notEmpty()
      .escape()
      .withMessage(localizable.nominativoMancante)
      .isString()
      .withMessage(localizable.nominativoNonValido),
    id: check("id")
      .notEmpty()
      .withMessage(localizable.passwordNonValida)
      .isString()
      .withMessage(localizable.passwordNonValida),
    uid: check("uid").isString().withMessage(localizable.uidNonValido),
    // Aggiungi altre regole di convalida per gli altri campi
  };

  // Esegui la convalida solo per i campi presenti nei dati
  for (const field in validationRules) {
    if (req.body[field] !== undefined) {
      await validationRules[field].run(req);
    }
  }

  // Verifica gli errori di convalida
  const result = validationResult(req);
  if (result && result.errors.length > 0) {
    const primoErrore = result.errors[0];
    return res.status(400).json({
      code: res.statusCode,
      esito: false,
      message: primoErrore.msg,
    });
  }

  next();
};

module.exports = validateFields;
