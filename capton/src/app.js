import express from "express";
import { config } from "dotenv";
config();
import cookieParser from "cookie-parser";
import { connectRabbitMq, subscribeToQueue } from "./services/rabbit.js";
import { deliverNewRide } from "./services/newRidePoller.js";

import captonRoutes from "./routes/capton.routes.js";
const app = express();

connectRabbitMq()
  .then(() =>
    subscribeToQueue("new-ride", async (ride) => {
      deliverNewRide(JSON.parse(ride));
    })
  )
  .catch((err) => {
    console.log("RabbitMQ connection failed - >", err.message);
  });

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use("/",captonRoutes);

app.get("/" ,(req ,res)=>{
  res.send("Hello world");
})

app.get("/headth" ,(req ,res)=>{
  res.status(200).json({
    message:"Server is running",
    statusCode:200,
    err:null,
    secure:true,
    success:true
  })
})


export default app;
