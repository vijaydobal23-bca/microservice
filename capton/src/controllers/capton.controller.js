
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { captonModel } from "../models/capton.model.js";
import { waitForNewRide } from "../services/newRidePoller.js";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  maxAge: 24 * 60 * 60 * 1000,
};

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        message: "Some field is missing",
      });
    }

    const isExists = await captonModel.findOne({ email });

    if (isExists) {
      return res.status(409).json({
        message: "Capton already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const capton = await captonModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({
      id:capton._id
    },process.env.CAPTON_SECRET,{expiresIn:"1d"});

    res.cookie("token", token, cookieOptions);

      return res.status(201).json({
      message: "Capton registered successfully",
      capton: {
        id: capton._id,
        name: capton.name,
        email: capton.email,
      },
    });


  } catch (error) {
    return res.status(500).json({
      message: "Internal server error from register",
      error
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const capton = await captonModel.findOne({ email });

    if (!capton) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, capton.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: capton._id },
      process.env.CAPTON_SECRET,
      { expiresIn: "1d" }
    );

    return res
      .cookie("token", token, cookieOptions)
      .status(200)
      .json({
        message: "Login successful",
        capton: {
          id: capton._id,
          name: capton.name,
          email: capton.email,
        },
      });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error from login",
    });
  }
};

export const logout = async (req, res) => {
  return res
    .clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })
    .status(200)
    .json({
      message: "Logout successful",
    });
};

export const profile = async (req, res) => {
  return res.status(200).json({
    capton: {
      id: req.capton._id,
      name: req.capton.name,
      email: req.capton.email,
      isAvailable:req.capton.isAvailable
    },
  });
};

export const getNewRide = async (req, res) => {
  const abortController = new AbortController();
  let responseFinished = false;

  res.on("finish", () => {
    responseFinished = true;
  });
  res.on("close", () => {
    if (!responseFinished) {
      abortController.abort();
    }
  });

  const ride = await waitForNewRide(25_000, abortController.signal);

  if (!ride) {
    return res.status(204).end();
  }

  return res.status(200).json({ ride });
};

export const toggleAvailability = async (req ,res)=>{
  try{
    const capton = await captonModel.findById(req.capton.id);
    capton.isAvailable = ! capton.isAvailable;
    await capton.save();
    res.send(capton);

  }
  catch(err){
    return res.status(500).json({
      message:err.message
    })
  }
} 

// all services are done
