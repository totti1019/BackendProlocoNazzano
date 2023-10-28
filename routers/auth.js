const express = require("express");
const {
  register,
  loginGoogle,
  login,
  loginAnonymous,
} = require("../controllers/auth");
const validateFields = require("../middlewares/validateFields");

const router = express.Router();

router.post("/register", validateFields, register);
router.post("/loginGoogle", validateFields, loginGoogle);
router.post("/login", validateFields, login);
router.post("/", validateFields, loginAnonymous);

module.exports = router;
