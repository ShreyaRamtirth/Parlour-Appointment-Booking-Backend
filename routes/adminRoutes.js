import express from "express";
import { Service } from "../model/services.js";

const router = express.Router();
router.post('/addservice', async (req, res) => {
    const service = new Service({
        name: req.body.name,
        description: req.body.description,
        isActive: req.body.isActive
    });
    await service.save((err, result) => {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: "Failed to add service"
            });
        }
    });
    return res.status(200).send({
        message: "Success"
    });
});

export default router;