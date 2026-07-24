import express from "express";
import { isAuth, isSeller } from "../middlewares/isAuth.js";
import uploadFile from "../middlewares/multer.js";
import { addMenuItem, deleteMenuItem, getAllItems, toggleMenuItemAvailablity } from "../controllers/menuItem.js";
import { singleRestaurant, getNearByRestaurant } from "../controllers/restaurant.js";
const router = express.Router();

router.post("/new", uploadFile, isAuth, isSeller, addMenuItem);
router.get("/all/:restaurantId", isAuth, getAllItems);
router.delete("/:id", isAuth, isSeller, deleteMenuItem);
router.put("/status/:id", isAuth, isSeller, toggleMenuItemAvailablity);
router.get("/", isAuth, singleRestaurant);
router.get("/all", isAuth, getNearByRestaurant);

export default router;