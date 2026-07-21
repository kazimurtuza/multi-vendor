import mongoose, { Document, Schema } from "mongoose";
export interface IRestaurant extends Document {
    name: string;
    description?: String;
    image: string;
    ownerId: string;
    phone: number;
    isVerified: boolean;
    autoLocation: {
        type: "Point";
        coordinates: [number, number];  //[longitude,latitude]
        formatedAddress: string;
    }
    isOpen: boolean;
    createdAt: Date;
}

const schema = new Schema<IRestaurant>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: String,
    image: {
        type: String,
        required: true,
    },
    ownerId: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    autoLocation: {
        type: {
            type: String,
            enum: ["Point"],
            required: true,
        },
        coordinates: {
            type: [Number],
            require: true,
        },
        formatedAddress: {
            type: String,

        }
    },
    isOpen: {
        type: Boolean,
        default: false,
    },

},
    {
        timestamps: true,
    }

);

schema.index({autoLocation:"2dsphere"});

export default mongoose.model<IRestaurant>("Restaurant",schema);