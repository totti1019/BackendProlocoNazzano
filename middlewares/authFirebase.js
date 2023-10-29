const { getAuth, signInWithCustomToken } = require("firebase/auth");

// Middleware per verificare l'autenticazione prima di consentire una chiamata API
/*const requireAuthFirebase = async (req, res, next) => {
  try {
    console.error("CERCO IL ROKEN ", req.headers.authorization);
    const authHeader = req.headers["authorization"];
    console.error(authHeader);
    const token = authHeader && authHeader.split(" ")[1];

    const auth = getAuth();

    await signInWithCustomToken(auth, token)
      .then((user) => {
        if (user) {
          next();
        } else {
          // L'utente non è autenticato, restituisci un errore o reindirizza all'accesso
          res.status(401).json({
            code: res.statusCode,
            esito: false,
            message: "Utente non autenticato",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(401).json({
          code: res.statusCode,
          esito: false,
          message: "Utente non autenticato",
        });
      });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      code: res.statusCode,
      esito: false,
      message: "Utente non autenticato",
    });
  }
}; */
const requireAuthFirebase = async (req, res, next) => {
  try {
    // Verifica se è una richiesta POST e se l'header "Authorization" è presente
    console.error(req.method);
    if (req.method === "POST") {
      console.error(req.headers);
      //const token = req.headers.authorization;
      //console.log("Token:", token);
      // Continua con la verifica del token o qualsiasi altra logica necessaria
    } else {
      // Gestisci il caso in cui l'header "Authorization" non sia presente
      // Puoi inviare una risposta di errore o eseguire altre azioni necessarie
    }
    // Continua con il middleware successivo o la gestione della richiesta
    next();
  } catch (error) {
    // Gestisci eventuali errori
    console.error(error);
    // Invia una risposta di errore se necessario
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  requireAuthFirebase,
};
