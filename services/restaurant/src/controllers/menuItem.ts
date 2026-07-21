import TryCatch from "../middlewares/trycatch.js";
import { AuthenticatedRequest } from "../middlewares/isAuth.js";
import MenuItem from "../models/MenuItems.js";
import getbuffer from "../config/datauri.js";
import axios from "axios";
import mongoose from "mongoose";



export const addMenuItem = TryCatch(async (req: AuthenticatedRequest, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({
            message: "Unauthorized",
        })
    }

    if (!user.restaurantId) {
        return res.status(403).json({
            message: "You don't have a restaurant",
        })
    }

    const { description, price, name } = req.body;
    const file = req.file;

    if (!description || !price || !name || !file) {
        return res.status(400).json({
            message: "Please provide all details",
        })
    }
    const fileBuffer = getbuffer(file);
    if (!fileBuffer?.content) {
        return res.status(500).json({
            message: "Faild to create buffer",
        })
    }

    let uploadResult;
    try {
        const response = await axios.post(
            `${process.env.UTILS_SERVICES}/api/upload`,
            { buffer: fileBuffer.content }
        );
        uploadResult = response.data;
    } catch (error: any) {
        console.error("Error uploading to utils service:", error.response?.data || error.message);
        return res.status(error.response?.status || 500).json({
            message: error.response?.data?.message || "Failed to upload image to utility service",
        });
    }

    const item = await MenuItem.create({
        restaurantId: user?.restaurantId,
        description,
        price,
        name,
        image: uploadResult.url,
        isAvailable: true,
    })

    return res.status(201).json({
        message: "Menu Item created successfully",
        item
    })

})

export const getAllItems = TryCatch(async (req: AuthenticatedRequest, res) => {

    const { restaurantId } = req.params;

    if (!restaurantId) {
        return res.status(400).json({
            message: "Please provide restaurant ID",
        })
    }
    const items = await MenuItem.find({
        restaurantId: restaurantId,
    })
    return res.status(200).json({
        items
    })
})


export const deleteMenuItem = TryCatch(async (req: AuthenticatedRequest, res) => {
    const id = req.params.id as string;
    if (!req.user) {
        return res.status(401).json({
            message: "unauthorized",
        })
    }
    if (!req.user.restaurantId) {
        return res.status(403).json({
            message: "You don't have a restaurant",
        })
    }
    const item = await MenuItem.findOneAndDelete({
        _id: new mongoose.Types.ObjectId(id),
        restaurantId: new mongoose.Types.ObjectId(req.user.restaurantId),
    });
    if (!item) {
        return res.status(404).json({
            message: "Item not found",
        })
    }
    return res.status(200).json({
        message: "Menu Item deleted successfully",
    })
})

export const toggleMenuItemAvailablity = TryCatch(async (req: AuthenticatedRequest, res) => {
    const id = req.params.id as string;
    if (!req.user) {
        return res.status(401).json({
            message: "unauthorized",
        })
    }
    if (!req.user.restaurantId) {
        return res.status(403).json({
            message: "You don't have a restaurant",
        })
    }
    const item = await MenuItem.findById(id);
    if (!item) {
        return res.status(404).json({
            message: "Item not found",
        })
    }
    item.isAvailable = !item.isAvailable;
    await item.save();
    return res.status(200).json({
        message: "Menu Item availability toggled successfully",
    })
})
