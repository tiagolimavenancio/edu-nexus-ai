import express from "express";
import { authorize, protect } from "../middlewares/auth";
import {
  createAcademicYear,
  deleteAcademicYear,
  getAllAcademicYears,
  getCurrentAcademicYear,
  updateAcademicYear,
} from "../controllers/academicYear";

const academicYearRoutes = express.Router();

academicYearRoutes.route("/").get(protect, authorize(["admin"]), getAllAcademicYears);

academicYearRoutes.route("/create").post(protect, authorize(["admin"]), createAcademicYear);
academicYearRoutes.route("/current").post(protect, authorize(["admin"]), getCurrentAcademicYear);
academicYearRoutes.route("/update/:id").patch(protect, authorize(["admin"]), updateAcademicYear);
academicYearRoutes.route("/delete/:id").delete(protect, authorize(["admin"]), deleteAcademicYear);

export default academicYearRoutes;
