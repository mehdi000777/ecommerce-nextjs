import connectDB from '../../../../utils/connectDB';
import Order from '../../../../models/orderModel';
import { auth } from '../../../../middleware/auth';

connectDB();

export default async (req, res) => {
    switch (req.method) {
        case "PATCH":
            await paymentOrder(req, res);
            break;
    }
}

const paymentOrder = async (req, res) => {
    try {
        const result = await auth(req, res);

        if (result.role === "user") {

            const { paymentId } = req.body;

            await Order.findOneAndUpdate({ _id: req.query.id }, {
                paid: true,
                dateOfPayment: new Date().toISOString(),
                paymentId,
                method: "Paypal"
            })

            res.json({ msg: "Payment Success!" });
        }
    } catch (err) {
        return res.status(500).json({ err: error.message });
    }
}