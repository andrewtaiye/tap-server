require("dotenv").config;
import { Request, Response } from "express";

const getAssessment = async (req: Request, res: Response) => {
  try {
    res.json({ status: "ok", message: "assessment retrieved" });
  } catch (err: any) {
    console.error(err.message);
    res
      .status(400)
      .json({ status: "error", message: "failed to retrieve assessment" });
  }
};

const createAssessment = async (req: Request, res: Response) => {
  try {
    res.json({ status: "ok", message: "assessment created" });
  } catch (err: any) {
    console.error(err.message);
    res
      .status(400)
      .json({ status: "error", message: "failed to create assessment" });
  }
};

const updateAssessment = async (req: Request, res: Response) => {
  try {
    res.json({ status: "ok", message: "assessment updated" });
  } catch (err: any) {
    console.error(err.message);
    res
      .status(400)
      .json({ status: "error", message: "failed to update assessment" });
  }
};

const deleteAssessment = async (req: Request, res: Response) => {
  try {
    res.json({ status: "ok", message: "assessment deleted" });
  } catch (err: any) {
    console.error(err.message);
    res
      .status(400)
      .json({ status: "error", message: "failed to delete assessment" });
  }
};

module.exports = {
  getAssessment,
  createAssessment,
  updateAssessment,
  deleteAssessment,
};
