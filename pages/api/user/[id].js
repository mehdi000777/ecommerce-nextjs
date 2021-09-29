import connectDB from '../../../utils/connectDB';
import User from '../../../models/userModel';
import { auth } from '../../../middleware/auth';

connectDB();

export default async (req, res) => {
    switch (req.method) {
        case "PATCH":
            await updateUser(req, res);
            break;
        case "DELETE":
            await deleteUser(req, res);
            break;
    }
}


const updateUser = async (req, res) => {
    try {
        const result = await auth(req, res);
        if (result.role !== "admin" || !result.root) return res.status(400).json({ err: "Invalid Authentication" });

        const { role } = req.body;

        await User.findByIdAndUpdate(req.query.id, {
            role
        });

        res.json({ msg: "Update Success!" });
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
}

const deleteUser = async (req, res) => {
    try {
        const result = await auth(req, res);
        if (result.role !== "admin" || !result.root) return res.status(400).json({ err: "Invalid Authentication" });

        await User.findByIdAndDelete(req.query.id);

        res.json({ msg: "Delete Success!" });
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
}