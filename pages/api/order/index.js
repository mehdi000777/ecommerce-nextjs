import connectDB from '../../../utils/connectDB';
import Order from '../../../models/orderModel';
import Product from '../../../models/productModel';
import { auth } from '../../../middleware/auth';

connectDB();

export default async (req, res) => {
    switch (req.method) {
        case "POST":
            await createOrder(req, res);
            break;
        case "GET":
            await getOrders(req, res);
            break;
    }
}


const getOrders = async (req, res) => {
    try {
        const result = await auth(req, res);
        
        let orders;
        if (result.role !== "admin") {
            orders = await Order.find({ user: result.id }).populate("user", "-password");
        }
        else {
            orders = await Order.find({}).populate("user", "-password");
        }

        res.json({ orders })
    } catch (err) {
        return res.status(500).json({ err: error.message });
    }
}


const createOrder = async (req, res) => {
    try {
        const result = await auth(req, res);
        const { cart, mobile, address, total } = req.body;

        if (!cart || !total) return res.status(400).json({ err: "Please select product." });

        if (!mobile || !address) return res.status(400).json({ err: "Please enter your mobile and address." });

        const newOrder = new Order({
            user: result.id,
            cart,
            mobile,
            address,
            total
        })

        await newOrder.save();

        cart.forEach(item => {
            updateProducts(item._id, item.quantity, item.inStock, item.sold)
        })

        res.json({
            msg: "Order Success!",
            newOrder
        })

    } catch (error) {
        return res.status(500).json({ err: error.message });
    }
}


const updateProducts = async (id, quantity, oldInStock, oldSold) => {
    await Product.findByIdAndUpdate(id, {
        inStock: oldInStock - quantity,
        sold: oldSold + quantity
    })
}
