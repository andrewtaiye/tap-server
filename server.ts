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
const instructorRouter = require("./routers/instructorRouter");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/user", userRouter);
app.use("/api/profile", profileRouter);
app.use("/api/user_position", userPositionRouter);
app.use("/api/assessment", assessmentRouter);
app.use("/api/misc", miscRouter);
app.use("/api/admin", adminRouter);
app.use("/api/instructor", instructorRouter);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server started on Port ${PORT}`);
});
