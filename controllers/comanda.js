const {
  getDatabase,
  ref,
  update,
  get,
  child,
  runTransaction,
} = require("firebase/database");

require("dotenv").config();

const utils = require("./utils/utils");

const { appFirebase } = require("../controllers/utils/config-admin-firebase"); // Importa il modulo di configurazione firebase admin

const database = getDatabase(appFirebase);

let percorsoDb = ``;

// Funzione per aggiornare dati nel database Firebase
const updateNumeroComanda = async (req, res) => {
  try {
    // Caricamento dei dati dalle shared
    const loadedSharedData = await utils.loadSharedData();
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
    const loadedSharedData = await utils.loadSharedData();
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

// Funzione per salvare la camanda nel database Firebase
const leggiVecchiaComanda = async (req, res) => {
  const NUMERO_COMANDA_OFFSET = 1;
  const jsonString = req.body;

  try {
    // Caricamento dei dati dalle shared
    const loadedSharedData = await utils.loadSharedData();
    if (loadedSharedData) {
      percorsoDb = `prolocoNazzano/${loadedSharedData.sagraAttuale}/comande`;
    } else {
      console.log("Impossibile caricare i dati.");
      throw new Error("Impossibile caricare i dati.");
    }

    if (!isValidJSON(jsonString)) {
      throw new Error("JSON non valido");
    }

    if (
      !jsonString.numeroVecchiaComanda ||
      jsonString.numeroVecchiaComanda <= 0
    ) {
      throw new Error("Il campo 'numeroVecchiaComanda' non è valido");
    }

    // Creazione di un riferimento alla posizione specifica del database
    const dataRef = ref(database, percorsoDb);

    const numeroVecchiaComanda = (
      jsonString.numeroVecchiaComanda - NUMERO_COMANDA_OFFSET
    ).toString();

    // Esegui la query per cercare la comanda
    const comandaSnapshot = await get(child(dataRef, numeroVecchiaComanda));

    if (comandaSnapshot.exists()) {
      const comanda = comandaSnapshot.val();
      res.status(200).json({
        code: res.statusCode,
        esito: true,
        response: comanda,
        message: `Comanda numero ${jsonString.numeroVecchiaComanda} caricata correttamente`,
      });
    } else {
      console.log("Comanda non trovata");
      res.status(200).json({
        code: res.statusCode,
        esito: true,
        response: null,
        message: `Comanda numero ${jsonString.numeroVecchiaComanda} non trovata`,
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

// Funzione per salvare la camanda nel database Firebase
const updateVecchiaComanda = async (req, res) => {
  const NUMERO_COMANDA_OFFSET = 1;
  const jsonString = req.body;

  try {
    // Caricamento dei dati dalle shared
    const loadedSharedData = await utils.loadSharedData();
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
      message: `Comanda numero ${newNumeroComanda} aggiornata correttamente`,
    });
  } catch (error) {
    res.status(400).json({
      code: res.statusCode,
      esito: false,
      message: error.message || "Errore sconosciuto",
    });
  }
};

// Funzione per salvare la camanda nel database Firebase
const leggiIncasso = async (req, res) => {
  const jsonString = req.body;

  try {
    if (!isValidJSON(jsonString)) {
      throw new Error("JSON non valido");
    }

    if (!jsonString.numeroCassa || jsonString.numeroCassa <= 0) {
      throw new Error("Il campo 'numeroCassa' non è valido");
    }

    const numeroCassaDesiderato = jsonString.numeroCassa; // Numero di cassa desiderato

    // Carica i dati delle comande da Firebase
    const loadedSharedData = await utils.loadSharedData();
    if (loadedSharedData) {
      const percorsoDb = `prolocoNazzano/${loadedSharedData.sagraAttuale}/comande`;

      // Crea un riferimento alla posizione delle comande nel database Firebase
      const dataRef = ref(database, percorsoDb);

      // Ottieni uno snapshot di tutte le comande
      const comandeSnapshot = await get(dataRef);

      if (comandeSnapshot.exists()) {
        const comandeData = comandeSnapshot.val();

        // Filtra le comande con il numero di cassa desiderato
        const comandeFiltrate = comandeData.filter(
          (comanda) => comanda.numeroCassa === numeroCassaDesiderato
        );

        if (comandeFiltrate.length > 0) {
          // Estrai il totale e il metodo di pagamento di ciascuna comanda
          const incasso = comandeFiltrate.map((comanda) => ({
            totaleComanda: comanda.totaleComanda,
            pagamento: comanda.pagamento,
          }));
          res.status(200).json({
            code: res.statusCode,
            esito: true,
            response: incasso,
            message: "Elenco degli incassi scaricato correttamente",
          });
        } else {
          console.log("Ancora nessun incasso");
          res.status(200).json({
            code: res.statusCode,
            esito: true,
            response: [],
            message: "Ancora nessun incasso",
          });
        }
      } else {
        console.log("Ancora nessun incasso");
        res.status(200).json({
          code: res.statusCode,
          esito: true,
          response: [],
          message: "Ancora nessun incasso",
        });
      }
    } else {
      console.log("Impossibile caricare i dati.");
      throw new Error("Impossibile caricare i dati.");
    }
  } catch (error) {
    res.status(400).json({
      code: res.statusCode,
      esito: false,
      message: error.message || "Errore sconosciuto",
    });
  }
};

// Funzione per salvare la camanda nel database Firebase
const leggiDati = async (req, res) => {
  const jsonString = req.body;

  try {
    if (!isValidJSON(jsonString)) {
      throw new Error("JSON non valido");
    }

    if (!jsonString.anno || !jsonString.sagra) {
      throw new Error("Parametri vuoti");
    }
    if (jsonString.anno == "tutti" || jsonString.sagra == "tutte") {
      percorsoDb = `prolocoNazzano`;
    } else {
      const sagra = `${jsonString.sagra}${jsonString.anno}`;
      percorsoDb = `prolocoNazzano/${sagra}/comande`;
    }

    // Creazione di un riferimento alla posizione specifica del database
    const dataRef = ref(database, percorsoDb);
    const comandaSnapshot = await get(dataRef); // Ottenere uno snapshot dei dati

    if (comandaSnapshot.exists()) {
      const comande = comandaSnapshot.val();

      let piattiQuantitaArray = [];
      if (percorsoDb === "prolocoNazzano") {
        piattiQuantitaArray = convertComandeToObject(comande, jsonString);
      } else {
        piattiQuantitaArray = convertComandeToObject(comande, jsonString);
        console.log(piattiQuantitaArray);
        // Creiamo un oggetto per tenere traccia delle quantità dei piatti
        const sommaPiattoQuantita = {};

        // Scandiamo tutte le comande
        comande.forEach((comanda) => {
          const comandaItems = comanda.comanda; // Ottieni l'array dei piatti nella comanda
          comandaItems.forEach((item) => {
            const piatto = item.piatto;
            const quantita = parseInt(item.quantita, 10); // Converto la quantità in un numero intero

            // Aggiungiamo la quantità al piatto nella nostra mappa
            if (sommaPiattoQuantita[piatto]) {
              sommaPiattoQuantita[piatto] += quantita;
            } else {
              sommaPiattoQuantita[piatto] = quantita;
            }
          });
        });

        // Convertiamo l'oggetto in un array di oggetti con "piatto" e "quantità"
        piattiQuantitaArray = Object.keys(sommaPiattoQuantita).map(
          (piatto) => ({
            piatto,
            quantita: sommaPiattoQuantita[piatto],
          })
        );

        console.log(piattiQuantitaArray);
      }

      res.status(200).json({
        code: res.statusCode,
        esito: true,
        response: piattiQuantitaArray,
        message: `Dati trovati`,
      });
    } else {
      console.log("Comande non trovate");
      res.status(200).json({
        code: res.statusCode,
        esito: false,
        response: null,
        message: `Nessun dato`,
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

function convertComandeToObject(data, filter) {
  const result = [];

  const { anno, sagra } = filter;

  for (const sagraKey in data) {
    if (data.hasOwnProperty(sagraKey)) {
      if (
        (anno === "tutti" || sagraKey.endsWith(anno)) &&
        (sagra === "tutte" || sagraKey.startsWith(sagra)) &&
        data[sagraKey].comande
      ) {
        const sagraData = data[sagraKey];
        const comande = sagraData.comande;
        const piattiQuantitaArray = [];

        comande.forEach((comanda) => {
          comanda.comanda.forEach((item) => {
            const piatto = item.piatto;
            const quantita = parseInt(item.quantita, 10);

            const existingPiatto = piattiQuantitaArray.find(
              (p) => p.piatto === piatto
            );
            if (existingPiatto) {
              existingPiatto.quantita += quantita;
            } else {
              piattiQuantitaArray.push({ piatto, quantita });
            }
          });
        });

        const sagraEntry = {
          nomeSagra: sagraKey,
          totaleComande: piattiQuantitaArray,
        };

        result.push(sagraEntry);
      }
    }
  }
  console.log("result", result);
  return result;
}

/*function getFiltriTutti(sagre) {
  const comande2023 = Object.entries(sagre)
    .filter(([key, value]) => key.endsWith("2023") && value.comande)
    .map(([key, value]) => value.comande)
    .flat();

  return convertToSagreObject(comande2023);
}

function convertToSagreObject(comandeArray) {
  const sagreObject = {};
  comandeArray.forEach((comanda) => {
    const nomeSagra = comanda.sagra;
    const piattiQuantita = comanda.comande;

    if (!sagreObject[nomeSagra]) {
      sagreObject[nomeSagra] = [];
    }

    sagreObject[nomeSagra].push(...piattiQuantita);
  });

  return sagreObject;
} */

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
  leggiVecchiaComanda,
  updateVecchiaComanda,
  leggiIncasso,
  leggiDati,
};
