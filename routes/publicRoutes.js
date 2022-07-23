import express from "express";
import pkg from "jsonwebtoken";
import { User } from '../model/user.js'

const Jwt = pkg;
const router = express.Router();
router.post('/register', async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
    });
    const result = await user.save();
    const { password, ...data } = result.toJSON();
    res.send(data);
});


export default router;