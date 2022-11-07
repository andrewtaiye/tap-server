require("dotenv").config;
import { Request, Response } from "express";

const getProfile = (req: Request, res: Response) => {
  try {
    res.json({ status: "ok", message: "profile retrieved" });
  } catch (err: any) {
    console.error(err.message);
    res
      .status(400)
      .json({ status: "error", message: "failed to retrieve profile" });
  }
};

const createProfile = (req: Request, res: Response) => {
  try {
    res.json({ status: "ok", message: "profile created" });
  } catch (err: any) {
    console.error(err.message);
    res
      .status(400)
      .json({ status: "error", message: "failed to create profile" });
  }
};

const updateProfile = (req: Request, res: Response) => {
  try {
    res.json({ status: "ok", message: "profile updated" });
  } catch (err: any) {
    console.error(err.message);
    res
      .status(400)
      .json({ status: "error", message: "failed to update profile" });
  }
};

const deleteProfile = (req: Request, res: Response) => {
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
