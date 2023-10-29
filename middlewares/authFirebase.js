const { getAuth, signInWithCustomToken } = require("firebase/auth");

// Middleware per verificare l'autenticazione prima di consentire una chiamata API
const requireAuthFirebase = async (req, res, next) => {
  try {
    console.error("CERCO IL TOKEN ", req.headers);
    //const authHeader = req.headers["authorization"];
    // console.error(authHeader);
    // const token = authHeader && authHeader.split(" ")[1];

    // const auth = getAuth();

    /* await signInWithCustomToken(auth, token)
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
      }); */
  } catch (error) {
    console.log(error);
    res.status(401).json({
      code: res.statusCode,
      esito: false,
      message: "Utente non autenticato",
    });
  }
};

module.exports = {
  requireAuthFirebase,
};
