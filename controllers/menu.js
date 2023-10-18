const { initializeApp } = require("firebase/app");

const { getDatabase, ref, get, set, remove } = require("firebase/database");

const { Menu } = require("../models/menu");

require("dotenv").config();

// Configura Firebase con le credenziali del tuo progetto
const firebaseConfig = {
  apiKey: process.env.APIKEY_FIREBASE,
  authDomain: process.env.AUTHDOMAIN_FIREBASE,
  databaseURL: process.env.DATABASEURL_FIREBASE,
  projectId: process.env.PROJECTID_FIREBASE,
  storageBucket: process.env.STORAGEBUCKET_FIREBASE,
  messagingSenderId: process.env.MESSAGGINGSENDERID_FIREBASE,
  appId: process.env.APPID_FIREBASE,
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const percorsoDb = "prolocoNazzano/polenta2023/";

const getAllMenu = async (req, res) => {
  try {
    const dataRef = ref(database, percorsoDb + "menu");

    await get(dataRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          res.status(200).json(data);
        } else {
          res.status(500).json({
            code: res.statusCode,
            message: "Errore nella lettura dei dati: " + error.message,
          });
        }
      })
      .catch((error) => {
        console.error("Errore nella lettura dei dati: " + error);
        callback(null); // Gestisci l'errore
      });
  } catch (error) {
    console.error("Errore nella lettura dei dati: ", error);

    res.status(500).json({
      code: res.statusCode,
      message: "Errore nella lettura dei dati: " + error.message,
    });
  }
};

module.exports = {
  getAllMenu,
};
