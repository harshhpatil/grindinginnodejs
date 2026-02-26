// razorpay config file delevering the razorpay credentials
import Razorpay from "razorpay";

if (!process.env.KEY_ID || !process.env.KEY_SECRET) {
  console.error(
    ".env required credentials missing or not loaded properly"
  );
  process.exit(1);
}

// creating a new instance of razorpay
const razorpay = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

export default razorpay;