const User = require("../schema/user");
const jwt = require("jsonwebtoken");
const config = require("../config/jwtKey");
const handleEmail = require("../utils/emailHandler"); //it is use to send email
require("dotenv").config();   //it allow get client url from code .env

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email }); // it is use to find user from datebase with email 
    if (!user) {
      res.status(400).json({ message: "User does't exist." });
      return;
    }

    const token = jwt.sign({ _id: user._id }, config.jwtPrivateKey);//if user exist then we provide jwt token to user

    const subject = "Reset your Password";   //it is email body that sent to user
   const text = `${process.env.CLIENT_URL}/reset-password/${user?._id}/${token}     
      `;

    await handleEmail(email, subject, text);  //this function send email to user

    return res
      .status(200)
      .json({ message: "Password reset instructions sent to your email." });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = forgotPassword;
