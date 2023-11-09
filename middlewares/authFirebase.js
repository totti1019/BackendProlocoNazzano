const {
  firebase,
  admin,
  auth,
} = require("../controllers/utils/config-admin-firebase"); // Importa il modulo di configurazione firebase admin

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
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken;

      const timestampInSeconds = decodedToken.auth_time;
      // Ottenere il timestamp attuale in secondi
      // Creare un oggetto Data utilizzando il timestamp fornito
      var data = new Date(timestampInSeconds * 1000);

      // Ottenere la differenza tra la data attuale e la data fornita in millisecondi
      var differenzaInMillisecondi = Date.now() - data.getTime();

      // Calcolare giorni, ore, minuti e secondi
      var giorni = Math.floor(differenzaInMillisecondi / (1000 * 60 * 60 * 24));
      var ore = Math.floor(
        (differenzaInMillisecondi % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      var minuti = Math.floor(
        (differenzaInMillisecondi % (1000 * 60 * 60)) / (1000 * 60)
      );
      var secondi = Math.floor((differenzaInMillisecondi % (1000 * 60)) / 1000);

      // Stampare la differenza nel formato desiderato
      console.log(
        "Differenza:",
        giorni +
          " giorni, " +
          ore +
          " ore, " +
          minuti +
          " minuti, " +
          secondi +
          " secondi"
      );

      console.log(req.user);
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({
        code: res.statusCode,
        esito: false,
        message: "Token non valido o scaduto",
      });
      {
        /*  if (error.code === "auth/id-token-expired") {
          // Il token è scaduto, gestisci il rinnovo del token o richiedi una nuova autenticazione
          auth.currentUser
            .getIdToken(true)
            .then(function (idToken) {
              console.error("NUOVO TOKEN ", idToken);
              req.token = idToken;
              next();
            })
            .catch(function (error) {
              console.error("Rinnoco Token non riuscito", error);
              res.status(401).json({
                code: res.statusCode,
                esito: false,
                message: "Rinnoco Token non riuscito",
              });
            });
        } else {
          // Altro errore di autenticazione
          res.status(401).json({
            code: res.statusCode,
            esito: false,
            message: "Autenticazione non valida.",
          });
        }*/
      }
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

const requireAuthFirebase2 = async (req, res, next) => {
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
      const idToken = await firebase.auth().currentUser.getIdToken();
      console.log(idToken);
      await signInWithCustomToken(auth, idToken);
      next();
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
