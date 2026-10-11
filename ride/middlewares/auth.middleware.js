import jwt from "jsonwebtoken";

const getToken = (req) => {
  return req.cookies?.token || req.headers.authorization?.split(" ")[1];
};

export const authUser = async (req, res, next) => {
  try {
    const token = getToken(req);

    if (!token) {
      return res.status(401).json({
        message: "Token is not found",
      });
    }

    const decoded = jwt.verify(token, process.env.USER_SECRET);

    req.user = {
      _id: decoded.id,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

export const authCapton = async (req, res, next) => {
  try {
    const token = getToken(req);

    if (!token) {
      return res.status(401).json({
        message: "Token is not found",
      });
    }

    const decoded = jwt.verify(token, process.env.CAPTON_SECRET);

    req.capton = {
      _id: decoded.id,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

