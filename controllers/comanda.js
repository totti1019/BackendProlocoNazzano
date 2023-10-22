const { initializeApp } = require("firebase/app");

const {
  getDatabase,
  ref,
  get,
  set,
  remove,
  update,
  child,
  push,
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

const getNumeroComanda2 = async (req, res) => {
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
            esito: false,
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
const getNumeroComanda = async (req, res) => {
  const jsonString = req.body;
  //console.log(jsonString);
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
        console.error("Errore nella lettura dei dati: " + error);
        res.status(500).json({
          code: res.statusCode,
          esito: false,
          message: "Errore nella lettura dei dati: " + error.message,
        });
      });
  } catch (error) {
    console.error("Menu non salvato: ", error);
    res.status(500).json({
      code: res.statusCode,
      esito: false,
      message: "Menu non salvato",
    });
  }
};

// Funzione per scrivere dati nel database Firebase
const saveNumeroComanda = async (req, res, numeroComanda) => {
  try {
    // Controllo che il json sia valido
    if (numeroComanda) {
      //percorsoDb += "/" + 2;
      console.log(percorsoDb);
      const dataRef = ref(database, percorsoDb);
      // Utilizza il metodo 'set' per sovrascrivere i dati nel percorso specificato
      const oggetto = [{ numeroComanda: 1 }];

      set(dataRef, oggetto)
        .then(() => {
          res.status(200).json({
            code: res.statusCode,
            esito: true,
            response: "Numero salvato correttamente",
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

// Funzione per scrivere dati nel database Firebase
const updateNumeroComanda = async (req, res, numeroComanda) => {
  try {
    if (numeroComanda) {
      console.log(percorsoDb);
      const dataRef = ref(database, percorsoDb);

      //const newPostKey = push(child(ref(database), "comanda")).requestNumber_;
      //console.log("CHE newPostKey ", newPostKey);
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

// Funzione per scrivere dati nel database Firebase
const saveComanda = async (req, res) => {
  const jsonString = req.body;
  console.log(jsonString);
  try {
    // Controllo che il json sia valido
    // Controllo che il json sia valido

    if (
      isValidJSON(jsonString) &&
      jsonString.numeroComanda &&
      jsonString.numeroComanda > 0
    ) {
      console.log(percorsoDb);
      const dataRef = ref(database, percorsoDb);

      //const newPostKey = push(child(ref(database), "comanda")).requestNumber_;
      //console.log("CHE newPostKey ", newPostKey);
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
