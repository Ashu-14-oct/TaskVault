import mongoose, { Document, Types } from "mongoose";

interface IUser extends Document {
    name: String;
    email: String;
    password: String;
    todo?: Types.ObjectId;
}

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    todo: {
        type: mongoose.Schema.Types.ObjectId,
        ref:  "Todo"
    }
}, {
    timestamps: true
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;