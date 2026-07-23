import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);

const otpCache = new Map();

const otpSender = async (req, res) => {
    const { phoneNumber } = req.body;

    if(!phoneNumber){
        return res.status(400).json({ error: "Phone number is required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    otpCache.set(phoneNumber, { otp, expiresAt });

    try {
        await twilioClient.messages.create({
            body: `Your OTP is ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber
        });

        return res.status(200).json({ message: "OTP sent successfully", otp });
    } catch (error) {
        console.error("Error sending OTP:", error);
        return res.status(500).json({ error: "Failed to send OTP" });
    }
}

export default otpSender;