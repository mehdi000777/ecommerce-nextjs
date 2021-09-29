import User from '../../../models/userModel';
import bcrypt from 'bcrypt';
import connectDB from '../../../utils/connectDB';
import { createAccessToken, createRefreshToken } from '../../../utils/generateToken';

connectDB();

export default async (req, res) => {
    switch (req.method) {
        case "POST":
            await Login(req, res);
    }
}


const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ err: "Email does not exist." });

        const match = bcrypt.compareSync(password, user.password);
        if (!match) return res.status(400).json({ err: "This password incorrect." });

        const access_token = createAccessToken({ id: user._id });
        const refresh_token = createRefreshToken({ id: user._id });

        res.json({
            msg: "Login Success!",
            access_token,
            refresh_token,
            user: {
                ...user._doc,
                password: ""
            }
        })

    } catch (error) {
        return res.status(500).json({ err: error.message });
    }
}