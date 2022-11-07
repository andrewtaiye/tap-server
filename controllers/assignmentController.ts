require("dotenv").config;
import { Request, Response } from "express";

const getAssignment = (req: Request, res: Response) => {
  try {
    res.json({ status: "ok", message: "assignment retrieved" });
  } catch (err: any) {
    console.error(err.message);
    res
      .status(400)
      .json({ status: "error", message: "failed to retrieve assignment" });
  }
};

const createAssignment = (req: Request, res: Response) => {
  try {
    res.json({ status: "ok", message: "assignment created" });
  } catch (err: any) {
    console.error(err.message);
    res
      .status(400)
      .json({ status: "error", message: "failed to create assignment" });
  }
};

const updateAssignment = (req: Request, res: Response) => {
  try {
    res.json({ status: "ok", message: "assignment updated" });
  } catch (err: any) {
    console.error(err.message);
    res
      .status(400)
      .json({ status: "error", message: "failed to update assignment" });
  }
};

const deleteAssignment = (req: Request, res: Response) => {
  try {
    res.json({ status: "ok", message: "assignment deleted" });
  } catch (err: any) {
    console.error(err.message);
    res
      .status(400)
      .json({ status: "error", message: "failed to delete assignment" });
  }
};

module.exports = {
  getAssignment,
  createAssignment,
  updateAssignment,
  deleteAssignment,
};
