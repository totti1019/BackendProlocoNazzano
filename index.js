const express = require("express");

const dotenv = require("dotenv");

const usersRouters = require("./routers/users");

const authRoutes = require("./routers/auth");

const { authenticateToken } = require("./middlewares/auth");

const menuRouters = require("./routers/menu");

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/users", authenticateToken, usersRouters);
app.use("/auth", authRoutes);
app.use("/menu", menuRouters);

app.get("/", (req, res) => {
  res.send("Benvenuto nella homepage della Proloco Nazzano");
});

app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`); // npm run dev
});
