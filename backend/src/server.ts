import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express, { type Application, type Request, type Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import { serve } from "inngest/express";
import { connectDB } from "./config/db";
import userRoutes from "./routes/user";
import logsRoutes from "./routes/activitieslog";
import academicYearRoutes from "./routes/academicYear";
import classRoutes from "./routes/class";
import subjectRoutes from "./routes/subject";
import { inngest, functions } from "./inngest";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).json({ status: "Error", message: err.message });
});

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ status: "OK", message: "Server is healthy" });
});

app.use("/api/users", userRoutes);
app.use("/api/activities", logsRoutes);
app.use("/api/academic-years", academicYearRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/inngest", serve({ client: inngest, functions }));

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });
});
