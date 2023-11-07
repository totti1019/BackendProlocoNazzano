const adminFirebase = require("firebase-admin");
const { getAuth, onAuthStateChanged } = require("firebase/auth");
const path = require("path");

const { initializeApp } = require("firebase/app");
// Configurazione di Firebase SDK (front-end)
const firebase = require("firebase/app");

// Inizializzazione di Firebase Admin
const credentialsPath = process.env.FIREBASE_CREDENTIALS_PATH;
let serviceAccount;

if (!credentialsPath) {
  console.error(
    "La variabile d'ambiente FIREBASE_CREDENTIALS_PATH non è configurata."
  );
  process.exit(1);
}

try {
  serviceAccount = JSON.parse(credentialsPath);
  if (serviceAccount && typeof serviceAccount === "object") {
    // La variabile è un oggetto JSON valido
    console.error("La variabile è un JSON valido.");
    console.log("La variabile è un JSON valido.");
  } else {
    console.log("La variabile non è un JSON valido.");
    serviceAccount = require(path.join(__dirname, "../..", credentialsPath));
  }
} catch (error) {
  console.error("La variabile non è un JSON valido.");
  serviceAccount = require(path.join(__dirname, "../..", credentialsPath));
}

console.log(credentialsPath);
try {
  adminFirebase.initializeApp({
    credential: adminFirebase.credential.cert(serviceAccount),
  });
  console.log("Firebase Admin inizializzato con successo.");
} catch (error) {
  console.error("Errore durante l'inizializzazione di Firebase Admin:", error);
  process.exit(1);
}

require("firebase/database"); // Aggiungi i servizi necessari, ad esempio il Realtime Database
const firebaseConfig = {
  apiKey: process.env.APIKEY_FIREBASE,
  authDomain: process.env.AUTHDOMAIN_FIREBASE,
  databaseURL: process.env.DATABASEURL_FIREBASE,
  projectId: process.env.PROJECTID_FIREBASE,
  storageBucket: process.env.STORAGEBUCKET_FIREBASE,
  messagingSenderId: process.env.MESSAGGINGSENDERID_FIREBASE,
  appId: process.env.APPID_FIREBASE,
};

const appFirebase = firebase.initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

module.exports = { adminFirebase, appFirebase, auth, onAuthStateChanged };
