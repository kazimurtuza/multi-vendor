import axios from "axios";
import getbuffer from "../config/datauri.js";
import { AuthenticatedRequest } from "../middlewares/isAuth.js";
import TryCatch from "../middlewares/trycatch.js";
import Restaurant from "../models/Restaurant.js";
import jwt from "jsonwebtoken"

export const addRestaurant = TryCatch(async (req: AuthenticatedRequest, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
    const existingRestaurant = await Restaurant.findOne({
        ownerId: user._id,
    })

    if (existingRestaurant) {
        return res.status(400).json({
            message: "You already have a restaurant",
        })
    }
    const { name, description, latitude, longitude, formatedAddress, phone } = req.body;

    if (!name || !latitude || !longitude) {
        return res.status(400).json({
            message: "Please give all details",
        });
    }
    const file = req.file;

    if (!file) {
        return res.status(400).json({
            message: "Please give Image",
        });
    }

    const fileBuffer = getbuffer(file);

    if (!fileBuffer?.content) {
        return res.status(500).json({
            message: "faild to create bufffer ",
        });
    }

    const { data: uploadResult } = await axios.post(
        `${process.env.UTILS_SERVICES}/api/upload`, {
        buffer: fileBuffer.content,
    }
    )

    const restaurant = await Restaurant.create({
        name,
        description,
        phone,
        image: uploadResult.url,
        ownerId: user._id,
        autoLocation: {
            type: "Point",
            coordinates: [Number(longitude), Number(latitude)],
            formatedAddress,
        }
    })

    return res.status(201).json({
        message: "Restaurant created successfully",
        restaurant
    })

});

export const fatchMyRestaurant = TryCatch(async (req: AuthenticatedRequest, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({
            message: "Unauthorized",
        })
    }

    const restaurant = await Restaurant.findOne({ ownerId: user._id })

    if (!restaurant) {
        return res.status(404).json({
            message: "Restaurant Not Found",
        })
    }

    if (restaurant && !user.restaurantId) {
        const token = jwt.sign({
            user: { ...user, restaurantId: restaurant?._id }
        }, process.env.JWT_SEC as string, { expiresIn: "7d" })

        return res.status(200).json({
            message: "Restaurant Found",
            restaurant,
            token
        })
    }

    return res.status(200).json({
        message: "Restaurant Found",
        restaurant,
    })


});
