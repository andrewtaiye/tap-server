require("dotenv").config();
import { Request, Response, NextFunction } from "express";
const client = require("../db/db");
const jwt = require("jsonwebtoken");
const { fetchCall } = require("../utility/utility");

interface JWTRequest extends Request {
  decoded?: {};
  newToken?: string;
}

const auth = async (req: JWTRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    // Check if a token was sent from front-end
    if (!token) {
      console.log("Error: Missing token");
      res.status(400).json({ status: "authErr", message: "Missing token" });
      return;
    }
    const decoded = jwt.decode(token);

    // Check if token exists in database
    let query = `SELECT id, type FROM tokens WHERE id = '${decoded.jti}';`;
    let result = await client.query(query);

    if (result.rowCount === 0) {
      console.log("Error: Invalid token");
      res.status(400).json({ status: "authErr", message: "Invalid token" });
      return;
    }

    if (result.rows[0].type === "access") {
      jwt.verify(token, process.env.ACCESS_SECRET);
      req.decoded = decoded;
      console.log("Authenticated");
      next();
      return;
    }

    if (result.rows[0].type === "refresh") {
      jwt.verify(token, process.env.REFRESH_SECRET);
      let url = process.env.REACT_APP_API_ENDPOINT + `misc/refresh`;
      let body = { refresh: token };
      let response = await fetchCall(url, "", "POST", body);

      req.newToken = response.data.access;
      req.decoded = decoded;
      console.log("Authenticated");
      next();
      return;
    }
  } catch (err: any) {
    console.error(err.message);
    res
      .status(400)
      .json({ status: "authErr", message: "Authorization failed" });
  }
};

module.exports = auth;
