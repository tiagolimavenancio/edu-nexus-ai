import express from "express";
import { authorize, protect } from "../middlewares/auth";
import { getAllActivities } from "../controllers/activitieslog";

const logsRoutes = express.Router();

logsRoutes.get("/", protect, authorize(["admin", "teacher"]), getAllActivities);

export default logsRoutes;
