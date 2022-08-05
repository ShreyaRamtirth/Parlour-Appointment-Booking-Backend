import express from "express";
import pkg from "jsonwebtoken";
import { User } from "../model/user.js";
const Jwt = pkg;

const router = express.Router();

router.post("/bookapppointment", async (req, res) => {
    const token = req.headers.authorization;
    var appointment = req.body.appointment;
    const claims = await Jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOneAndUpdate({ _id: claims._id }, {
        $push: { appointments: appointment }
    }, (err, doc) => {
        if (err) {
            return res.send(500, { error: "Failed to Update" });
        }
        return res.send(200, { message: 'Success' });
    });

});

export default router;