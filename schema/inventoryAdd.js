const mongoose = require("mongoose");  //it is used to interact with a MongoDB database in a more structured way by defining schemas and models

const inventoryAddSchema = new mongoose.Schema({
  inventorySize: {
    type: String,
    required: true,
  },
  inventoryWeight: {
    type: String,
    required: true,
  },
  ownerName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  countryName: {
    type: String,
    required: true,
  },
  stateName: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  inventoryType: {
    type: String,
    required: true,
  },
  inventoryPicture: [
    {
      type: String,
      required: true,
    },
  ],
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,//store data with unique id
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    default: "posted",
  },
});

const inventoryAddModel = new mongoose.model(
  "InventoryAdd",
  inventoryAddSchema
);
module.exports = inventoryAddModel;
