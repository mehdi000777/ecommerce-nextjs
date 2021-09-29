import connectDB from '../../../utils/connectDB';
import Category from '../../../models/categoryModel';
import { auth } from '../../../middleware/auth';
import Product from '../../../models/productModel';

connectDB();

export default async (req, res) => {
    switch (req.method) {
        case "PUT":
            await updateCategory(req, res);
            break;
        case "DELETE":
            await deleteCategory(req, res);
            break;
    }
}


const updateCategory = async (req, res) => {
    try {
        const result = await auth(req, res);
        if (result.role !== "admin") return res.status(400).json({ err: "Invalid Authenticaion." });

        const { name } = req.body;
        if (!name) return res.status(400).json({ err: "Name can't be left blank." });

        const newCategory = await Category.findOneAndUpdate({ _id: req.query.id }, {
            name
        });

        res.json({
            msg: "Update Success!",
            category: {
                ...newCategory._doc,
                name
            }
        });

    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}

const deleteCategory = async (req, res) => {
    try {
        const result = await auth(req, res);
        if (result.role !== "admin") return res.status(400).json({ err: "Invalid Authenticaion." });

        const product = await Product.findOne({ category: req.query.id });
        if (product) return res.status(400).json({ err: "This category has products." });

        await Category.findOneAndDelete({ _id: req.query.id });

        res.json({ msg: "Delete Success!" });

    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}