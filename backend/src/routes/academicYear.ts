import express from "express";
import { authorize, protect } from "../middlewares/auth";
import {
  createAcademicYear,
  deleteAcademicYear,
  getAllAcademicYears,
  getCurrentAcademicYear,
  updateAcademicYear,
} from "../controllers/academicYear";

const academicYearRouter = express.Router();

academicYearRouter.route("/").get(protect, authorize(["admin"]), getAllAcademicYears);

academicYearRouter.route("/create").post(protect, authorize(["admin"]), createAcademicYear);
academicYearRouter.route("/current").post(protect, authorize(["admin"]), getCurrentAcademicYear);
academicYearRouter.route("/update/:id").patch(protect, authorize(["admin"]), updateAcademicYear);
academicYearRouter.route("/delete/:id").delete(protect, authorize(["admin"]), deleteAcademicYear);

export default academicYearRouter;
