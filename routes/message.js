const express = require("express");
const route = express.Router();

const {sendMessage,getMessages, getChatUser} = require("../controller/message");
const isAuth = require("../middleware/isAuth") //thisfunctions are used to process requests before they reach the route handlers. and check user is login or not 

route.post('/send/:id', isAuth, sendMessage);
route.get('/user',isAuth, getChatUser)
route.get('/:id', isAuth, getMessages);

module.exports = route