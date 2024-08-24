const USER = require("../schema/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");
// const jwt = require("jsonwebtoken");
// const config = require("../config/jwtKey");
// const _ = require("lodash");

const updateProfile1 = async (req, res) => {  //it check the input value validation
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await USER.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("User not found");

  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.address = req.body.address;

  const result = await user.save();  //update value with new value

  res.status(200).json({
    message: "Profile updated successfully",
    data: result,
  });
};

const updateAdminPassword1 = async (req, res) => {
  const user = await USER.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("User not found");
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.password, salt);
  const result = await user.save();
  res.status(200).json({
    message: "Password updated successfully",
    data: result,
  });
};

module.exports = { updateProfile1, updateAdminPassword1 };

const validate = (user) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    address: Joi.string().required(),
    email: Joi.string().required().email(),
  });
  return schema.validate(user);
};
