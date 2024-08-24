const express = require("express");
const route = express.Router();
const forgotPassword = require("../controller/forgotPassword");
const resetPassword = require("../controller/resetPassword");

route.post("/forgot", forgotPassword);
route.post('/reset/:id/:token', resetPassword)

module.exports = route;
