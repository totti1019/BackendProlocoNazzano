const { getAuth, signInWithCustomToken } = require("firebase/auth");

const requireAuthFirebase = async (req, res, next) => {
  try {
    if (req.method !== "POST") {
      return next();
    }

    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return res.status(401).json({
        code: 401,
        esito: false,
        message: "Token di autorizzazione mancante",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        code: 401,
        esito: false,
        message: "Token di autorizzazione mancante",
      });
    }

    const auth = getAuth();

    try {
      await signInWithCustomToken(auth, token);
      return next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({
        code: 401,
        esito: false,
        message: "Token non valido",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: 500,
      esito: false,
      message: "Errore durante l'autenticazione",
    });
  }
};

const validationToken = async (req, res, next) => {
  try {
    if (req.method !== "POST") {
      return next();
    }

    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return res.status(401).json({
        code: 401,
        esito: false,
        message: "Token di autorizzazione mancante",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        code: 401,
        esito: false,
        message: "Token di autorizzazione mancante",
      });
    }

    const auth = getAuth();

    try {
      await signInWithCustomToken(auth, token);
      return res.status(200).json({
        code: 200,
        esito: true,
        message: "Token valido",
      });
    } catch (error) {
      console.error(error);
      return res.status(401).json({
        code: 401,
        esito: false,
        message: "Token non valido",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: 500,
      esito: false,
      message: "Errore durante l'autenticazione",
    });
  }
};

module.exports = {
  requireAuthFirebase,
  validationToken,
};
