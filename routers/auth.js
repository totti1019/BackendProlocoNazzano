const express = require("express");
const {
  register,
  loginGoogle,
  login,
  loginAnonymous,
} = require("../controllers/auth");

const { validationToken } = require("../middlewares/authFirebase");

const validateFields = require("../middlewares/validateFields");

const router = express.Router();

router.post("/register", validateFields, register);
router.post("/loginGoogle", validateFields, loginGoogle);
router.post("/login", validateFields, login);
router.post("/", validateFields, loginAnonymous);
router.post("/validationToken", validateFields, validationToken);

module.exports = router;
