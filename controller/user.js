const USER = require("../schema/user");//it define datbase schema
const bcrypt = require("bcrypt");  //ibrary, which is used for hashing passwords.
const Joi = require("joi");  //library used for data validation.
const jwt = require("jsonwebtoken"); //library for creating and verifying JSON Web Tokens (JWTs), often used for user authentication.
const config = require("../config/jwtKey"); //it contains the secret key for signing JWTs.
const _ = require("lodash");//provides utility functions for working with objects, arrays, etc.

const createUser = async (req, res) => {  //this function Handles user registration.
  const result = validateUser(req.body);  //it check the user data validation
  if (result.error) {
    res.status(400).json({ message: result.error.details[0].message });
    return;
  }

  const user = await USER.findOne({ email: req.body.email });
  if (user) {
    res.status(400).json({ message: "Email Already register " });
    return;
  } else {
    let user = new USER({
      ...req.body,
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    const token = jwt.sign({ _id: user._id }, config.jwtPrivateKey);
    try {
      user = await user.save();
      res.status(201).json({
        message: "user created successfully",
        data: _.pick(user, [
          "_id",
          "firstName",
          "lastName",
          "email",
          "role",
          "address",
        ]),
        token,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }
};

const authUser = async (req, res) => {  //Handles user login this function
  try {
    const result = validateLoginData(req.body);
    if (result.error) {
      res.status(400).send({ message: result.error.details[0].message });
      return;
    }
    const user = await USER.findOne({ email: req.body.email });
    if (!user) {
      res.status(400).json({ message: "Invalid username or Email" });
      return;
    } else {
      const validate = await bcrypt.compare(req.body.password, user.password);
      if (!validate) {
        return res
          .status(400)
          .json({ message: "Invalid user password" });
      }
      const token = jwt.sign({ _id: user._id }, config.jwtPrivateKey);
      res
        .cookie("expressToken", token, {
          expire: 360000 + Date.now(),
          httpOnly: false,
        })
        .status(200)
        .send({
          message: "Login Successsfully...",
          data: _.pick(user, [
            "_id",
            "firstName",
            "lastName",
            "email",
            "role",
            "address",
          ]),
          token: token,
        });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const getAllUsers = async (req, res) => {  //find all user data except admin
  try {
    const users = await USER.find({ role: { $ne: "admin" } });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await USER.findByIdAndDelete(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
};

const adminLogin = async (req, res) => {
  try {
    const result = validateLoginData(req.body);
    if (result.error) {
      res.status(400).send({ message: result.error.details[0].message });
      return;
    }
    const user = await USER.findOne({ email: req.body.email });
    if (!user || user.role !== "admin") {
      console.log("INVALID USER");
      res.status(400).json({ message: "Invalid username or Email" });
      return;
    } else {
      const validate = await bcrypt.compare(req.body.password, user.password);
      if (!validate) {
        return res
          .status(400)
          .json({ message: "Invalid user password" });
      }
      const token = jwt.sign({ _id: user._id }, config.jwtPrivateKey);
      res
        .cookie("expressToken", token, { //The token is stored in a cookie, and a success response with user details and the token is sent.
          expire: 360000 + Date.now(),
          httpOnly: false,
        })
        .status(200)
        .send({
          message: "Login Successsfully...",
          data: _.pick(user, [
            "_id",
            "firstName",
            "lastName",
            "email",
            "role",
            "address",
            "phoneNumber",
          ]),
          token: token,
        });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

function validateUser(user) {
  const { firstName, lastName, email, password, address, phoneNumber } = user;

  const schema = Joi.object({
    firstName: Joi.string().required(),  //joi use to check the data type is same as database given value like string,number etc
    lastName: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(8).required(),
    address: Joi.string().required(),
    phoneNumber: Joi.number().required(),
  });

  return schema.validate({
    firstName,
    lastName,
    email,
    password,
    address,
    phoneNumber,
  });
}

function validateLoginData(user) {
  let email = user.email;
  let password = user.password;

  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  });

  return schema.validate({ email, password });
}

module.exports = { createUser, authUser, getAllUsers, deleteUser, adminLogin };
