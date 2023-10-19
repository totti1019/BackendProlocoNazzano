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
  io.on("connection", (socket) => {
    console.log("Nuova connessione WebSocket:", socket.id);

    const dataRef = ref(database, percorsoDb);

    onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log("ECCOMI " + data);
        io.emit("firebase-update", data);
      }
    });
  });
};

module.exports = configureWebSocket;
