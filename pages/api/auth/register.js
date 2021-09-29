import connectDB from '../../../utils/connectDB';
import User from '../../../models/userModel';
import { registerValidate } from '../../../utils/valid';
import bcrypt from 'bcrypt';
import { createAccessToken, createRefreshToken } from '../../../utils/generateToken';

connectDB();

export default async (req, res) => {
    switch (req.method) {
        case "POST":
            await Register(req, res);
            break;
    }
}

const Register = async (req, res) => {
    try {
        const { name, email, password, cf_password } = req.body;

        const errMsg = registerValidate(email, name, password, cf_password);
        if (errMsg) return res.status(400).json({ err: errMsg });

        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ err: "This email already exist." });

        const hashPasswrod = bcrypt.hashSync(password, 12);

        const newUser = new User({
            name, email, password: hashPasswrod
        });

        const access_token = createAccessToken({ id: newUser._id });
        const refresh_token = createRefreshToken({ id: newUser._id });

        await newUser.save();

        res.json({
            msg: "Register Success!",
            access_token,
            refresh_token,
            user: {
                ...newUser._doc,
                password: ""
            }
        })

    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}