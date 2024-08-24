const VEHICLEADD = require('../schema/vehicleAdd');
const INVENTORYADD = require('../schema/inventoryAdd');
const canPostLoaderAdd = async (req, res, next) => {
  const postedAdds = await VEHICLEADD.find({ postedBy: req.user._id });
  if (postedAdds.length >= 4) {
    res.status(400).json({
      message: "You can't post more than 4 adds",
      status: 400,
    });
    return;
  }
  next();  //this function allow to call next middleware function if user not post more than 4 post
};

const canPostInventoryAdd = async (req, res, next) => {
  const postedAdds = await INVENTORYADD.find({ postedBy: req.user._id });
  if (postedAdds.length >= 3) {
    res.status(400).json({
      message: "You can't post more than 3 adds",
      status: 400,
    });
    return;
  }
  next()   //: If the user has posted fewer than 3 ads, the middleware allows the request to proceed by calling next().
};

module.exports = { canPostLoaderAdd, canPostInventoryAdd };
