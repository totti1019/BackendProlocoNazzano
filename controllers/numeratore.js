const { getDatabase, ref, get, set, remove } = require("firebase/database");

require("dotenv").config();

const utils = require("./utils/utils");

const { appFirebase } = require("../controllers/utils/config-admin-firebase"); // Importa il modulo di configurazione firebase admin

const database = getDatabase(appFirebase);

// Funzione per leggere dati nel database Firebase
const getNumber = async (req, res) => {
  try {
    // Caricamento dei dati dalle shared
    /* const loadedSharedData = await utils.loadSharedData();
    if (loadedSharedData) {
      percorsoDb = `prolocoNazzano/${loadedSharedData.sagraAttuale}/numeratore`;
    } else {
      console.log("Impossibile caricare i dati.");
      throw new Error("Impossibile caricare i dati.");
    } */

    /* await utils
      .getPercorsoSagraSQLite()
      .then((percorsoSagra) => {
        console.error("Percorso Sagra:", percorsoSagra);
        percorsoDb = `prolocoNazzano/${percorsoSagra}/numeratore`;
      })
      .catch((error) => {
        console.error("Errore:", error);
        throw new Error("Impossibile caricare i dati dal db locale");
      }); */

    const loadedSharedData = utils.loadSharedData();

    if (loadedSharedData) {
      percorsoDb = `prolocoNazzano/${loadedSharedData.sagraAttuale}/numeratore`;
    } else {
      console.log("Impossibile caricare i dati dalle shared data.");
      throw new Error("Impossibile caricare i dati dalle shared data.");
    }

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
          console.error("I dati non esistono.");
          res.status(404).json({
            code: res.statusCode,
            esito: false,
            message: "I dati non esistono.",
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
const saveNumber = async (req, res) => {
  const jsonString = req.body;
  const token = req.token;
  console.log("NUOVO TOKEN ", token);
  try {
    // Caricamento dei dati dalle shared
    /* const loadedSharedData = await utils.loadSharedData();
    if (loadedSharedData) {
      percorsoDb = `prolocoNazzano/${loadedSharedData.sagraAttuale}/numeratore`;
    } else {
      console.log("Impossibile caricare i dati.");
      throw new Error("Impossibile caricare i dati.");
    } */
    // Utilizzo del metodo per ottenere il percorso della sagra
    /* await utils
      .getPercorsoSagraSQLite()
      .then((percorsoSagra) => {
        console.error("Percorso Sagra:", percorsoSagra);
        percorsoDb = `prolocoNazzano/${percorsoSagra}/numeratore`;
      })
      .catch((error) => {
        console.error("Errore:", error);
        throw new Error("Impossibile caricare i dati dal db locale");
      }); */

    const loadedSharedData = utils.loadSharedData();

    if (loadedSharedData) {
      percorsoDb = `prolocoNazzano/${loadedSharedData.sagraAttuale}/numeratore`;
    } else {
      console.log("Impossibile caricare i dati dalle shared data.");
      throw new Error("Impossibile caricare i dati dalle shared data.");
    }

    // Controllo che il json sia valido
    if (isValidJSON(jsonString)) {
      const { numero, tempoMedioServizio } = jsonString;
      const dataRef = ref(database, percorsoDb);
      // Utilizza il metodo 'set' per sovrascrivere i dati nel percorso specificato
      const oggetto = {
        numero: numero,
        tempoMedioServizio: tempoMedioServizio,
      };
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

// Elimino tutta la tabella del menu
const deleteNumber = async (req, res) => {
  try {
    // Caricamento dei dati dalle shared
    const loadedSharedData = await utils.loadSharedData();
    if (loadedSharedData) {
      percorsoDb = `prolocoNazzano/${loadedSharedData.sagraAttuale}/numeratore`;
    } else {
      console.log("Impossibile caricare i dati.");
      throw new Error("Impossibile caricare i dati.");
    }
    const dataRef = ref(database, percorsoDb);
    // Utilizza il metodo 'remove' per eliminare il nodo specificato
    const oggetto = {
      numero: 0,
      tempoMedioServizio: [],
    };
    remove(dataRef)
      .then(() => {
        res.status(200).json({
          code: res.statusCode,
          esito: true,
          response: oggetto,
          message: "Numero eliminato con successo",
        });
      })
      .catch((error) => {
        console.error("Numero non eliminato: " + error);
        res.status(500).json({
          code: res.statusCode,
          esito: false,
          response: null,
          message: "Numero non eliminato",
        });
      });
  } catch (error) {
    console.error("Numero non eliminato: ", error);
    res.status(500).json({
      code: res.statusCode,
      esito: false,
      response: null,
      message: "Numero non eliminato",
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
  getNumber,
  saveNumber,
  deleteNumber,
};
