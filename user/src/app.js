import express from "express";
import { config } from "dotenv";
config();
import cookieParser from "cookie-parser";
import { connectRabbitMq } from "./services/rabbit.js";

import userRoutes from "./routes/user.routes.js";
const app = express();

connectRabbitMq().catch((err) => {
  console.log("RabbitMQ connection failled - >", err.message);
});

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use("/",userRoutes); 

app.get("/" ,(req ,res)=>{
  res.send("Hello world");
})


export default app;
 