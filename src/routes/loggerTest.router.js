const express = require("express");
const router = express.Router();
const loggerControllers = require("../controllers/loggerControllers.js")

router.get('/', loggerControllers.loggerTest)

module.exports  = router; 