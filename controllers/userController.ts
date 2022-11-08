require("dotenv").config;
import { Request, Response } from "express";

const createUser = async (req: Request, res: Response) => {
  try {
    res.json({ status: "ok", message: "user created" });
  } catch (err: any) {
    console.error(err.message);
    res.status(400).json({ status: "error", message: "failed to create user" });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    res.json({ status: "ok", message: "login successful" });
  } catch (err: any) {
    console.error(err.message);
    res.status(400).json({ status: "error", message: "failed to login" });
  }
};

const updatePassword = async (req: Request, res: Response) => {
  try {
    res.json({ status: "ok", message: "password updated" });
  } catch (err: any) {
    console.error(err.message);
    res
      .status(400)
      .json({ status: "error", message: "failed to update password" });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    res.json({ status: "ok", message: "user deleted" });
  } catch (err: any) {
    console.error(err.message);
    res.status(400).json({ status: "error", message: "failed to delete user" });
  }
};

module.exports = {
  createUser,
  login,
  updatePassword,
  deleteUser,
};
