const {
  getDatabase,
  ref,
  update,
  get,
  child,
  runTransaction,
} = require("firebase/database");

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

      // Calcola il nuovo numeroComanda prendendo l'array comande e aggiunge +1
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
        message: "Aggiornato con successo",
      });
    } else {
      const error = result.error;
      if (error.code === "ABORTED") {
        res.status(409).json({
          code: res.statusCode,
          esito: false,
          response: null,
          message: "Comanda già esistente",
        });
      } else {
        res.status(500).json({
          code: res.statusCode,
          esito: false,
          response: null,
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
      response: null,
      message: "Errore durante l'aggiornamento del numero di comanda",
    });
  }
};

// Funzione per salvare la camanda nel database Firebase
const saveComanda = async (req, res) => {
  const NUMERO_COMANDA_OFFSET = 1;
  try {
    const { numeroComanda, comanda, pagamento, totaleComanda, numeroCassa } =
      req.body;
    // Caricamento dei dati dalle shared
    const loadedSharedData = await utils.loadSharedData();
    if (loadedSharedData) {
      percorsoDb = `prolocoNazzano/${loadedSharedData.sagraAttuale}/comande`;
    } else {
      console.log("Impossibile caricare i dati.");
      throw new Error("Impossibile caricare i dati.");
    }

    const dataRef = ref(database, percorsoDb);

    const oggetto = {
      numeroComanda: numeroComanda,
      comanda: comanda,
      pagamento: pagamento,
      totaleComanda: totaleComanda,
      numeroCassa: numeroCassa,
    };

    const updates = {};
    updates[numeroComanda - NUMERO_COMANDA_OFFSET] = oggetto;

    await update(dataRef, updates);

    res.status(200).json({
      code: res.statusCode,
      esito: true,
      response: { numeroComanda: numeroComanda },
      message: `Comanda numero ${numeroComanda} salvata correttamente`,
    });
  } catch (error) {
    res.status(400).json({
      code: res.statusCode,
      esito: false,
      response: null,
      message: error.message || "Errore sconosciuto",
    });
  }
};

// Funzione per salvare la camanda nel database Firebase
const leggiVecchiaComanda = async (req, res) => {
  const NUMERO_COMANDA_OFFSET = 1;

  try {
    const { numeroVecchiaComanda } = req.body;

    // Caricamento dei dati dalle shared
    const loadedSharedData = await utils.loadSharedData();
    if (loadedSharedData) {
      percorsoDb = `prolocoNazzano/${loadedSharedData.sagraAttuale}/comande`;
    } else {
      console.log("Impossibile caricare i dati.");
      throw new Error("Impossibile caricare i dati.");
    }

    // Creazione di un riferimento alla posizione specifica del database
    const dataRef = ref(database, percorsoDb);
    const vecchiaComanda = (
      numeroVecchiaComanda - NUMERO_COMANDA_OFFSET
    ).toString();

    // Esegui la query per cercare la comanda
    const comandaSnapshot = await get(child(dataRef, vecchiaComanda));

    if (comandaSnapshot.exists()) {
      const comanda = comandaSnapshot.val();
      res.status(200).json({
        code: res.statusCode,
        esito: true,
        response: comanda,
        message: `Comanda numero ${numeroVecchiaComanda} caricata correttamente`,
      });
    } else {
      console.log("Comanda non trovata");
      res.status(200).json({
        code: res.statusCode,
        esito: true,
        response: null,
        message: `Comanda numero ${numeroVecchiaComanda} non trovata`,
      });
    }
  } catch (error) {
    res.status(400).json({
      code: res.statusCode,
      esito: false,
      response: null,
      message: error.message || "Errore sconosciuto",
    });
  }
};

// Funzione per salvare la camanda nel database Firebase
const updateVecchiaComanda = async (req, res) => {
  const NUMERO_COMANDA_OFFSET = 1;

  try {
    const { numeroComanda, comanda, pagamento, totaleComanda, numeroCassa } =
      req.body;
    // Caricamento dei dati dalle shared
    const loadedSharedData = await utils.loadSharedData();
    if (loadedSharedData) {
      percorsoDb = `prolocoNazzano/${loadedSharedData.sagraAttuale}/comande`;
    } else {
      console.log("Impossibile caricare i dati.");
      throw new Error("Impossibile caricare i dati.");
    }

    const dataRef = ref(database, percorsoDb);

    const oggetto = {
      numeroComanda: numeroComanda,
      comanda: comanda,
      pagamento: pagamento,
      totaleComanda: totaleComanda,
      numeroCassa: numeroCassa,
    };

    const updates = {};
    updates[numeroComanda - NUMERO_COMANDA_OFFSET] = oggetto;

    await update(dataRef, updates);

    res.status(200).json({
      code: res.statusCode,
      esito: true,
      response: { numeroComanda: numeroComanda },
      message: `Comanda numero ${numeroComanda} aggiornata correttamente`,
    });
  } catch (error) {
    res.status(400).json({
      code: res.statusCode,
      esito: false,
      response: null,
      message: error.message || "Errore sconosciuto",
    });
  }
};

// Funzione per salvare la camanda nel database Firebase
const leggiIncasso = async (req, res) => {
  try {
    const { numeroCassa } = req.body;
    // Carica i dati delle comande da Firebase
    const loadedSharedData = await utils.loadSharedData();
    if (loadedSharedData) {
      percorsoDb = `prolocoNazzano/${loadedSharedData.sagraAttuale}/comande`;
    } else {
      console.log("Impossibile caricare i dati.");
      throw new Error("Impossibile caricare i dati.");
    }
    // Crea un riferimento alla posizione delle comande nel database Firebase
    const dataRef = ref(database, percorsoDb);

    // Ottieni uno snapshot di tutte le comande
    const comandeSnapshot = await get(dataRef);

    if (comandeSnapshot.exists()) {
      const comandeData = comandeSnapshot.val();

      // Filtra le comande con il numero di cassa desiderato
      const comandeFiltrate = comandeData.filter(
        (comanda) => comanda.numeroCassa === numeroCassa
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
  } catch (error) {
    res.status(400).json({
      code: res.statusCode,
      esito: false,
      response: null,
      message: error.message || "Errore sconosciuto",
    });
  }
};

// Funzione per salvare la camanda nel database Firebase
const leggiDati = async (req, res) => {
  try {
    const { anno, sagra } = req.body;

    percorsoDb = `prolocoNazzano`;

    // Creazione di un riferimento alla posizione specifica del database
    const dataRef = ref(database, percorsoDb);
    const comandaSnapshot = await get(dataRef); // Ottenere uno snapshot dei dati

    if (comandaSnapshot.exists()) {
      const comande = comandaSnapshot.val();

      const piattiQuantitaArray = convertComandeToObject(comande, anno, sagra);

      if (piattiQuantitaArray.length > 0) {
        piattiQuantitaArray.sort((a, b) => {
          const yearA = parseInt(a.nomeSagra.slice(-4), 10);
          const yearB = parseInt(b.nomeSagra.slice(-4), 10);
          const nameA = a.nomeSagra;
          const nameB = b.nomeSagra;

          if (yearA !== yearB) {
            return yearB - yearA; // Ordina per anno (dal più recente al più vecchio)
          }

          // Se gli anni sono gli stessi, ordina per nome
          return nameA.localeCompare(nameB);
        });
        res.status(200).json({
          code: res.statusCode,
          esito: true,
          response: piattiQuantitaArray,
          message: `Dati trovati`,
        });
      } else {
        res.status(200).json({
          code: res.statusCode,
          esito: true,
          response: piattiQuantitaArray,
          message: `Nessun dato trovato`,
        });
      }
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
      response: null,
      message: error.message || "Errore sconosciuto",
    });
  }
};

function convertComandeToObject(data, anno, sagra) {
  const result = [];

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
  return result;
}

module.exports = {
  updateNumeroComanda,
  saveComanda,
  leggiVecchiaComanda,
  updateVecchiaComanda,
  leggiIncasso,
  leggiDati,
};
