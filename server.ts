import "dotenv/config";
import express, { Express } from "express";
const cors = require("cors");
const client = require("./db/db");

const app: Express = express();
const userRouter = require("./routers/userRouter");
const profileRouter = require("./routers/profileRouter");
const positionRouter = require("./routers/positionRouter");
const assessmentRouter = require("./routers/assessmentRouter");
const enumRouter = require("./routers/enumRouter");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/user", userRouter);
app.use("/profile", profileRouter);
app.use("/position", positionRouter);
app.use("/assessment", assessmentRouter);
app.use("/enum", enumRouter);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server started on Port ${PORT}`);
});
