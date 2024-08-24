const User = require("../schema/user.js");
const bcrypt = require("bcrypt");  //A library used for hashing passwords securely.
const jwt = require("jsonwebtoken");
const config = require("../config/jwtKey");

const resetPassword = async (req, res) => {  //it handle password reset request
  try {
    const { id, token } = req.params;
    const { password } = req.body;  //it contains the new password sent in the request body.
    const { _id } = jwt.verify(token, config.jwtPrivateKey);//it verify the jwt token

    const salt = await bcrypt.genSalt(10);//This function generates a salt for hashing the password and 10 salt round improve hashing complxcity 
    const hashPassword = await bcrypt.hash(password, salt); //it store the hash password to database

    try {
      const user = await User.findOne({ _id });

      if (user) {
        await User.findByIdAndUpdate({ _id }, { password: hashPassword });
        res.status(200).json({ message: "Password Updted" });
      }
    } catch (e) {
      res.status(404).json({ message: "Invalid User" });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json(error);
  }
};

module.exports = resetPassword;
