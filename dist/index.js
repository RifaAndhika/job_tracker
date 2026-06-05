"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const requestLogger_1 = require("./middleware/requestLogger");
const cors_1 = __importDefault(require("cors"));
const auth_route_1 = __importDefault(require("./modules/auth/auth.route"));
const job_route_1 = __importDefault(require("./modules/job/job.route"));
const dashboard_route_1 = __importDefault(require("./modules/dashboard/dashboard.route"));
const error_middleware_1 = require("./middleware/error.middleware");
const app = (0, express_1.default)();
app.use(requestLogger_1.requestLogger);
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to job-tracker!",
    });
});
app.use("/api/auth", auth_route_1.default);
app.use("/api/jobs", job_route_1.default);
app.use("/api/dashboard", dashboard_route_1.default);
app.use(error_middleware_1.errorMiddleware);
app.use("/", (req, res) => {
    res.status(404).json({ message: "Route not found" });
});
app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map