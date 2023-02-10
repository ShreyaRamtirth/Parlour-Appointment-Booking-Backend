import pkg from "jsonwebtoken";
import { User } from "../model/user.js";

const Jwt = pkg;

const customerAuth = async (req, res, next) => {
    const token = req.headers.authorization;
    const claims = await Jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: claims._id });
    if (!user) {
        return res.status(404).send({
            message: "User not found"
        });
    }
    if (user.role != "customer") {
        return res.status(403).send({
            message: "You are not allowed to access this URL"
        });
    }
    next();
}

export default customerAuth;