import express from "express";
import { config } from "dotenv";
config();
import cookieParser from "cookie-parser";

import captonRoutes from "./routes/capton.routes.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use("/",captonRoutes);

app.get("/" ,(req ,res)=>{
  res.send("Hello world");
})


export default app;
