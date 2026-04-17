import { createBrowserRouter } from "react-router";
import AcademicYear from "@/pages/AcademicYear";
import Dashboard from "@/pages/Dashboard";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import UserManagement from "@/pages/UserManagement";
import PrivateRoutes from "@/routes/PrivateRoutes";
import Classes from "@/pages/Classes";
import { Subjects } from "@/pages/Subjects";
import Timetable from "@/pages/Timetable";
import Exams from "@/pages/Exams";
import Exam from "@/pages/Exam";

export const router = createBrowserRouter([
  {
    children: [
      // public routes
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },

      //protected routes
      {
        element: <PrivateRoutes />, // Assuming PrivateRoutes is imported,
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "activities-log", element: <Dashboard /> },
          { path: "settings/academic-years", element: <AcademicYear /> },
          {
            path: "users/students",
            element: (
              <UserManagement
                role="student"
                title="Students"
                description="Manage student directory and class assignments."
              />
            ),
          },
          {
            path: "users/teachers",
            element: (
              <UserManagement
                role="teacher"
                title="Teachers"
                description="Manage teaching staff."
              />
            ),
          },
          {
            path: "users/parents",
            element: <UserManagement role="parent" title="Parents" description="Manage Parents." />,
          },
          {
            path: "users/admins",
            element: <UserManagement role="admin" title="Admins" description="Manage Admins." />,
          },
          {
            path: "classes",
            element: <Classes />,
          },
          {
            path: "subjects",
            element: <Subjects />,
          },
          {
            path: "timetable",
            element: <Timetable />,
          },
          {
            path: "lms/exams",
            element: <Exams />,
          },
          {
            path: "lms/exams/:id",
            element: <Exam />,
          },
        ],
      },
    ],
  },
]);
