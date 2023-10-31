const localizable = require("../locales/localizables");

const utils = require("./utils/utils");

const { check, validationResult } = require("express-validator");

const {
  getAuth,
  signInAnonymously,
  signInWithEmailAndPassword,
} = require("firebase/auth");

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
const { use } = require("../routers/users");

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

// METODO PER IL LOGIN CON EMAIL E PASSWORD
const login = async (req, res) => {
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

    const customToken = await adminFirebase
      .auth()
      .createCustomToken(user.uid, additionalClaims, {
        expires: oneDayFromNow,
      });

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
