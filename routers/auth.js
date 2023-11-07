const express = require("express");
const { login, loginAnonymous } = require("../controllers/auth");

const { validationToken } = require("../middlewares/authFirebase");

const validateFields = require("../middlewares/validateFields");

const router = express.Router();

router.post("/login", validateFields, login);
router.post("/", validateFields, loginAnonymous);
router.post("/validationToken", validateFields, validationToken);

module.exports = router;
