const mongoose = require("mongoose");  //it import mongoose library

const contactUsSchema = new mongoose.Schema(  //this schema define how data store in daabase
  {
    email: {
      type: String,
      required: true,
    },
    name: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const ContactUsModal = mongoose.model("Contactus", contactUsSchema);   //it create modal name in database
module.exports = ContactUsModal;
