const { getAuth, signInWithCustomToken } = require("firebase/auth");
const { auth } = require("firebase-admin"); // Assicurati di importare la libreria Firebase Admin

// Questo controlla se i ltoken è ancora valido o no se è valido procede con la chiamata successiva
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

    try {
      const decodedToken = await verifyFirebaseToken(token);

      if (decodedToken) {
        // Il token è valido e non è scaduto
        return next();
      } else {
        // Il token non è valido o è scaduto
        console.log("Token non valido o scaduto");
        return res.status(401).json({
          code: 401,
          esito: false,
          message: "Token non valido o scaduto",
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(401).json({
        code: 401,
        esito: false,
        message: "Token non valido o scaduto",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: 500,
      esito: false,
      message: "Token non valido o scaduto",
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

const verifyFirebaseToken = async (token) => {
  try {
    const decodedToken = await auth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    // Se la verifica del token fallisce, il token non è valido o è scaduto
    return null;
  }
};

module.exports = {
  requireAuthFirebase,
  validationToken,
};
