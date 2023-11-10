/*const adminFirebase = require("firebase-admin");
const { getAuth, onAuthStateChanged } = require("firebase/auth");
const path = require("path");

const { initializeApp } = require("firebase/app");
// Configurazione di Firebase SDK (front-end)
const firebase = require("firebase/app");

// Inizializzazione di Firebase Admin
const credentialsPath = process.env.FIREBASE_CREDENTIALS_PATH;

if (!credentialsPath) {
  console.error(
    "La variabile d'ambiente FIREBASE_CREDENTIALS_PATH non è configurata."
  );
  process.exit(1);
}

const serviceAccount = require(path.join(__dirname, "../..", credentialsPath));

try {
  adminFirebase.initializeApp({
    credential: adminFirebase.credential.cert(serviceAccount),
    databaseURL: process.env.DATABASEURL_FIREBASE,
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

module.exports = { adminFirebase, appFirebase, auth, onAuthStateChanged }; */

require("firebase/auth");
const { initializeApp } = require("firebase/app");
const firebase = require("firebase/app");
const admin = require("firebase-admin");
const path = require("path");
const { getAuth } = require("firebase/auth");

const firebaseConfig = {
  apiKey: process.env.APIKEY_FIREBASE,
  authDomain: process.env.AUTHDOMAIN_FIREBASE,
  databaseURL: process.env.DATABASEURL_FIREBASE,
  projectId: process.env.PROJECTID_FIREBASE,
  storageBucket: process.env.STORAGEBUCKET_FIREBASE,
  messagingSenderId: process.env.MESSAGGINGSENDERID_FIREBASE,
  appId: process.env.APPID_FIREBASE,
};

// Inizializzazione di Firebase Admin
const credentialsPath = process.env.FIREBASE_CREDENTIALS_PATH;

if (!credentialsPath) {
  console.error(
    "La variabile d'ambiente FIREBASE_CREDENTIALS_PATH non è configurata."
  );
  process.exit(1);
}

const serviceAccount = require(path.join(__dirname, "../..", credentialsPath));

const appFirebase = firebase.initializeApp(firebaseConfig);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const auth = getAuth();

module.exports = { appFirebase, admin, auth };
