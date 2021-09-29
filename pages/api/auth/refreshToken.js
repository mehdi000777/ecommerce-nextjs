import User from '../../../models/userModel';
import connectDB from '../../../utils/connectDB';
import jwt from 'jsonwebtoken';
import { createAccessToken } from '../../../utils/generateToken';

connectDB();

export default async (req, res) => {
    switch (req.method) {
        case "GET":
            await RefreshToken(req, res);
            break;
    }
}


const RefreshToken = async (req, res) => {
    try {
        const rf_token = req.cookies.refreshToken;
        if (!rf_token) return res.status(400).json({ err: "Please login now." });

        const result = jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET);
        if (!result) return res.status(400).json({ err: "Your token is inncorect or has expired." });

        const user = await User.findOne({ _id: result.id });
        if (!user) return res.status(400).json({ err: "User does not exist." });

        const access_token = createAccessToken({ id: user._id });

        res.json({
            access_token,
            user: {
                ...user._doc,
                password: ""
            }
        });

    } catch (error) {
        return res.status(500).json({ err: error.message });
    }
}
