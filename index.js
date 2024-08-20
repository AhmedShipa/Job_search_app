// handle error in code
process.on("uncaughtException", (err) => {
  console.log("error in code", err);
});
import express from "express";
import { dbConnection } from "./dbconnection/dbConnection.js";
import { AppError } from "./src/utilities/appError.js";
import { globalError } from "./src/middleware/globalError.js";
import { routes } from "./index.routes.js";
import cors from "cors";
// store environment variables for application using .env
import dotenv from "dotenv";
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use("/uploads", express.static("uploads"));
dotenv.config();
app.use(cors());
routes(app);

// handle unhandled routes
app.use("*", (req, res, next) => {
  next(new AppError(`route not found ${req.originalUrl}`, 404));
});

// main handler of error
app.use(globalError);

//handle error outside express
process.on("unhandledRejection", (err) => {
  console.log(err);
});

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
