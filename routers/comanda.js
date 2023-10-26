const express = require("express");

const { updateNumeroComanda, saveComanda } = require("../controllers/comanda");

const router = express.Router();

router.post("/", updateNumeroComanda);
router.post("/save", saveComanda);

module.exports = router;
