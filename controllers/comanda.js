const { initializeApp } = require("firebase/app");

const {
  getDatabase,
  ref,
  update,
  runTransaction,
} = require("firebase/database");

require("dotenv").config();

const utils = require("./utils/utils");

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

let percorsoDb = ``;

// Funzione per aggiornare dati nel database Firebase
const updateNumeroComanda = async (req, res) => {
  try {
    // Caricamento dei dati dalle shared
    const loadedSharedData = utils.loadSharedData();
    if (loadedSharedData) {
      percorsoDb = `prolocoNazzano/${loadedSharedData.sagraAttuale}/comande`;
    } else {
      console.log("Impossibile caricare i dati.");
      throw new Error("Impossibile caricare i dati.");
    }
    const dataRef = ref(database, percorsoDb);

    const result = await runTransaction(dataRef, (currentData) => {
      if (!currentData) {
        currentData = [];
      }

      // Calcola il nuovo numeroComanda
      const newNumeroComanda = currentData.length + 1;

      // Aggiungi il nuovo oggetto all'array
      currentData.push({ numeroComanda: newNumeroComanda });
      return currentData;
    });

    if (result.committed) {
      const newNumeroComanda = result.snapshot.val().length;
      res.status(200).json({
        code: res.statusCode,
        esito: true,
        response: { numeroComanda: newNumeroComanda },
      });
    } else {
      const error = result.error;
      if (error.code === "ABORTED") {
        res.status(409).json({
          code: res.statusCode,
          esito: false,
          message: "Comanda già esistente",
        });
      } else {
        res.status(500).json({
          code: res.statusCode,
          esito: false,
          message: "Aggiornamento non riuscito",
        });
      }
    }
  } catch (error) {
    console.error(
      "Errore durante l'aggiornamento del numero di comanda: " + error
    );
    res.status(500).json({
      code: res.statusCode,
      esito: false,
      message: "Errore durante l'aggiornamento del numero di comanda",
    });
  }
};

// Funzione per salvare la camanda nel database Firebase
const saveComanda = async (req, res) => {
  const NUMERO_COMANDA_OFFSET = 1;
  const jsonString = req.body;

  try {
    // Caricamento dei dati dalle shared
    const loadedSharedData = utils.loadSharedData();
    if (loadedSharedData) {
      percorsoDb = `prolocoNazzano/${loadedSharedData.sagraAttuale}/comande`;
    } else {
      console.log("Impossibile caricare i dati.");
      throw new Error("Impossibile caricare i dati.");
    }

    if (!isValidJSON(jsonString)) {
      throw new Error("JSON non valido");
    }

    if (!jsonString.numeroComanda || jsonString.numeroComanda <= 0) {
      throw new Error("Il campo 'numeroComanda' non è valido");
    }

    const dataRef = ref(database, percorsoDb);
    const newNumeroComanda = jsonString.numeroComanda;

    const oggetto = {
      numeroComanda: newNumeroComanda,
      comanda: jsonString.comanda,
      pagamento: jsonString.pagamento,
      totaleComanda: jsonString.totaleComanda,
      numeroCassa: jsonString.numeroCassa,
    };

    const updates = {};
    updates[newNumeroComanda - NUMERO_COMANDA_OFFSET] = oggetto;

    await update(dataRef, updates);

    res.status(200).json({
      code: res.statusCode,
      esito: true,
      response: { numeroComanda: newNumeroComanda },
      message: `Comanda numero ${newNumeroComanda} salvata correttamente`,
    });
  } catch (error) {
    res.status(400).json({
      code: res.statusCode,
      esito: false,
      message: error.message || "Errore sconosciuto",
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
  updateNumeroComanda,
  saveComanda,
};
