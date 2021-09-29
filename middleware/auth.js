import jwt from 'jsonwebtoken';
import User from '../models/userModel';


export const auth = async (req, res) => {
    try {
        const token = req.headers.authorization
        if (!token) return res.status(400).json({ err: "Invalid Authentication" });

        const result = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!result) return res.status(400).json({ err: "Invalid Authentication" });

        const user = await User.findById(result.id);
        if (!user) return res.status(400).json({ err: "This user does not exist." });

        return { id: user._id, role: user.role, root: user.root };

    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}