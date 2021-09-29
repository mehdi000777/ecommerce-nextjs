import connectDB from '../../../utils/connectDB';
import User from '../../../models/userModel';
import { auth } from '../../../middleware/auth';

connectDB();

export default async (req, res) => {
    switch (req.method) {
        case "GET":
            await getUsers(req, res);
            break;
        case "PATCH":
            await updateProfile(req, res);
            break;
    }
}

const getUsers = async (req, res) => {
    try {
        const result = await auth(req, res);
        if (result.role !== "admin") return res.status(400).send({ err:"Invalid Authentication."});

        const users = await User.find({}).select("-password");

        res.json({ users });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}


const updateProfile = async (req, res) => {
    try {
        const { id } = await auth(req, res);
        const { name, avatar } = req.body;

        if (!name && !avatar) return res.status(400).json({ err: "Please Enter name or avatar." });

        const newUser = await User.findByIdAndUpdate(id, {
            name,
            avatar
        }).select("-password")

        res.json({
            msg: "Upadate Success!",
            user: {
                ...newUser._doc,
                avatar,
                name
            }
        })
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}