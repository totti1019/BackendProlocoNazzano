const { initializeApp } = require("firebase/app");

const {
  getDatabase,
  ref,
  get,
  set,
  remove,
  update,
} = require("firebase/database");

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

const percorsoDb = "prolocoNazzano/polenta2023/comande";

// Funzione per scrivere dati nel database Firebase
const getNumeroComanda = async (req, res) => {
  const dataRef = ref(database, percorsoDb);
  try {
    await get(dataRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          console.log(data);
          updateNumeroComanda(req, res, data);
        } else {
          saveNumeroComanda(req, res, 1);
        }
      })
      .catch((error) => {
        console.error("Numero non letto: " + error);
        res.status(500).json({
          code: res.statusCode,
          esito: false,
          message: "Numero non letto: " + error.message,
        });
      });
  } catch (error) {
    console.error("Numero non letto: ", error);
    res.status(500).json({
      code: res.statusCode,
      esito: false,
      message: "Numero non letto",
    });
  }
};

// Funzione per scrivere dati nel database Firebase
const saveNumeroComanda = async (req, res, numeroComanda) => {
  try {
    // Controllo che il json sia valido
    if (numeroComanda) {
      const dataRef = ref(database, percorsoDb);
      // Utilizza il metodo 'set' per sovrascrivere i dati nel percorso specificato
      const oggetto = [{ numeroComanda: 1 }];

      set(dataRef, oggetto)
        .then(() => {
          res.status(200).json({
            code: res.statusCode,
            esito: true,
            response: oggetto.numeroComanda,
          });
        })
        .catch((error) => {
          console.error("Numero non salvato: " + error);
          res.status(500).json({
            code: res.statusCode,
            esito: false,
            message: "Numero non salvato",
          });
        });
    } else {
      console.log("JSON non valido");
      res.status(500).json({
        code: res.statusCode,
        esito: false,
        message: "Numero non salvato: JSON non valido",
      });
    }
  } catch (error) {
    console.error("Numero non salvato: ", error);
    res.status(500).json({
      code: res.statusCode,
      esito: false,
      message: "Numero non salvato",
    });
  }
};

// Funzione per aggiornare dati nel database Firebase
const updateNumeroComanda = async (req, res, numeroComanda) => {
  try {
    if (numeroComanda) {
      console.log(percorsoDb);
      const dataRef = ref(database, percorsoDb);
      const oggetto = { numeroComanda: numeroComanda.length + 1 };
      const updates = {};
      updates[numeroComanda.length] = oggetto;

      update(dataRef, updates)
        .then(() => {
          res.status(200).json({
            code: res.statusCode,
            esito: true,
            response: oggetto.numeroComanda,
          });
        })
        .catch((error) => {
          console.error("Aggiornamento non riuscito: " + error);
          res.status(500).json({
            code: res.statusCode,
            esito: false,
            message: "Aggiornamento non riuscito",
          });
        });
    } else {
      console.log("JSON non valido");
      res.status(500).json({
        code: res.statusCode,
        esito: false,
        message: "Aggiornamento non riuscito",
      });
    }
  } catch (error) {
    console.error("Aggiornamento non riuscito: ", error);
    res.status(500).json({
      code: res.statusCode,
      esito: false,
      message: "Aggiornamento non riuscito",
    });
  }
};

// Funzione per salvare la camanda nel database Firebase
const saveComanda = async (req, res) => {
  const jsonString = req.body;
  try {
    // Controllo che il json sia valido && che il numero comanda sia maggiore di 0
    if (
      isValidJSON(jsonString) &&
      jsonString.numeroComanda &&
      jsonString.numeroComanda > 0
    ) {
      console.log(percorsoDb);
      const dataRef = ref(database, percorsoDb);

      const oggetto = {
        numeroComanda: jsonString.numeroComanda,
        comanda: jsonString.comanda,
        pagamento: jsonString.pagamento,
        totaleComanda: jsonString.totaleComanda,
        numeroCassa: jsonString.numeroCassa,
      };
      const updates = {};
      updates[jsonString.numeroComanda - 1] = oggetto;

      update(dataRef, updates)
        .then(() => {
          res.status(200).json({
            code: res.statusCode,
            esito: true,
            response: `Comanda numero ${jsonString.numeroComanda} salvata correttamente`,
          });
        })
        .catch((error) => {
          console.error("Comanda non salvata: " + error);
          res.status(500).json({
            code: res.statusCode,
            esito: false,
            message: "Comanda non salvata",
          });
        });
    } else {
      console.log("JSON non valido");
      res.status(500).json({
        code: res.statusCode,
        esito: false,
        message: "Comanda non salvata: JSON non valido",
      });
    }
  } catch (error) {
    console.error("Comanda non salvata: ", error);
    res.status(500).json({
      code: res.statusCode,
      esito: false,
      message: "Comanda non salvata",
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
        console.error("Menu non eliminato: " + error);
        res.status(500).json({
          code: res.statusCode,
          esito: false,
          message: "Menu non eliminato",
        });
      });
  } catch (error) {
    console.error("Menu non eliminato: ", error);
    res.status(500).json({
      code: res.statusCode,
      esito: false,
      message: "Menu non eliminato",
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
  getNumeroComanda,
  saveComanda,
  deleteMenu,
};
