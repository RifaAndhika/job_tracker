import pino from "pino";

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  redact: {
    paths: ["req.headers.authorization", "password", "token"], // data sensitif
    censor: "***REDACTED***",
  },
  transport: {
    target: "pino-pretty",
    options: { colorize: true },
  },
});
