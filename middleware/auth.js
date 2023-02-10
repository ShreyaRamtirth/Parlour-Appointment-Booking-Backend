import pkg from "jsonwebtoken";

import { User } from "../model/user.js";

const Jwt = pkg;

const requireAuth = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).json({ error: 'No credentials sent!' });
    }
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).send({
            message: "Unauthenticated"
        });
    }
    await Jwt.verify(token, process.env.JWT_SECRET,async (err, decodedToken) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthenticated " + err.message
            });
        }

        const user = await User.findOne({ _id: decodedToken._id });

        if (!user) {
            return res.status(404).send({
                message: "User not found"
            });
        }
        next();
    });
}

export default requireAuth;