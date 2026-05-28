import express from "express";
import cors from "cors";
import env from "./config/env";
import { prisma } from "./config/prisma";
import { requestLogger } from "./middleware/requestLogger";
import authRoute from "./modules/auth/auth.route";
import jobRoute from "./modules/job/job.route";
import dashboardRoute from "./modules/dashboard/dashboard.route";
import { authMiddleware } from "./middleware/auth.middleware";
import { errorMiddleware } from "./middleware/error.middleware";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(requestLogger);

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
  res.status(404).json({
    message: "404 Not Found",
  });
});

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
