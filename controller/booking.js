const mongoose = require("mongoose");
const INVENTORYADD = require("../schema/inventoryAdd");
const Booking = require("../schema/booking");
const LOADER = require("../schema/vehicleAdd");

const shippedInventory = async (req, res) => {
  try {
    const { inventoryId, loaderId } = req.body;

    const booking = new Booking({
      loaderId,
      inventoryId,
    });

    let inventory = await INVENTORYADD.findOne({ _id: inventoryId });
    if (!inventory) {
      return res.status(404).json({
        message: "Inventory not found",
        status: 404,
      });
    }
    inventory.status = "shipped";

    let loader = await LOADER.findOne({ _id: loaderId });
    loader.status = "booked";
    loader.orderId = booking._id;

    await Promise.all([booking.save(), loader.save(), inventory.save()]);

    res.status(200).json({
      message: "Inventory Shipped Successfully",
      status: 200,
      data: "inventory",
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const getAllActiveInventories = async (req, res) => {
  try {
    const userId = req.user?._id;
    const inventories = await INVENTORYADD.find({
      status: { $ne: "posted" },
      postedBy: userId,
    });

    // get user loader order
    const loader = await LOADER.findOne({
      postedBy: req.user?._id,
    }).populate({
      path: "orderId",
      populate: {
        path: "inventoryId",
        model: "InventoryAdd",
      },
    });

    let order = loader;

    let active = {
      inventories: inventories,
      loader: order ? order : null,
    };
    res.status(200).json({
      data: active,
      message: "order fetched successfully",
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const completeOrder = async (req, res) => {
  try {
    const { loaderId, inventoryId } = req.body;
    const booking = await Booking.deleteOne({ inventoryId, loaderId });
    let inventory = await INVENTORYADD.findOne({ _id: inventoryId });
    if (!inventory) {
      return res.status(404).json({
        message: "Inventory not found",
        status: 404,
      });
    }
    inventory.status = "delivered";

    let loader = await LOADER.findOne({ _id: loaderId });
    loader.status = "posted";
    loader.orderId = null;

    await Promise.all([loader.save(), inventory.save()]);
    res.status(200).json({
      message: "order completed successfully",
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const getAllLoaderOrder = async (req, res) => {
  try {
    const loader = await LOADER.findOne({
      postedBy: req.user?._id,
    }).populate({
      path: "orderId",
      populate: {
        path: "inventoryId",
        model: "InventoryAdd",
      },
    });

    if (!loader) {
      res.status(200).json({
        message: "No Active Order",
        data: null,
        status: 200,
      });
      return;
    }

    // const order = loader?.
    const order = loader?.orderId?.inventoryId;
    res.status(200).json({
      data: order,
      message: "order fetched successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = {
  shippedInventory,
  getAllActiveInventories,
  completeOrder,
  //   getAllLoaderOrder,
};
