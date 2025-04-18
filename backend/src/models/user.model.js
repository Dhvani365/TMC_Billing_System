import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            minlenght: 6
        },
        password: {
            type: String,
            required: true,
            minlenght: 6
        },
        role: {
            type: String,
            default: "Associate"
        }
    },
    {timestamps: true} 
);

const User = mongoose.model("user", userSchema);

export default User;