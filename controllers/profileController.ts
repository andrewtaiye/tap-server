require("dotenv").config;
import { Request, Response } from "express";
const client = require("../db/db");

const getProfile = async (req: Request, res: Response) => {
  try {
    res.json({ status: "ok", message: "profile retrieved" });
  } catch (err: any) {
    console.error(err.message);
    res
      .status(400)
      .json({ status: "error", message: "failed to retrieve profile" });
  }
};

const createProfile = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      rank,
      fullName,
      dateOfBirth,
      idNumber,
      enlistmentDate,
      postInDate,
      flight,
      cat,
    } = req.body;

    if (enlistmentDate < dateOfBirth) {
      res
        .status(400)
        .json({
          status: "error",
          message: "Enlistment Date cannot be before Date of Birth",
        });
      return;
    }

    if (postInDate < enlistmentDate) {
      res
        .status(400)
        .json({
          status: "error",
          message: "Post-In Date cannot be before Enlistment Date",
        });
      return;
    }

    // let query = `
    // INSERT INTO profiles (user_id, rank, full_name, date_of_birth, id_number, date_accepted, reporting_date, flight, cat)
    // VALUES ('${userId}', '${rank}', '${fullName}', '${dateOfBirth}', '${idNumber}', '${enlistmentDate}', '${postInDate}', '${flight}', '${cat}');`;
    // await client.query(query);

    res.json({ status: "ok", message: "profile created" });
  } catch (err: any) {
    console.error(err.message);
    res
      .status(400)
      .json({ status: "error", message: "failed to create profile" });
  }
};

const updateProfile = async (req: Request, res: Response) => {
  try {
    res.json({ status: "ok", message: "profile updated" });
  } catch (err: any) {
    console.error(err.message);
    res
      .status(400)
      .json({ status: "error", message: "failed to update profile" });
  }
};

const deleteProfile = async (req: Request, res: Response) => {
  try {
    res.json({ status: "ok", message: "profile deleted" });
  } catch (err: any) {
    console.error(err.message);
    res
      .status(400)
      .json({ status: "error", message: "failed to delete profile" });
  }
};

module.exports = {
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile,
};
