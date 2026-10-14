import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import { connectDb } from "./config/db.js";
import rideRoutes from "./routes/ride.routes.js";
import { connectRabbitMq } from "./services/rabbit.js";


config();
connectDb();
connectRabbitMq().catch((err) => {
  console.log("RabbitMQ connection failled - >", err.message);
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", rideRoutes);

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(3003 , ()=>{
  console.log("Ride service at 3003 started");
})
