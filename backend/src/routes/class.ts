import express from "express";
import { createClass, updateClass, deleteClass, getAllClasses } from "../controllers/class.ts";
import { authorize, protect } from "../middlewares/auth.ts";

const classRoutes = express.Router();

classRoutes.post("/create", protect, authorize(["admin"]), createClass);
classRoutes.get("/", protect, authorize(["admin"]), getAllClasses);
classRoutes.patch("/update/:id", protect, authorize(["admin"]), updateClass);
classRoutes.delete("/delete/:id", protect, authorize(["admin"]), deleteClass);

export default classRoutes;
