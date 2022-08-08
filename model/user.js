import mongoose from "mongoose";    

const Schema = mongoose.Schema;
const o = Schema.ObjectId;
const appointment = new Schema({
    date: {
        type:Date,
        default:new Date().toLocaleDateString().split(',')[0]
    },
    time:{
        type:String,
        default : new Date().toLocaleDateString().split(',')[1]
    },
    services: [o],
    isConfirmed:{
        type: Boolean,
        default:false
    }
}, { _id: false });
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
}, { collection: 'User' });

export const User = mongoose.model('User', userSchema);
