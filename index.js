// Import delle librerie e moduli necessari
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const authRoutes = require("./routers/auth");
const { authenticateToken } = require("./middlewares/auth");
const menuRouters = require("./routers/menu");
const numeratoreRouters = require("./routers/numeratore");
const comandaRouters = require("./routers/comanda");
const utilsRouters = require("./routers/utils");
const { requireAuthFirebase } = require("./middlewares/authFirebase");

const configureWebSocket = require("./middlewares/websocket");

dotenv.config();

const PORT = process.env.PORT || 3000;

// Configura l'app Express
const app = express();
app.use(express.json());

const httpServer = http.createServer(app);

// Configurazione del WebSocket con Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: "https://fabiocola.altervista.org",
    methods: ["GET", "POST"],
  },
});

// Middleware per il CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://fabiocola.altervista.org");

  if (req.headers["access-control-request-method"]) {
    res.header(
      "Access-Control-Allow-Methods",
      req.headers["access-control-request-method"]
    );
  }
  if (req.headers["access-control-request-headers"]) {
    res.header(
      "Access-Control-Allow-Headers",
      req.headers["access-control-request-headers"]
    );
  }

  if (req.method == "OPTIONS") {
    res.sendStatus(200); // Gestione delle richieste OPTIONS
  } else {
    next();
  }
});

// Collegamento delle rotte alle relative parti dell'app
app.use("/auth", authRoutes);
app.use("/menu", requireAuthFirebase, menuRouters);
app.use("/numeratore", requireAuthFirebase, numeratoreRouters);
app.use("/comanda", requireAuthFirebase, comandaRouters);
app.use("/percorso", utilsRouters);

// Rotta di benvenuto
app.get("/", (req, res) => {
  res.send("Benvenuto nella homepage della Proloco Nazzano");
});

// Passa l'istanza di io al modulo di configurazione
configureWebSocket(io);

// Inizializza il server HTTP e WebSocket
httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
