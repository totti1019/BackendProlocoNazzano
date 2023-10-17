const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);
  //.status(401)
  //.json({ code: res.statusCode, message: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
    console.log(error);
    if (error) return res.sendStatus(403);
    //res.status(403).json({ code: res.statusCode, message: "Errore" });

    req.user = user;

    next();
  });
};

module.exports = {
  authenticateToken,
};
