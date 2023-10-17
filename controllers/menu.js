const mysql = require("mysql2/promise");
const { Menu } = require("../models/menu");

const getAllMenu = async (req, res) => {
  let connection = null; // Inizializza la variabile connection a null
  try {
    // Configura la connessione al tuo database su Altervista
    connection = await mysql.createConnection({
      host: process.env.HOST_PROLOCO,
      user: process.env.USER_PROLOCO,
      password: process.env.PASSWORD_PROLOCO,
      database: process.env.DATABASE_PROLOCO,
    });

    // Esegui una query di selezione
    const [results, fields] = await connection.execute(
      `SELECT * FROM ${process.env.TABLE_NAME_MENU}`
    );

    // Chiudi la connessione al database quando hai finito
    await connection.end();

    console.log("Risultati della query:", results);

    res.status(200).json(results);
  } catch (error) {
    console.error("Errore durante l'esecuzione della query:", error);

    res.status(500).json({
      code: res.statusCode,
      message: "Errore durante l'esecuzione della query",
      error: error.message, // Includi i dettagli dell'errore nella risposta
    });
  } finally {
    // Gestisci la chiusura della connessione in caso di errore
    if (connection) {
      try {
        await connection.end();
      } catch (err) {
        console.error("Errore durante la chiusura della connessione:", err);
      }
    }
  }
};

module.exports = {
  getAllMenu,
};
