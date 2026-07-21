import { Document, Schema, model, Types } from "mongoose";

interface IMenuItems extends Document {
    restaurantId: Types.ObjectId;
    description?: string;
    price: number;
    image?: string;
    name: string;
    isAvailable: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const menuItemsSchema = new Schema<IMenuItems>({
    restaurantId: {
        type: Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    isAvailable: {
        type: Boolean,
        required: true,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
}, {
    timestamps: true,
}
)

export default model<IMenuItems>("MenuItem", menuItemsSchema);






