import "dotenv/config";
import express from "express";
import Razorpay from "razorpay";
import cors from "cors";
import razorpay from "./config/razorpay.conf.js";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/create-order", async (req, res) => {
  const request = req.body;

  // returning the user if the amount is not provided in the request body
  if (!request.amount) {
    return res.status(400).json({ error: "Amount is required" });
  }

  const options = {
    amount: request.amount * 100,
    currency: "INR",
    receipt: "receipt_order_470",
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error("Error in creating order", err);
    res.status(500).json({ error: "Error in creating order" });
  }
});

// starting the server on port 3000
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
