import express from "express";
import { requestLogger } from "./middleware/requestLogger";
import cors from "cors";
import { globalLimiter } from "./middleware/rateLimiter";
import authRoute from "./modules/auth/auth.route";
import jobRoute from "./modules/job/job.route";
import dashboardRoute from "./modules/dashboard/dashboard.route";
import { errorMiddleware } from "./middleware/error.middleware";
import { authStore } from "./middleware/rateLimiter";

const app = express();
app.use(requestLogger);
app.use(cors());
app.use(express.json());
app.use(globalLimiter);

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to job-tracker!",
  });
});

app.use("/api/auth", authRoute);
app.use("/api/jobs", jobRoute);
app.use("/api/dashboard", dashboardRoute);

//TESTING ROUTES
app.post("/reset-limiter", (req, res) => {
  authStore.resetAll();
  res.json({ message: "Rate limiter reset" });
});

app.use(errorMiddleware);
app.get("/error-test", (req, res) => {
  res.status(400).json({ success: false, message: "Test error" });
});

app.get("/error-test-500", (req, res) => {
  res.status(500).json({ success: false, message: "Internal Server Error" });
});
app.use("/", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
