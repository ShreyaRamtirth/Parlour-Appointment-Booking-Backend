import mongoose from "mongoose";

const Schema = mongoose.Schema;

const appointment = new Schema({
    date: Date,
    time: String,
    services:String
});
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
    },
    appointments: [appointment]
});

export const User = mongoose.model('User', userSchema);
