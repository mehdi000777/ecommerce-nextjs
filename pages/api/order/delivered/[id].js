import connectDB from '../../../../utils/connectDB';
import Order from '../../../../models/orderModel';
import { auth } from '../../../../middleware/auth';

connectDB();

export default async (req, res) => {
    switch (req.method) {
        case "PATCH":
            await deliveredOrder(req, res);
            break;
    }
}

const deliveredOrder = async (req, res) => {
    try {
        const result = await auth(req, res);

        if (result.role !== "admin") return res.status(400).json({ err: "Invalid Authentication." });

        const order = await Order.findOne({ _id: req.query.id });
        if (order.paid) {
            await Order.findOneAndUpdate({ _id: req.query.id }, {
                delivered: true,
            })

            res.json({
                msg: "Update Success!",
                order: {
                    ...order._doc,
                    delivered: true
                }
            });
        }
        else {
            await Order.findOneAndUpdate({ _id: req.query.id }, {
                delivered: true,
                paid: true,
                dateOfPayment: new Date().toISOString(),
                method: "Receive Cash"
            })

            res.json({
                msg: "Update Success!",
                order: {
                    ...order._doc,
                    delivered: true,
                    paid: true,
                    dateOfPayment: new Date().toISOString(),
                    method: "Receive Cash"
                }
            });
        }

    } catch (err) {
        return res.status(500).json({ err: err.message });
    }
}