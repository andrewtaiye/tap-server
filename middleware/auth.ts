require("dotenv").config();
import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");

interface JWTRequest extends Request {
  decoded?: {};
}

const auth = (req: JWTRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      console.log("Error: Missing token");
      res.status(400).json({ status: "error", message: "Missing Token" });
      return;
    }

    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    req.decoded = decoded;

    console.log("Authenticated");
    next();
  } catch (err: any) {
    console.error(err.message);
    res.status(400).json({ status: "error", message: "Authorization failed" });
  }
};

module.exports = auth;
