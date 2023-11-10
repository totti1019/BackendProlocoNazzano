const { getDatabase, ref, onValue } = require("firebase/database");

const { appFirebase } = require("../controllers/utils/config-admin-firebase"); // Importa il modulo di configurazione firebase admin

const utils = require("../controllers/utils/utils");

const database = getDatabase(appFirebase);

const loadedSharedData = utils.loadSharedData();

let percorsoDb = ``;

const configureWebSocket = (io) => {
  try {
    if (loadedSharedData) {
      percorsoDb = `prolocoNazzano/${loadedSharedData.sagraAttuale}/numeratore`;
    } else {
      console.log("Impossibile caricare i dati dalle shared data.");
      throw new Error("Impossibile caricare i dati dalle shared data.");
    }
    const activeSockets = new Set(); // Utilizziamo un set per tenere traccia dei socket attivi

    io.on("connection", (socket) => {
      console.log("Nuova connessione WebSocket:", socket.id);

      activeSockets.add(socket); // Aggiungiamo il socket alla lista degli attivi

      socket.on("disconnect", () => {
        console.log("Socket disconnesso:", socket.id);
        activeSockets.delete(socket); // Rimuoviamo il socket disconnesso
      });
    });

    const dataRef = ref(database, percorsoDb);

    onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        // Inviamo l'aggiornamento solo ai socket attivi per evitare duplicati
        for (const socket of activeSockets) {
          socket.emit(
            "firebase-update",
            JSON.stringify({
              code: 200,
              esito: true,
              response: data,
            })
          );
        }
      } else {
        for (const socket of activeSockets) {
          socket.emit(
            "firebase-update",
            JSON.stringify({
              code: 404,
              esito: false,
              message: "I dati non esistono.",
            })
          );
        }
      }
    });
  } catch (error) {
    console.log(error);
    socket.emit(
      "firebase-update",
      JSON.stringify({
        code: 404,
        esito: false,
        message: "Errore nella lettura dei dati",
      })
    );
  }
};

module.exports = configureWebSocket;
