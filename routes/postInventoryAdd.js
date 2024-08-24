const express = require("express");
const {
  postInventoryAdds,
  fetchAllInventoryAdd,
  getInventoryById,
  deleteInventoryAdd,
  getCurrentUserInventoryAdds,
  shippedInventory,
  getAllActiveInventories,
  fetchAllInventoriesForAdmin,
  deleteInventoryForAdmin,
  updateInventoryAdd,
} = require("../controller/postInventoryAdd");
const { canPostInventoryAdd } = require("../middleware/canPostAdd");
const isAuth = require("../middleware/isAuth");
const route = express.Router();
const { upload } = require("../storage/storge");  //it is used to handle file uploads 
route.post(
  "/postadd",
  isAuth,
  canPostInventoryAdd,  //checks if the user has permission to post an inventory item.
  upload.fields([
    {
      name: "inventoryPicture",
      maxCount: 4,
    },
  ]),
  postInventoryAdds  //he controller function that processes the request to add a new inventory item.
);
route.get("/currentuser", isAuth, getCurrentUserInventoryAdds);//The controller function that fetches the inventory items for the current user.
// route.get("/active", isAuth, getAllActiveInventories)
route.get("/all", fetchAllInventoryAdd); // The controller function that fetches all inventory items from the database.
route.get("/:id", getInventoryById);  // The controller function that retrieves a single inventory item based on its ID.
route.delete("/:id", isAuth, deleteInventoryAdd);//The controller function that deletes the specified inventory item.
// route.put("/shipped", isAuth, shippedInventory);
route.get("/admin/all", fetchAllInventoriesForAdmin);
route.delete("/admin/delete/:id", deleteInventoryForAdmin);
route.put(
  "/updateadd/:id",
  isAuth,
  upload.fields([
    {
      name: "inventoryPicture",
      maxCount: 4,
    },
  ]),
  updateInventoryAdd
);

module.exports = route;
