import express from "express";
import { Service } from "../model/services.js";
import { User } from "../model/user.js";
import { Appointment } from "../model/appointment.js";

const router = express.Router();

router.get('/appointments', async (req, res) => {

    let result = await Appointment.find({ 'isConfirmed': true, 'isCompleted':false });
    return res.status(200).send({ date: result });
});

export default router;