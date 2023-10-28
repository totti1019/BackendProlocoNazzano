// Import delle librerie e moduli necessari
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const usersRouters = require("./routers/users");
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

const httpServer = http.createServer(app);

// Configurazione del WebSocket con Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: "https://fabiocola.altervista.org",
    methods: ["GET", "POST"],
  },
});

// Configurazione delle impostazioni CORS con Express
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://fabiocola.altervista.org"
  );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Private-Network", true);
  res.setHeader("Access-Control-Max-Age", 7200);
  next();
});

// Impostazione del middleware per il parsing del corpo delle richieste come JSON
app.use(express.json());

// Collegamento delle rotte alle relative parti dell'app
app.use("/users", authenticateToken, usersRouters);
app.use("/auth", authRoutes);
app.use("/menu", menuRouters);
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
