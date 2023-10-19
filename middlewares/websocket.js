const { initializeApp } = require("firebase/app");
const { getDatabase, ref, onValue } = require("firebase/database");
require("dotenv").config();

// Configurazione di Firebase
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
const percorsoDb = "prolocoNazzano/polenta2023/numeratore";

const configureWebSocket = (io) => {
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
};

module.exports = configureWebSocket;
