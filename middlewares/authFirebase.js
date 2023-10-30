const { verifyIdToken } = require("firebase/auth");

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

    try {
      const decodedToken = await verifyIdToken(auth, token);
      // Il token è valido, e decodedToken contiene le informazioni sull'utente autenticato
      return next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({
        code: res.statusCode,
        esito: false,
        message: "Token non valido o scaduto",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: res.statusCode,
      esito: false,
      message: "Errore durante l'autenticazione",
    });
  }
};

module.exports = {
  requireAuthFirebase,
};
