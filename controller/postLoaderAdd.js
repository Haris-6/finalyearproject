const Joi = require("joi");
const { default: mongoose } = require("mongoose");
const VEHICLEADD = require("../schema/vehicleAdd");

const postTruckLoaderAdds = async (req, res, next) => { //function for posting truck ads
  try {
    const result = validateVehicleAdd(req.body); //validates the request data against a Joi schema. 
    if (result.error) {
      res.status(400).send({ message: result.error.details[0].message });
      return;
    }
    const files = req.files;  //retrieve upload files


    if (!files) {
      return res
        .status(400)
        .json({ message: "ERROR: uploading, file! try again" });
    }
    const cnicPicture = files.cnicPicture ? files.cnicPicture[0].path : null;
    const licencePicture = files.licencePicture
      ? files.licencePicture[0].path
      : null;
    const vehiclePicture = files.vehiclePicture
      ? files.vehiclePicture.map((file) => file.path)
      : [];

    const truckAdd = new VEHICLEADD({
      ...req.body,
      cnicPicture,
      licencePicture,
      vehiclePicture,
      postedBy: req.user._id,
    });
    const doc = await truckAdd.save(); //save data in mongodb collections
    res.status(200).json({
      message: "Add Posted Successfully",
      data: doc,
      status: 200,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const fetchAllLoaders = async (req, res) => {  //get all inventory ads
  try {
    const loaders = await VEHICLEADD.find({ status: "posted" });
    res.status(200).json({
      message: "loaders fetched successfully",
      data: loaders,
      status: 200,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getLoaderById = async (req, res) => {
  const { id } = req.params;   //Extracts the inventory ID from the request parameters.
  try {
    const loader = await VEHICLEADD.findById({ _id: id }).populate("postedBy");
    if (!loader) {
      res.status(200).json({
        message: "Invalid Id",
        data: loader,
        status: 402,
      });
      return;
    }
    res.status(200).json({
      message: "Fetched successfully",
      data: loader,
      status: 200,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteLoaderAdd = async (req, res) => {
  const { id } = req.params;
  try {
    const add = await VEHICLEADD.findOne({ _id: id }); 
    if (!add) {
      res.status(200).json({
        message: "Invalid Id",
        status: 402,
      });
      return;
    }

    if (add.postedBy.toString() !== req.user._id.toString()) { //check user are same whose post ad an check authorization
      res.status(403).json({
        message: "UnAuthorized! you can not perform operation",
        status: 403,
      });
      return;
    }
    const loader = await VEHICLEADD.findByIdAndDelete({ _id: id });

    res.status(200).json({
      message: "Deleted successfully",
      data: loader,
      status: 200,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const updateLoaderAdd = async (req, res) => {
  const { id } = req.params;
  try {
    const add = await VEHICLEADD.findOne({ _id: id });
    if (!add) {
      res.status(200).json({
        message: "Invalid Id",
        status: 402,
      });
      return;
    }
    if (add.postedBy.toString() !== req.user._id.toString()) {
      res.status(403).json({
        message: "UnAuthorized! you can not perform operation",
        status: 403,
      });
      return;
    }

    const file = req.files;

    if (!file) {
      return res
        .status(400)
        .json({ message: "ERROR: uploading, file! try again" });
    }
    const cnicPicture = file.cnicPicture ? file.cnicPicture[0].path : null;
    const licencePicture = file.licencePicture
      ? file.licencePicture[0].path
      : null;
    const vehiclePicture = file.vehiclePicture // Keep existing pictures by default
      ? file.vehiclePicture.map((file) => file.path)
      : [];

    const loader = await VEHICLEADD.findByIdAndUpdate(
      { _id: id },
      {
        ...req.body,
        cnicPicture,
        licencePicture,
        vehiclePicture,
      },
      { new: true }
    );

    res.status(200).json({
      message: "Updated successfully",
      data: loader,
      status: 200,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const getCurrentUserLoaderAdds = async (req, res) => {  //get inventory ads posted by user
  const userId = new mongoose.Types.ObjectId(req.user._id); //Converts the user's ID to a Mongoose ObjectId type.

  try {
    const loader = await VEHICLEADD.find({
      postedBy: userId,
    });
    if (!loader) {
      res.status(200).json({
        message: "No Add posted",
        data: loader,
        status: 402,
      });
      return;
    }
    res.status(200).json({
      message: "Fetched successfully",
      data: loader,
      status: 200,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const getAllLoaders = async (req, res) => {
  try {
    const loaders = await VEHICLEADD.find();
    res.status(200).json(loaders);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteAddForAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    const add = await VEHICLEADD.findByIdAndDelete({ _id: id });
    res.status(200).json({
      message: "Deleted successfully",
      data: add,
      status: 200,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const validateVehicleAdd = (data) => {
  const schema = Joi.object({
    vehicleName: Joi.string().required(),
    vehicleModel: Joi.string().required(),
    vehicleNumber: Joi.string().required(),
    ownerName: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    ownerCnic: Joi.string().required(),
    licenceNumber: Joi.string().required(),
    countryName: Joi.string().required(),
    stateName: Joi.string().required(),
    city: Joi.string().required(),
    location: Joi.string().required(),
    vehicleType: Joi.string().required(),
  });

  return schema.validate(data);
};

module.exports = {
  postTruckLoaderAdds,
  fetchAllLoaders,
  getLoaderById,
  deleteLoaderAdd,
  getCurrentUserLoaderAdds,
  getAllLoaders,
  deleteAddForAdmin,
  updateLoaderAdd,
};
