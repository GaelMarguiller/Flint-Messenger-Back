import {Schema, Document, model, Model} from "mongoose";

export interface IUser extends Document {
    firstname: string;
    lastname: string;
    email: string;
}

const userSchema = new Schema({
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    email: {
        type: String,
        required: true,
        unique: true,
    }
});

export const User = model<IUser, Model<IUser>>("User", userSchema);
