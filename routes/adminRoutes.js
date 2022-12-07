import express from "express";
import NodeMailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import multer from "multer";

import { Service } from "../model/services.js";
import { User } from "../model/user.js";
import { Appointment } from "../model/appointment.js";

const router = express.Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.env.UPLOAD);
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.post('/addservice', upload.single('image'), async (req, res) => {
    const service = new Service({
        name: req.body.name,
        description: req.body.description,
        price: req.body.cost,
        image: req.file.path
    });
    await service.save((err, result) => {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: "Failed to add service"
            });
        }
        return res.status(200).send({
            message: "Success"
        });
    });
});

router.post('/appointments', async (req, res) => {

    let result = await Appointment.find({ 'isConfirmed': false });
    let users = []
    for (let app of result) {
        let user = await User.findOne({ _id: app.user });
        users.push({ appointment: app, "user": user });
    }

    if (users.length)
        return res.send({ data: users });
    return res.send({ 'message': "No appointments to confirm" });
}); 


router.post('/confirmappointment', async (req, res) => {
    const token = req.headers.authorization;
    const __dirname = path.resolve();
    const filePath = path.join(__dirname, '/templates/confirmEmail.html');
    const source = fs.readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.default.compile(source);
    let appointment = await Appointment.findOneAndUpdate({ _id: req.body.id }, { isConfirmed: true });
    let user = await User.findOne({ _id: appointment.user });
    let ser = appointment.services.join("<br>");

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
        subject: "Your Appointment Details at Avani Parlour",
        html: htmlToSend
    }
    transporter.sendMail(details, (err) => {
        if (err) {
            return res.status(400).send({
                messaage: "Error occured"
            });
        }
    });
    let result = await Appointment.find({ 'isConfirmed': false });
    let users = []
    for (let app of result) {
        let user = await User.findOne({ _id: app.user });
        users.push({ appointment: app, "user": user });
    }

    if (users.length)
        return res.send({ data: users });
    return res.send({ 'message': "No appointments to confirm" });
});

router.post('/addoffer',()=>{
    
})

export default router;