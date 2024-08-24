require("dotenv").config();  //this is use to load envirment variable

const config = {
    jwtPrivateKey:process.env.JWT_KEY
}

module.exports = config