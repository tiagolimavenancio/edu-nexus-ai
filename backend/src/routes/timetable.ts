import express from "express";
import { generateTimeTable, getTimeTable } from "../controllers/timetable";
import { authorize, protect } from "../middlewares/auth";

const timeRouter = express.Router();

timeRouter.post("/generate", protect, authorize(["admin"]), generateTimeTable);

timeRouter.get("/:classId", protect, getTimeTable);

export default timeRouter;
