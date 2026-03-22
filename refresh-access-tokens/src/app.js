import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/auth/v1/", authRoutes);

app.get("/health", (req, res) => {
  res.send("server running successfully..!!");
});

export default app;
