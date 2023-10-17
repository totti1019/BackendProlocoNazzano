const mysql = require("mysql2");
const { Menu } = require("../models/menu");

const getAllMenu = async (req, res) => {
  // Configura la connessione al tuo database
  const connection = mysql.createConnection({
    host: process.env.HOST_PROLOCO,
    user: process.env.USER_PROLOCO,
    password: process.env.PASSWORD_PROLOCO,
    database: process.env.DATABASE_PROLOCO,
  });

  try {
    // Connessione al database
    connection.connect((err) => {
      if (err) {
        console.error("Errore di connessione al database: " + err);
        return res.status(404).json({
          code: res.statusCode,
          message: "Errore di connessione al database: " + err.stack,
        });
      }
      console.log("Connessione al database riuscita.");

      // Esegui una query di selezione
      const sqlQuery = `SELECT * FROM ${process.env.TABLE_NAME_MENU}`;
      connection.query(sqlQuery, (err, results) => {
        if (err) {
          console.error(
            "Errore durante l'esecuzione della query: " + err.message
          );

          return res.status(404).json({
            code: res.statusCode,
            message: "Errore durante l'esecuzione della query: " + err.message,
          });
        }

        // I risultati della query sono nell'array "results"
        console.log("Risultati della query:", results);
        // Chiudi la connessione al database quando hai finito
        connection.end();
      });
    });

    //const menu = await Menu.find();
    //res.status(200).json(menu);
  } catch (error) {
    res.status(404).json({ code: res.statusCode, message: error.message });
  }
};

module.exports = {
  getAllMenu,
};
