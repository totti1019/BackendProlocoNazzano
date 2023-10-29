const { getAuth, signInWithCustomToken } = require("firebase/auth");

// Middleware per verificare l'autenticazione prima di consentire una chiamata API
const requireAuthFirebase = async (req, res, next) => {
  try {
    if (req.method !== "POST") {
      return next();
    }

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        code: res.statusCode,
        esito: false,
        message: "Token di autorizzazione mancante",
      });
    }

    const auth = getAuth();

    const user = await signInWithCustomToken(auth, token);

    if (user) {
      return next();
    } else {
      return res.status(401).json({
        code: res.statusCode,
        esito: false,
        message: "Utente non autenticato",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: res.statusCode,
      esito: false,
      message: "Errore durante l'autenticazione",
    });
  }
};

module.exports = {
  requireAuthFirebase,
};
