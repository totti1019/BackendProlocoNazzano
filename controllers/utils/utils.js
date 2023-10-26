const fs = require("fs");
const path = require("path");

// Percorso assoluto del file
const filePath = path.join(__dirname, "sharedData.json");

// Funzione per il salvataggio dei dati in un file
function saveSharedData(data) {
  const dataToSave = JSON.stringify(data);
  fs.writeFileSync(filePath, dataToSave);
}

// Funzione per il caricamento dei dati da un file
function loadSharedData() {
  try {
    const loadedData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(loadedData);
  } catch (error) {
    // Gestisci eventuali errori durante il caricamento dei dati
    console.error("Errore nel caricamento dei dati:", error);
    return null;
  }
}

module.exports = {
  saveSharedData,
  loadSharedData,
};
