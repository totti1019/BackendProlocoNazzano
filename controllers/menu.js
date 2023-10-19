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

const percorsoDb = "prolocoNazzano/polenta2023/menu";

const getAllMenu = async (req, res) => {
  try {
    const dataRef = ref(database, percorsoDb);

    await get(dataRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          res.status(200).json({
            code: res.statusCode,
            esito: true,
            response: data,
          });
        } else {
          console.error("I dati non esistono. Inserire il menu.");
          res.status(404).json({
            code: res.statusCode,
            esito: true,
            message: "I dati non esistono. Inserire il menu.",
          });
        }
      })
      .catch((error) => {
        console.error("Errore nella lettura dei dati: " + error);
        res.status(500).json({
          code: res.statusCode,
          esito: false,
          message: "Errore nella lettura dei dati: " + error.message,
        });
      });
  } catch (error) {
    console.error("Errore nella lettura dei dati: ", error);

    res.status(500).json({
      code: res.statusCode,
      esito: false,
      message: "Errore nella lettura dei dati: " + error.message,
    });
  }
};

// Funzione per scrivere dati nel database Firebase
const saveMenu = async (req, res) => {
  const jsonString = req.body;
  try {
    // Controllo che il json sia valido
    if (isValidJSON(jsonString)) {
      const dataRef = ref(database, percorsoDb);
      // Utilizza il metodo 'set' per sovrascrivere i dati nel percorso specificato
      set(dataRef, jsonString)
        .then(() => {
          res.status(200).json({
            code: res.statusCode,
            esito: true,
            response: "Menu salvato correttamente",
          });
        })
        .catch((error) => {
          console.error("Errore nella scrittura dei dati: " + error);
          res.status(500).json({
            code: res.statusCode,
            esito: false,
            message: "Errore nella scrittura dei dati",
          });
        });
    } else {
      console.log("JSON non valido");
      res.status(500).json({
        code: res.statusCode,
        esito: false,
        message: "Errore nella scrittura dei dati: json non valido",
      });
    }
  } catch (error) {
    console.error("Errore nella scrittura dei dati: ", error);
    res.status(500).json({
      code: res.statusCode,
      esito: false,
      message: "Errore nella scrittura dei dati",
    });
  }
};

// Elimino tutta la tabella del menu
const deleteMenu = async (req, res) => {
  const dataRef = ref(database, percorsoDb);
  try {
    // Utilizza il metodo 'remove' per eliminare il nodo specificato
    remove(dataRef)
      .then(() => {
        res.status(200).json({
          code: res.statusCode,
          esito: true,
          response: "Menu eliminato con successo",
        });
      })
      .catch((error) => {
        console.error("Errore nell'eliminazione del nodo: " + error);
        res.status(500).json({
          code: res.statusCode,
          esito: false,
          message: "Errore nell'eliminazione del nodo",
        });
      });
  } catch (error) {
    console.error("Errore nell'eliminazione del nodo: ", error);
    res.status(500).json({
      code: res.statusCode,
      esito: false,
      message: "Errore nell'eliminazione del nodo",
    });
  }
};

function isValidJSON(text) {
  try {
    if (Array.isArray(text)) {
      return true; // È un array
    }
    if (typeof text === "object" && text !== null) {
      return true; // È un oggetto
    }
  } catch (error) {
    //console.log(error);
    return false;
  }
}

module.exports = {
  getAllMenu,
  saveMenu,
  deleteMenu,
};
