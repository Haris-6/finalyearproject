const mongoose = require("mongoose");

const vehicleAddSchema = new mongoose.Schema({
  vehicleName: {
    type: String,
    required: true,
  },
  vehicleModel: {
    type: String,
    required: true,
  },
  vehicleNumber: {
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
  ownerCnic: {
    type: String,
    required: true,
  },
  cnicPicture: {
    type: String,
    required: true,
  },

  licenceNumber: {
    type: String,
    required: true,
  },
  licencePicture: {
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
  vehicleType: {
    type: String,
    required: true,
  },
  vehiclePicture: [
    {
      type: String,
      required: true,
    },
  ],
  postedBy: {
    ref: "User",
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  status: {
    type: String,
    default: "posted",
  },
  orderId: {
    ref: "Booking",
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },
});

const vehicleAddModel = new mongoose.model("VehicleAdd", vehicleAddSchema);
module.exports = vehicleAddModel;
