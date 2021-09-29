import connectDB from "../../../utils/connectDB";
import Product from '../../../models/productModel';
import { auth } from '../../../middleware/auth';


connectDB();

export default async (req, res) => {
    switch (req.method) {
        case "GET":
            await getProduct(req, res);
            break;
        case "PUT":
            await updateProduct(req, res);
            break;
        case "DELETE":
            await deleteProduct(req, res);
            break;
    }
}


const getProduct = async (req, res) => {
    try {
        const { id } = req.query;

        const product = await Product.findById(id);
        if (!product) return res.status(400).json({ err: "Product does not exist." });

        res.json({ product })

    } catch (error) {
        res.status(500).json({ err: error.message });
    }
}

const updateProduct = async (req, res) => {
    try {
        const result = await auth(req, res);
        if (result.role !== "admin") return res.status(400).json({ err: "Invalid Authentication." });

        const { title, price, inStock, description, content, category, images } = req.body;

        if (!title || !price || !inStock || !content || !description || category === "all" || images.length === 0)
            return res.status(400).json({ err: "Please add all fields." });

        await Product.findByIdAndUpdate(req.query.id, {
            title: title.toLowerCase(), price, inStock, description, content, category, images
        })

        res.json({ msg: "Update Success!" });

    } catch (error) {
        res.status(500).json({ err: error.message });
    }
}

const deleteProduct = async (req, res) => {
    try {
        const result = await auth(req, res);
        if (result.role !== "admin") return res.status(400).json({ err: "Invalid Authentication." });

        await Product.findByIdAndDelete(req.query.id);

        res.json({ msg: "Delete Success!" });

    } catch (error) {
        res.status(500).json({ err: error.message });
    }
}