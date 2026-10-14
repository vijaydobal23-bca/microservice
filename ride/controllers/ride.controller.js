import { rideModel } from "../models/ride.model.js";
import { publishToQueue } from "../services/rabbit.js";

export const createRide = async (req, res) => {
  try {
    const { pickup, destination } = req.body;

    if (!pickup || !destination) {
      return res.status(400).json({
        message: "Pickup and destination are required",
      });
    }

    const ride = await rideModel.create({
      user: req.user._id,
      pickup,
      destination,
    });

    await publishToQueue("new-ride", ride);

    return res.status(201).json(ride);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error from create ride",
      error: error.message,
    });
  }
};

export const acceptRide = async (req, res) => {
  try {
    const { rideId } = req.query;

    if (!rideId) {
      return res.status(400).json({
        message: "Ride id is required",
      });
    }

    const ride = await rideModel.findById(rideId);

    if (!ride) {
      return res.status(404).json({
        message: "Ride not found",
      });
    }

    ride.status = "accepted";
    ride.captain = req.capton._id;

    await ride.save();

    return res.status(200).json(ride);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error from accept ride",
      error: error.message,
    });
  }
};
