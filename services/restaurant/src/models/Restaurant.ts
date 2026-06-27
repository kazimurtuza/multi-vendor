import mongoose, { Document, Schema } from "mongoose";
export interface IRestaurant extends Document {
    name: string;
    description?: String;
    image: string;
    ownerId: string;
    phone: number;
    isVerified: bigint;
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
        require: true,
    },
    ownerId: {
        type: String,
        require: true,
    },
    phone: {
        type: Number,
        require: true,
    },
    isVerified: {
        type: Boolean,
        require: true,
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