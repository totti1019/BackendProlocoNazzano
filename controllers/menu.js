const {
  getDatabase,
  ref,
  get,
  set,
  remove,
  update,
} = require("firebase/database");

const { Menu } = require("../models/menu");

require("dotenv").config();

const utils = require("./utils/utils");

const { appFirebase } = require("../controllers/utils/config-admin-firebase"); // Importa il modulo di configurazione firebase admin

const database = getDatabase(appFirebase);

let percorsoDb = ``;

const getAllMenu = async (req, res) => {
  try {
    // Caricamento dei dati dalle shared
    const loadedSharedData = await utils.loadSharedData();
    if (loadedSharedData) {
      percorsoDb = `prolocoNazzano/${loadedSharedData.sagraAttuale}/menu`;
    } else {
      console.log("Impossibile caricare i dati.");
      throw new Error("Impossibile caricare i dati.");
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
const saveMenu = async (req, res) => {
  const jsonString = req.body;
  try {
    // Controllo che il json sia valido
    if (
      isValidJSON(jsonString) &&
      jsonString.sagra &&
      jsonString.sagra !== ""
    ) {
      // Salvataggio del valore in un file
      const sharedData = {
        sagraAttuale: jsonString.sagra,
      };

      // Salvataggio dei dati nelle shared
      utils.saveSharedData(sharedData);

      const percorso = `prolocoNazzano/${jsonString.sagra}/menu`;

      const dataRef = ref(database, percorso);

      // Utilizza il metodo 'set' per sovrascrivere i dati del menu nel percorso specificato

      const percorsoSagra = `prolocoNazzano`;
      const dataRefSagra = ref(database, percorsoSagra);

      // Utilizza il metodo 'set' per sovrascrivere i dati della sagra e update per salvare il percorso della sagra attuale
      await set(dataRef, jsonString).then(() => {
        update(dataRefSagra, { sagraAttuale: jsonString.sagra });
        res.status(200).json({
          code: res.statusCode,
          esito: true,
          response: "Menu salvato correttamente",
        });
      });
    } else {
      console.log("JSON non valido");
      res.status(500).json({
        code: res.statusCode,
        esito: false,
        message: "Menu non salvato: JSON non valido",
      });
    }
  } catch (error) {
    console.error("Menu non salvato: ", error);
    res.status(500).json({
      code: res.statusCode,
      esito: false,
      message: "Menu non salvato",
    });
  }
};

// Elimino tutta la tabella del menu
const deleteMenu = async (req, res) => {
  try {
    // Caricamento dei dati dalle shared
    const loadedSharedData = await utils.loadSharedData();
    if (loadedSharedData) {
      percorsoDb = `prolocoNazzano/${loadedSharedData.sagraAttuale}/menu`;
    } else {
      console.log("Impossibile caricare i dati.");
      throw new Error("Impossibile caricare i dati.");
    }
    const dataRef = ref(database, percorsoDb);
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
  getAllMenu,
  saveMenu,
  deleteMenu,
};
