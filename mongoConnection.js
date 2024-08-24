const mongoose = require("mongoose");
require("dotenv").config();

const connectToDB = async () => {
  try {
    const result = await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB successfully!");
    return result;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); 
  }
};

module.exports = connectToDB;
