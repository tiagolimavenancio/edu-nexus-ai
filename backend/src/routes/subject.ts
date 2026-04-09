import express from "express";
import {
  createSubject,
  getAllSubjects,
  updateSubject,
  deleteSubject,
} from "../controllers/subject.ts";
import { authorize, protect } from "../middlewares/auth.ts";

const subjectRouter = express.Router();

subjectRouter.route("/create").post(protect, authorize(["admin"]), createSubject);

subjectRouter.route("/").get(protect, authorize(["admin", "teacher"]), getAllSubjects);

subjectRouter.route("/delete/:id").delete(protect, authorize(["admin"]), deleteSubject);

subjectRouter.route("/update/:id").patch(protect, authorize(["admin"]), updateSubject);

export default subjectRouter;
