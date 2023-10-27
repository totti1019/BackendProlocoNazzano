const express = require("express");

const { getPercorsoSagra } = require("../controllers/utils");

const router = express.Router();

router.post("/", getPercorsoSagra);

module.exports = router;
