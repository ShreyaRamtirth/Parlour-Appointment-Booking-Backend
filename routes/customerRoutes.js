import express from "express";
import pkg from "jsonwebtoken";
import NodeMailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

import { User } from "../model/user.js";
import { Appointment } from "../model/appointment.js";
const Jwt = pkg;

const router = express.Router();

router.post("/bookapppointment", async (req, res) => {
    const token = req.headers.authorization;
    var appointment = req.body.appointment;
    const __dirname = path.resolve();
    const filePath = path.join(__dirname, '/templates/email.html');
    const source = fs.readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.default.compile(source);
    const claims = await Jwt.verify(token, process.env.JWT_SECRET);
    let user = await User.findOne({ _id: claims._id })
    let app = new Appointment(appointment);
    var ser = appointment.services.join("<br>");
    app.user = user._id;
    app.save((err, result) => {
        if (err) {
            res.status(400).send({ error: "Unable to book appointment at this moment" });
        }

        const replacements = {
            username: user.name,
            services: ser,
            date: appointment.date,
            time: appointment.time,
        };
        const htmlToSend = template(replacements);
        let transporter = NodeMailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_ID,
                pass: process.env.PASSWORD
            }
        });
        let details = {
            from: process.env.MAIL_ID,
            to: user.email,
            subject: "Your Appointment Details at Relish Parlour",
            html: htmlToSend
        }
        transporter.sendMail(details, (err) => {
            if (err) {
                res.status(400).send({
                    message: "Error occured"
                });
            }
        });
        return res.status(200).send({ message: 'Appointment booked successfully' });
    })

});

router.post('/userappointments', async (req, res) => {
    let name = req.body.user
    let user = await User.findOne({ 'name': name})
    let id = user._id;
    let result = await Appointment.find({ "user": id , "date" : { $gte: new Date().toISOString() } });
    if (result.length)
        return res.status(200).send({ result });
    return res.status(404).send({ 'message': "No appointments" });
}); 

router.delete('/cancelappointments', async (req, res) => {
    let _id = req.body.id
    let appointment = await Appointment.findOneAndDelete({ '_id': _id })
    if(appointment)
        return res.status(200).send({ 'message': "Appointment deleted" });
    return res.status(404).send({ 'message': "No appointments" });
}); 

export default router;