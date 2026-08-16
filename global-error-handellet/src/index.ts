// src/server.ts
import express from "express";
import { globalErrorHandeler } from "./middlewares/errorHandeler.middleware.ts";
import { AppError } from "./utils/AppError.ts";

const app = express();
app.use(express.json());

// creatinf a route throwing error
app.get("/test", (req, res, next) => {
  next(new AppError("This is a test error!", 400));
}); 

// creating a route using the controllers global error handeller
import { getUser } from "./controller/user.controller.ts";
app.get("/user", getUser);

// mouting global error handeller at the last - after all routes
app.use(globalErrorHandeler);

app.listen(3000, () => console.log("Server running on port 3000"));
