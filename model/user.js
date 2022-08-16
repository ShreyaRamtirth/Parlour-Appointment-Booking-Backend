import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    forgot: {
        type: Boolean,
        default: false
    },
    otp: {
        type: Number,
        required: false
    }
}, { collection: 'User' });

export const User = mongoose.model('User', userSchema);
