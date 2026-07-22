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

export const getNearByRestaurant = TryCatch(async (req: AuthenticatedRequest, res) => {
    const { lat, lng, radius = 5000, search = "" } = req.query

    if (!lat || !lng) {
        return res.status(400).json({
            message: "Please provide latitude and longitude",
        });
    }

    const query: any = {
        isVerified: true,
    }

    if (search && typeof search === "string") {
        query.name = {
            $regex: search,
            $options: "i"
        }
    }

    const restaurants = await Restaurant.aggregate([
        {
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates: [Number(lng), Number(lat)]
                },
                distanceField: "distance",
                maxDistance: Number(radius),
                spherical: true,
                query: query,
            }
        }, {
            $sort: {
                isOpen: -1,
                distance: 1
            }
        },
        {
            $addFields: {
                distanceKm: {
                    $round: [
                        { $divide: ["$distance", 1000] },
                        2
                    ]
                }
            }
        }
    ])

    return res.status(200).json({
        message: "Restaurants found successfully",
        restaurants,
    })
});

export const singleRestaurant = TryCatch(async (req: AuthenticatedRequest, res) => {
    const { id } = req.params
    if (!id) {
        return res.status(400).json({
            message: "Please provide restaurant id",
        })
    }
    const restaurant = await Restaurant.findById(id)
    if (!restaurant) {
        return res.status(404).json({
            message: "Restaurant Not Found",
        })
    }
    return res.status(200).json({
        message: "Restaurant found successfully",
        restaurant,
    })
})

