import connectDB from '../../../utils/connectDB';
import User from '../../../models/userModel';
import { auth } from '../../../middleware/auth';
import bcrypt from 'bcrypt';

connectDB();

export default async (req, res) => {
    switch (req.method) {
        case "PATCH":
            await resetPassword(req, res);
            break;
    }
}


const resetPassword = async (req, res) => {
    try {
        const { id } = await auth(req, res);

        const { password } = req.body;

        if (!password) return res.status(400).json({ err: "Please Enter new Password" });

        if (password.length < 6) return res.status(400).json({ err: "Password must be at least 6 characters." });

        const passwordHash = bcrypt.hashSync(password, 12);

        await User.findByIdAndUpdate(id, {
            password: passwordHash
        })

        res.json({ msg: "Upadate Success!" })
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
}