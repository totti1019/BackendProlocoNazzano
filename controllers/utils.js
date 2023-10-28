const { getDatabase, ref, get } = require("firebase/database");

const { appFirebase } = require("../controllers/utils/config-admin-firebase"); // Importa il modulo di configurazione firebase admin

const database = getDatabase(appFirebase);
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
