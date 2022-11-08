require("dotenv").config;
import { Request, Response } from "express";

const getPosition = async (req: Request, res: Response) => {
  try {
    console.log(req.params);
    res.json({ status: "ok", message: "position retrieved" });
  } catch (err: any) {
    console.error(err.message);
    res
      .status(400)
      .json({ status: "error", message: "failed to retrieve position" });
  }
};

const createPosition = async (req: Request, res: Response) => {
  try {
    res.json({ status: "ok", message: "position created" });
  } catch (err: any) {
    console.error(err.message);
    res
      .status(400)
      .json({ status: "error", message: "failed to create position" });
  }
};

const updatePosition = async (req: Request, res: Response) => {
  try {
    res.json({ status: "ok", message: "position updated" });
  } catch (err: any) {
    console.error(err.message);
    res
      .status(400)
      .json({ status: "error", message: "failed to update position" });
  }
};

const deletePosition = async (req: Request, res: Response) => {
  try {
    res.json({ status: "ok", message: "position deleted" });
  } catch (err: any) {
    console.error(err.message);
    res
      .status(400)
      .json({ status: "error", message: "failed to delete position" });
  }
};

module.exports = {
  getPosition,
  createPosition,
  updatePosition,
  deletePosition,
};
