
import jwt from "jsonwebtoken";
import { captonModel } from "../models/capton.model.js";

export const authCapton = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Token is not found",
      });
    }

    const decoded = jwt.verify(token, process.env.CAPTON_SECRET);

    const capton = await captonModel.findById(decoded.id);

    if (!capton) {
      return res.status(401).json({
        message: "Capton not found",
      });
    }

    req.capton = capton;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
