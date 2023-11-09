const localizable = require("../locales/localizables");

const utils = require("./utils/utils");

const { check, validationResult } = require("express-validator");

const {
  getAuth,
  signInAnonymously,
  signInWithEmailAndPassword,
} = require("firebase/auth");

const {
  appFirebase,
  admin,
  auth,
} = require("../controllers/utils/config-admin-firebase"); // Importa il modulo di configurazione firebase admin

// Autenticazione anonima
const loginAnonymous = async (req, res) => {
  try {
    const { uid } = req.body;
    // Precarico i dati nel percorso
    const loadedSharedData = await utils.loadSharedData();

    if (!loadedSharedData) {
      console.log("Impossibile caricare i dati.");
      throw new Error("Impossibile caricare i dati.");
    }

    if (!uid) {
      const auth = getAuth();
      const userCredential = await signInAnonymously(auth);
      const user = userCredential.user;

      if (!user) {
        return res.status(400).json({
          code: 400,
          esito: false,
          message: "Utente non autenticato",
        });
      }

      const customToken = await adminFirebase
        .auth()
        .createCustomToken(user.uid);

      const oggetto = {
        uid: user.uid,
        token: customToken,
      };

      return res.status(200).json({
        code: res.statusCode,
        esito: true,
        response: oggetto,
        message: "Token creato con successo",
      });
    } else {
      const customToken = await adminFirebase.auth().createCustomToken(uid);

      const oggetto = {
        uid: uid,
        token: customToken,
      };

      return res.status(200).json({
        code: res.statusCode,
        esito: true,
        response: oggetto,
        message: "Token creato con successo",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: res.statusCode,
      esito: false,
      message: error.message || "Errore sconosciuto",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
      .then((data) => {
        data.user
          .getIdToken()
          .then((token) => {
            return res.status(201).json({ token });
          })
          .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
          });
      })
      /* .then(function () {
        admin
          .auth()
          .currentUser.getIdToken(true)
          .then(function (idToken) {
            res.send(idToken);
            res.end();
          })
          .catch(function (error) {
            console.error(error);
            return res.status(500).json({
              code: res.statusCode,
              esito: false,
              message: "Credenziali errate",
            });
          });
      }) */
      .catch(function (error) {
        console.error(error);
        return res.status(500).json({
          code: res.statusCode,
          esito: false,
          message: "Credenziali errate",
        });
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: res.statusCode,
      esito: false,
      message: "Credenziali errate",
    });
  }
};

// METODO PER IL LOGIN CON EMAIL E PASSWORD
const login2 = async (req, res) => {
  try {
    const { email, password } = req.body;

    const auth = getAuth();

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const oneDayFromNow = Math.floor(Date.now() / 1000) + 24 * 60 * 60; // Scadenza tra 24 ore
    const additionalClaims = {
      expires: oneDayFromNow, // Aggiungi il claim "expires" con l'orario di scadenza
      //premiumAccount: true,
    };

    /*
    
    {
  "rules": {
    "premiumContent": {
      ".read": "auth.token.premiumAccount === true"
    }
  }
}
    */

    const customToken = await adminFirebase
      .auth()
      .createCustomToken(user.uid, additionalClaims);

    // Ottenere il token ID
    //const idToken = await user.getIdToken(true);

    const oggetto = {
      uid: user.uid,
      token: customToken,
    };

    return res.status(200).json({
      code: res.statusCode,
      esito: true,
      response: oggetto,
      message: "Login effettuato con successo",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: res.statusCode,
      esito: false,
      message: "Credenziali errate",
    });
  }
};

module.exports = {
  login,
  loginAnonymous,
};
