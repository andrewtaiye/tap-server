"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors = require("cors");
const client = require("./db/db");
// (async () => {
//   const result = await client.query(
//     `INSERT INTO users (username, password) VALUES ('test', '123');`,
//     (err: Error, res: Response) => {
//       if (err) throw err;
//       console.log(res);
//     }
//   );
// })();
const app = (0, express_1.default)();
const userRouter = require("./routers/userRouter");
const profileRouter = require("./routers/profileRouter");
const positionRouter = require("./routers/positionRouter");
const assessmentRouter = require("./routers/assessmentRouter");
app.use(cors());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use("/user", userRouter);
app.use("/profile", profileRouter);
app.use("/position", positionRouter);
app.use("/assessment", assessmentRouter);
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server started on Port ${PORT}`);
});
