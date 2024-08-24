const jwt = require("jsonwebtoken");  //it is used for creating and verifying JSON Web Tokens (JWT).
const config = require("../config/jwtKey");  //get the secret jwt key to sign or verify jwt


// middleware to check that a user is authorize to enter app
function isAuth(req, res, next) {
  const token = req.header('authorization')?.split(" ")[1];  //it attempts to extract a JWT from the Authorization header of the incoming request
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    const decoded = jwt.verify(token, config.jwtPrivateKey); //verfy that token is valid or not 
    req.user = decoded;  //if token valid user information decode and store init
    next();  //this pass controll to next middleware function
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
}

module.exports = isAuth;