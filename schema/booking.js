const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    loaderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VehicleAdd",
      required: true,
    },
    inventoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InventoryAdd",
      required: true,
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
