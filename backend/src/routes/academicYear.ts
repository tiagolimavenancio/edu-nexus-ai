import express from "express";
import { authorize, protect } from "../middlewares/auth";
import { createAcademicYear } from "../controllers/academicYear";

const academicYearRoutes = express.Router();

academicYearRoutes.route("/create").post(protect, authorize(["admin"]), createAcademicYear);

export default academicYearRoutes;
