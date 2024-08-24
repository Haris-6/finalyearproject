const express = require("express");
const {
  postTruckLoaderAdds,
  fetchAllLoaders,
  getLoaderById,
  deleteLoaderAdd,
  getCurrentUserLoaderAdds,
  getAllLoaders,
  deleteAddForAdmin,
  updateLoaderAdd,
} = require("../controller/postLoaderAdd");
const { canPostLoaderAdd } = require("../middleware/canPostAdd");
const isAuth = require("../middleware/isAuth");
const route = express.Router();
const { upload } = require("../storage/storge");//it is used to handle file uploads 
route.post(
  "/postadd",
  isAuth,
  canPostLoaderAdd,   //checks if the user has permission to post an inventory item.
  upload.fields([
    {
      name: "cnicPicture",
      maxCount: 1,
    },
    {
      name: "licencePicture",
      maxCount: 1,
    },
    {
      name: "vehiclePicture",
      maxCount: 4,
    },
  ]),
  postTruckLoaderAdds  //he controller function that processes the request to add a new truck item.
);

route.get("/currentuser", isAuth, getCurrentUserLoaderAdds);//The controller function that fetches the truck items for the current user.

route.get("/all", fetchAllLoaders); // The controller function that fetches all truck items from the database.
route.get("/getAll", getAllLoaders); 
route.get("/:id", getLoaderById);  // The controller function that retrieves a single inventory item based on its ID.
route.delete("/:id", isAuth, deleteLoaderAdd);//The controller function that deletes the specified inventory item.

route.delete("/admin/delete/:id", deleteAddForAdmin);

route.put(
  "/updateadd/:id",
  isAuth,
  upload.fields([
    {
      name: "cnicPicture",
      maxCount: 1,
    },
    {
      name: "licencePicture",
      maxCount: 1,
    },
    {
      name: "vehiclePicture",
      maxCount: 4,
    },
  ]),
  updateLoaderAdd
);
module.exports = route;
