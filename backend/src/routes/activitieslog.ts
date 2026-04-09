import express from "express";
import { authorize, protect } from "../middlewares/auth";
import { getAllActivities } from "../controllers/activitieslog";

const logsRouter = express.Router();

logsRouter.get("/", protect, authorize(["admin", "teacher"]), getAllActivities);

export default logsRouter;
