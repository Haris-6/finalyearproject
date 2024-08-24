const INVENTORYADD = require("../schema/inventoryAdd");
const vehicleAdd = require("../schema/vehicleAdd");
const User = require("../schema/user");
const Booking = require("../schema/booking");

const getTotalRecord = async (req, res) => {  // This function is used to handle an incoming HTTP request and send back a response.
  try {
    const [
      totalInventories,
      totalLoader,
      totalUsers,
      bookedOrder,
      loader,
      inventory,
      loaderCityRatio,
      inventoryCityRatio,
    ] = await Promise.all([  //it is use to handle all asyn function concurrently and await ensure that all promises proceeded
      INVENTORYADD.countDocuments(), //tt count total number of record of inventory add
      vehicleAdd.countDocuments(),
      User.countDocuments(),
      Booking.countDocuments(),
      vehicleAdd.aggregate([
        {
          $group: {    //it is use to group the record by statename and count how many record for each state
            _id: "$stateName",
            count: { $sum: 1 },
          },
        },
      ]),
      INVENTORYADD.aggregate([
        {
          $group: {
            _id: "$stateName",
            count: { $sum: 1 },
          },
        },
      ]),
      vehicleAdd.aggregate([
        {
          $group: {
            _id: "$city",  //it is use to group the record by city and count how many record for each city
            count: { $sum: 1 },
          },
        },
      ]),
      INVENTORYADD.aggregate([
        {
          $group: {
            _id: "$city",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const registeredLoaders = loader.map((obj) => ({ //result of aggregate function in new object registerloader
      label: obj._id,  //it store state or city name
      value: obj.count,   //count orm record store in value
    }));

    const registeredInventories = inventory.map((obj) => ({
      label: obj._id,
      value: obj.count,
    }));

    const registeredLoadersCityRation = loaderCityRatio.map((obj) => ({
      label: obj._id,
      value: obj.count,
    }));

    const registeredInventoriesCityRation = inventoryCityRatio.map((obj) => ({
      label: obj._id,
      value: obj.count,
    }));

    const totalRecord = {   //store all previous result in object
      inventory: totalInventories,
      loaders: totalLoader,
      users: totalUsers,
      booking: bookedOrder,
      loadersData: registeredLoaders,
      inventoryData: registeredInventories,
      loadersCityratio: registeredLoadersCityRation,
      inventoryCityratio: registeredInventoriesCityRation,
    };

    res.status(200).json({  //this block send respose to client with totalrecord data
      message: "Total record fetched successfully",
      data: totalRecord,
      status: 200,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = { getTotalRecord };
