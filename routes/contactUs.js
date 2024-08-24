const express = require("express");
const route = express.Router();

const {
  getContact,
  contactMessage,
  getQueryById,
  sendEmailMessage,
  deleteQueryById,
} = require("../controller/contactUs");

route.post("/admin/send/email", sendEmailMessage);
route.post("/", contactMessage);
route.get("/all", getContact);
route.get("/admin/:id", getQueryById);
route.delete("/admin/delete/:id", deleteQueryById);

module.exports = route;
