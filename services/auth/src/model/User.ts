import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    image: string;
    role: string;
}

const UserSchema: Schema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    role: { type: String, default: null },
},{
    timestamps: true
})

export const User = mongoose.model<IUser>('User', UserSchema);

export default User;