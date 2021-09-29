import connectDB from '../../../utils/connectDB';
import Category from '../../../models/categoryModel';
import { auth } from '../../../middleware/auth';

connectDB();

export default async (req, res) => {
    switch (req.method) {
        case "POST":
            await createCategory(req, res);
            break;
        case "GET":
            await getCategories(req, res);
            break;
    }
}


const createCategory = async (req, res) => {
    try {
        const result = await auth(req, res);
        if (result.role !== "admin") return res.status(400).json({ err: "Invalid Authenticaion." });

        const { name } = req.body;
        if (!name) return res.status(400).json({ err: "Name can't be left blank." });

        const category = await Category.findOne({ name });
        if (category) return res.status(400).json({ err: "This category already exist." });

        const newCategory = new Category({
            name
        });

        await newCategory.save();

        res.json({ msg: "Create category success!", newCategory });

    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({});

        res.json({ categories });

    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}