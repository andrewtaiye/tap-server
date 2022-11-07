require("dotenv").config;
import express, { Express, Request, Response } from "express";
const cors = require("cors");

const app: Express = express();
const userRouter = require("./routers/userRouter");
const profileRouter = require("./routers/profileRouter");
const positionRouter = require("./routers/positionRouter");
const assignmentRouter = require("./routers/assignmentRouter");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/user", userRouter);
app.use("/profile", profileRouter);
app.use("/position", positionRouter);
app.use("/assignment", assignmentRouter);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server started on Port ${PORT}`);
});
