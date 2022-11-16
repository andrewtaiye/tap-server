import "dotenv/config";
import express, { Express } from "express";
const cors = require("cors");
const seed = require("./db/seed");
seed(true);

const app: Express = express();
const userRouter = require("./routers/userRouter");
const profileRouter = require("./routers/profileRouter");
const userPositionRouter = require("./routers/userPositionRouter");
const assessmentRouter = require("./routers/assessmentRouter");
const miscRouter = require("./routers/miscRouter");
const adminRouter = require("./routers/adminRouter");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/user", userRouter);
app.use("/profile", profileRouter);
app.use("/user_position", userPositionRouter);
app.use("/assessment", assessmentRouter);
app.use("/misc", miscRouter);
app.use("/admin", adminRouter);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server started on Port ${PORT}`);
});
