import express from "express";
import { requestLogger } from "./middleware/requestLogger";
import cors from "cors";
import { prisma } from "./config/prisma";
import authRoute from "./modules/auth/auth.route";
import jobRoute from "./modules/job/job.route";
import dashboardRoute from "./modules/dashboard/dashboard.route";
import { authMiddleware } from "./middleware/auth.middleware";
import { errorMiddleware } from "./middleware/error.middleware";

const app = express();
app.use(requestLogger);
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to job-tracker!",
  });
});

app.use("/api/auth", authRoute);
app.use("/api/jobs", jobRoute);
app.use("/api/dashboard", dashboardRoute);
app.use(errorMiddleware);

app.use("/", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
