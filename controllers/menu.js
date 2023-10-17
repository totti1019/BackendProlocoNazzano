const mysql = require("mysql2/promise");
const { Menu } = require("../models/menu");

const getAllMenu = async (req, res) => {
  try {
    // Configura la connessione al tuo database
    const connection = await mysql.createConnection({
      host: process.env.HOST_FABIO,
      user: process.env.USER_FABIO,
      password: "",
      database: process.env.DATABASE_FABIO,
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
    console.error("Errore durante l'esecuzione della query: " + error.message);
    res.status(500).json({
      code: res.statusCode,
      message: "Errore durante l'esecuzione della query: " + error.message,
    });
  }
};

module.exports = {
  getAllMenu,
};
