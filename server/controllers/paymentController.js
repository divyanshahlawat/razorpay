import { instance } from "../server.js"
import crypto from "crypto"
import { Payment } from "../models/paymentModel.js"

export const checkout = async (req, res) => {
    const { amount } = req.body
    const options = {
        amount: Number(amount * 100),  // amount in the smallest currency unit
        currency: "INR",

    };
    const order = await instance.orders.create(options);

    res.status(200).json({
        success: true,
        order
    })

}
export const paymentVerification = async (req, res) => {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body
    const sha = crypto.createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`)
    const expectedSignature = sha.digest('hex')
    const isAuthentic = expectedSignature === razorpay_signature
    if (isAuthentic) {
        //Storing on database
        const payment = await new Payment({
            razorpay_payment_id, razorpay_order_id, razorpay_signature
        })
        await payment.save()


        res.redirect(`http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`)

    }

    else {
        res.status(400).json({

            success: false
        })
    }

}