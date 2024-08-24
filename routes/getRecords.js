const express = require("express");
const { getTotalRecord } = require("../controller/getRecord");
const route = express.Router();  //it is express function use to route or nevigate functionalty

route.get("/total", getTotalRecord);

module.exports = route;
