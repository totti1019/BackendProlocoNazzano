const fs = require("fs");
const path = require("path");

const { initializeApp } = require("firebase/app");

const { getDatabase, ref, get } = require("firebase/database");

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
//const database = getDatabase(app);

// Percorso assoluto del file
const filePath = path.join(__dirname, "sharedData.json");
// Funzione per il salvataggio dei dati in un file
function saveSharedData(data) {
  const dataToSave = JSON.stringify(data);
  fs.writeFileSync(filePath, dataToSave);
}

function loadSharedData() {
  const loadedData = fs.readFileSync(filePath, "utf8");
  return JSON.parse(loadedData);
}

// Funzione per il caricamento dei dati da un file
async function loadSharedData2(req, res) {
  try {
    const loadedData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(loadedData);
  } catch (error) {
    // Gestisci eventuali errori durante il caricamento dei dati locali
    console.error("Errore nel caricamento dei dati locali:", error);

    try {
      // Esegui la chiamata a getPercorsoSagra per recuperare i dati da Firebase
      const sagraAttuale = await getPercorsoSagra(req, res);
      if (sagraAttuale && sagraAttuale) {
        const sharedData = {
          sagraAttuale: sagraAttuale,
        };

        saveSharedData(sharedData);
        return sharedData;
      } else {
        // Gestisci la situazione in cui non hai ottenuto dati validi da Firebase
        console.error("Errore nel caricamento dei dati da Firebase.");
        return null;
      }
    } catch (firebaseError) {
      console.error(
        "Errore nel caricamento dei dati da Firebase:",
        firebaseError
      );
      return null;
    }
  }
}

// Chiamata per prendere il percorso della sagra attuale
const getPercorsoSagra = async (req, res) => {
  try {
    const percorsoSagra = `prolocoNazzano`;
    const dataRef = ref(database, percorsoSagra);

    const snapshot = await get(dataRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      return data.sagraAttuale; // Restitui il valore direttamente
    } else {
      console.error("Errore nel caricamento dei dati.");
      throw new Error("Errore nel caricamento dei dati:");
    }
  } catch (error) {
    console.error("Errore nel caricamento dei dati: ", error);
    return null;
  }
};

const savePercorsoSagraSQLite = (name) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run("CREATE TABLE IF NOT EXISTS percorso (name TEXT)");
      const stmt = db.prepare(
        "INSERT OR REPLACE INTO percorso (name) VALUES (?)"
      );
      stmt.run(name, (err) => {
        stmt.finalize();
        if (err) {
          console.error("Errore nel salvataggio dei dati:", err);
          reject(err);
        } else {
          console.log("Dati salvati con successo");
          resolve();
        }
      });
    });
  });
};

const getPercorsoSagraSQLite = () => {
  return new Promise((resolve, reject) => {
    db.get("SELECT name FROM percorso", (err, row) => {
      if (err) {
        console.error("Errore nel caricamento dei dati:", err);
        reject(err);
      } else {
        if (row) {
          resolve(row.name);
        } else {
          console.error("Nessun valore trovato per 'sagraAttuale'");
          reject(new Error("Nessun valore trovato per 'sagraAttuale'"));
        }
      }
    });
  });
};

module.exports = {
  saveSharedData,
  loadSharedData,
  savePercorsoSagraSQLite,
  getPercorsoSagraSQLite,
};
