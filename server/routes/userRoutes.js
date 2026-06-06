const express = require('express');
const routes = express.Router();

const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

routes.get("/profile", authMiddleware, async (req, res) => {

    const user = await User.findById(req.userId).select("-password");

    res.json(user);
});

routes.get("/dashboard", authMiddleware, async (req, res) => {

    const user = await User.findById(req.userId).select("-password");

    res.json(user);
});

module.exports = routes;