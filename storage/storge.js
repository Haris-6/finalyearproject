const { CloudinaryStorage } = require("multer-storage-cloudinary"); //this storage use to directly send picture to storage
const cloudinary = require("cloudinary").v2;  //this library used to interact with the Cloudinary API.
const multer = require("multer");  //this middleware use to upload file
require("dotenv").config();  //this module load enviorment variavle from .env

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "loadify",
    allowedFormats: ["jpeg", "png", "jpg"],
  },
});

const upload = multer({ storage });  //It will handle file uploads and store them directly in Cloudinary.
module.exports = { storage, upload };
