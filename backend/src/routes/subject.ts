import express from "express";
import {
  createSubject,
  getAllSubjects,
  updateSubject,
  deleteSubject,
} from "../controllers/subject.ts";
import { authorize, protect } from "../middlewares/auth.ts";

const subjectRoutes = express.Router();

subjectRoutes.route("/create").post(protect, authorize(["admin"]), createSubject);

subjectRoutes.route("/").get(protect, authorize(["admin", "teacher"]), getAllSubjects);

subjectRoutes.route("/delete/:id").delete(protect, authorize(["admin"]), deleteSubject);

subjectRoutes.route("/update/:id").patch(protect, authorize(["admin"]), updateSubject);

export default subjectRoutes;
