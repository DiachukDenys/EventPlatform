const express = require("express");
const router = express.Router();
const User = require("../models/User"); // твоя модель користувача
const { getUsers } = require("../controllers/statsController");


router.get("/user-count", getUsers);

module.exports = router;
