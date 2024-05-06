import { checkout, paymentVerification } from "../controllers/paymentController.js";
import express from "express"

const router = express.Router();
router.post("/checkout", checkout)
router.post("/paymentVerification", paymentVerification)
export default router;