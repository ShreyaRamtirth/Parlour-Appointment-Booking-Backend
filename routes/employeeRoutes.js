import express from "express";
import { Service } from "../model/services.js";
import { User } from "../model/user.js";
import { Appointment } from "../model/appointment.js";

const router = express.Router();

router.post('/appointments', async (req, res) => {
    let result = await Appointment.find({ 'isConfirmed': true, 'isCompleted': false });
    let users = await Promise.all(result.map(async (app, i) => {
        return User.findOne({ _id: app.user }).then(function (user) {
            let u = { appointment: app, "user": user }
            return u
        });
    }));
    return res.status(200).send({ data: users });
});

router.get('/app', async (req, res) => {
    let id = req.query.id;
    let result = await Appointment.findOne({_id:id });
    let user = await User.findOne({ _id: result.user });
    let u = { appointment: result, "user": user };
    return res.send({ data: u });
});

export default router;