const mongoose = require("mongoose");
const localizable = require("../locales/localizables");

const { check, validationResult } = require("express-validator");

const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client();

require("dotenv").config();

const admin = require("firebase-admin");
const path = require("path");

const credentialsPath = process.env.FIREBASE_CREDENTIALS_PATH;

console.log(credentialsPath);

if (!credentialsPath) {
  console.error(
    "La variabile d'ambiente FIREBASE_CREDENTIALS_PATH non è configurata."
  );
  process.exit(1);
}

const serviceAccount = require(path.join(__dirname, "..", credentialsPath));

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("Firebase Admin inizializzato con successo.");
} catch (error) {
  console.error("Errore durante l'inizializzazione di Firebase Admin:", error);
  process.exit(1);
}

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
    if (uid === undefined || uid === "") {
      console.log("Parametro non trovato");
      throw new Error("Parametro non trovato o non corretto");
    }

    admin
      .auth()
      .createCustomToken(uid)
      .then((customToken) => {
        res.status(200).json({
          code: res.statusCode,
          esito: true,
          response: customToken,
          message: "Token creato con successo",
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          code: res.statusCode,
          esito: false,
          response: null,
          message: "Errore durante la creazione del token personalizzato",
        });
      });
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
