const localizable = require("../locales/localizables");

const utils = require("./utils/utils");

const { check, validationResult } = require("express-validator");

const { getAuth, signInAnonymously, getIdToken } = require("firebase/auth");

const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client();

require("dotenv").config();

const {
  adminFirebase,
  appFirebase,
} = require("../controllers/utils/config-admin-firebase"); // Importa il modulo di configurazione firebase admin

// METODO PER IL LOGIN DI GOOGLE
const loginGoogle = async (req, res) => {
  // Esegui la convalida
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ code: res.statusCode, message: errors.array() });
  }

  const { email, id, fullName } = req.body;

  verifyGoogleToken(req, res, email, id, fullName);
};

async function verifyGoogleToken(req, res, email, id, fullName) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: id,
      audience: process.env.CLIENT_ID_GOOGLE,
    });
    const payload = ticket.getPayload();
    const userid = payload["sub"];

    const user = await User.findOne({ email });
    if (!user) {
      const passwordHashed = await bcrypt.hash(userid, 10);

      const user = new User({
        fullName: fullName,
        email: email,
        id: passwordHashed,
      });
      await user.save();

      if (await bcrypt.compare(userid, user.id)) {
        const token = jwt.sign(
          { id: user._id, username: user.email },
          process.env.JWT_SECRET
        );
        return res.status(200).json({ code: res.statusCode, jwt: token });
      }
    }
    if (await bcrypt.compare(userid, user.id)) {
      const token = jwt.sign(
        { id: user._id, username: user.email },
        process.env.JWT_SECRET
      );
      return res.status(200).json({ code: res.statusCode, jwt: token });
    }
  } catch (error) {
    return res
      .status(409)
      .json({ code: res.statusCode, message: error.message });
  }
}

// Autenticazione anonima
const loginAnonymous = async (req, res) => {
  const { uid } = req.body;

  try {
    // Caricamento dei dati dalle shared
    const loadedSharedData = await utils.loadSharedData();
    if (loadedSharedData) {
      console.log("Precarico il percorso");
    } else {
      console.log("Impossibile caricare i dati.");
      throw new Error("Impossibile caricare i dati.");
    }

    const auth = getAuth();
    if (uid === undefined || uid === "") {
      // E' la prima volta che mi registro quindi creo l'account anonimo in firebase
      await signInAnonymously(auth)
        .then((userCredential) => {
          const user = userCredential.user;
          if (user) {
            getIdToken(user)
              .then((idToken) => {
                // Creo l'oggetto con uid e token
                const oggetto = {
                  uid: user.uid,
                  token: idToken,
                };
                res.status(200).json({
                  code: res.statusCode,
                  esito: true,
                  response: oggetto,
                  message: "Token creato con successo",
                });
              })
              .catch((error) => {
                res.status(400).json({
                  code: res.statusCode,
                  esito: false,
                  message: error.message || "Errore sconosciuto",
                });
              });
          } else {
            // L'utente non è autenticato, gestisci di conseguenza
          }
        })
        .catch((error) => {
          res.status(400).json({
            code: res.statusCode,
            esito: false,
            message: error.message || "Errore sconosciuto",
          });
        });
    } else {
      // Ho già UID quindi sono già registrato in firebase
      adminFirebase
        .auth()
        .createCustomToken(uid)
        .then((customToken) => {
          // Creo l'oggetto con uid e token
          const oggetto = {
            uid: uid,
            token: customToken,
          };
          res.status(200).json({
            code: res.statusCode,
            esito: true,
            response: oggetto,
            message: "Token creato con successo",
          });
        })
        .catch((error) => {
          res.status(500).json({
            code: res.statusCode,
            esito: false,
            response: null,
            message: "Errore durante la creazione del token personalizzato",
          });
        });
    }
  } catch (error) {
    res.status(400).json({
      code: res.statusCode,
      esito: false,
      message: error.message || "Errore sconosciuto",
    });
  }
};

// METODO PER IL LOGIN CON EMAIL E PASSWORD
const login = async (req, res) => {
  // Esegui la convalida
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ code: res.statusCode, message: errors.array() });
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      code: res.statusCode,
      message: localizable.utenteNonRegistrato,
    });
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign(
      { id: user._id, username: user.email },
      process.env.JWT_SECRET
    );
    return res.status(200).json({ code: res.statusCode, jwt: token });
  }
  return res.status(404).json({
    code: res.statusCode,
    message: localizable.emailPasswordErrata,
  });
};

// METODO PER LA REGISTRAZIONE
const register = async (req, res) => {
  // Esegui la convalida
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ code: res.statusCode, message: errors.array() });
  }

  const { email, password, fullName } = req.body;

  const userFind = await User.findOne({ email });

  // Se trovo già l'utente salvato invio messaggio
  if (userFind) {
    return res.status(409).json({
      code: res.statusCode,
      message: localizable.utenteRegistratoEffettuaLogin,
    });
  }
  const passwordHashed = await bcrypt.hash(password, 10);

  const user = new User({
    fullName: fullName,
    email: email,
    password: passwordHashed,
  });
  try {
    await user.save();
    return res.status(201).json({
      code: res.statusCode,
      message: localizable.registratoConSuccesso,
    });
  } catch (error) {
    let errorMessage = error.message;
    if (
      error.name === "ValidationError" &&
      error.errors &&
      error.errors.email
    ) {
      errorMessage = error.errors.email.message;
    }
    return res
      .status(409)
      .json({ code: res.statusCode, message: errorMessage });
  }
};

module.exports = {
  login,
  loginGoogle,
  register,
  loginAnonymous,
};
