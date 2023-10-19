const express = require("express");

const http = require("http");
const { Server } = require("socket.io");

const dotenv = require("dotenv");

const usersRouters = require("./routers/users");

const authRoutes = require("./routers/auth");

const { authenticateToken } = require("./middlewares/auth");

const menuRouters = require("./routers/menu");

const numeratoreRouters = require("./routers/numeratore");

const app = express();

const configureWebSocket = require("./middlewares/websocket");

dotenv.config();
const PORT = process.env.PORT || 3000;

// Middleware per abilitare CORS
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

app.use(express.json());

app.use("/users", authenticateToken, usersRouters);
app.use("/auth", authRoutes);
app.use("/menu", menuRouters);
app.use("/numeratore", numeratoreRouters);

app.get("/", (req, res) => {
  res.send("Benvenuto nella homepage della Proloco Nazzano");
});

const server = http.createServer(app);
const io = new Server(server);

// Configura il server WebSocket
configureWebSocket(io); // Passa l'istanza di io al modulo di configurazione

app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`); // npm run dev
});
