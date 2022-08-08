import express from "express";
import pkg from "jsonwebtoken";
import bcrypt from 'bcryptjs';


import { User } from '../model/user.js'
import { Service } from "../model/services.js";

const Jwt = pkg;
const router = express.Router();
router.post('/register', async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role
    });
    await user.save((err, result) => {
        if (err) {
            return res.status(424).send({
                messaage: "Register unsuccessfull"
            });
        }
        const { password, ...data } = result.toJSON();
        return res.send(data);
    });
});


router.post("/login", async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(404).send({
            messaage: "user not found"
        });
    }
    if (!await bcrypt.compare(req.body.password, user.password)) {
        return res.status(400).send({
            messaage: "Invalid Credentials"
        });
    }
    const token = Jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: 86400 // expires in 24 hours
    });
    return res.status(200).send({
        jwt: token,
        role: user.role,
        name: user.name
    });
});

router.get('/services', async (req, res) => {
    let services = await Service.find();
    return res.status(200).send({ "services": services });
})

export default router;