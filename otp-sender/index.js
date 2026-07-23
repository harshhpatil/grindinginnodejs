import "dotenv/config"
import express from "express";
import otpSender from "./otpSender.controller.js";

const app = express();

app.use(express.json());

app.get("/", (req, res)=>{
    res.send("otp-backend officially breathing bruhhh..!!")
});

app.post("/send-otp", otpSender);

app.listen(3000, () => {
    console.log("server is running on port 3000.");
});