import mongoose from "mongoose";

const Schema = mongoose.Schema;
const o = Schema.ObjectId;
const appointment = new mongoose.Schema({
    date: {
        type:String,
        default:new Date().toLocaleDateString()
    },
    time:{
        type:String,
        default : new Date().toLocaleTimeString()
    },
    services: [String],
    isConfirmed:{
        type: Boolean,
        default:false
    },
    isCompleted:{
        type: Boolean,
        default: false
    },
    user:{
        type: o,
        required: true
    }
},{collection: "Appointment"});

export const Appointment = mongoose.model('Appointment', appointment);
