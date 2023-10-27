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
const database = getDatabase(app);

const getPercorsoSagra = async (req, res) => {
  try {
    const percorsoSagra = `prolocoNazzano`;
    const dataRef = ref(database, percorsoSagra);

    const snapshot = await get(dataRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      res.status(200).json({
        code: res.statusCode,
        esito: true,
        response: data.sagraAttuale,
        message: "Percorso trovato",
      });
    } else {
      console.error("Errore nel caricamento dei dati.");
      res.status(400).json({
        code: res.statusCode,
        esito: false,
        response: null,
        message: "Errore nel caricamento dei dati.",
      });
    }
  } catch (error) {
    console.error("Errore nel caricamento dei dati: ", error);
    res.status(400).json({
      code: res.statusCode,
      esito: false,
      message: error.message || "Errore sconosciuto",
    });
  }
};

module.exports = {
  getPercorsoSagra,
};
