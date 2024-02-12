import winston, { createLogger, format, transports } from "winston";
import { Request, Response } from "express";

const logFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.errors({ stack: true }),
  format.splat(),
  format.json()
);

const printfFormat = format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const logger = createLogger({
  level: "info",
  format: format.combine(printfFormat, logFormat),
  defaultMeta: { service: "backend api logs" },
  transports: [
    new transports.Console(),
    new transports.File({ filename: "error.log", level: "error" }),
    new transports.File({ filename: "combined.log" }),
    new transports.File({ filename: "http.log" }),
  ],
});

export const httpLoggerMiddleware = (
  req: Request,
  res: Response,
  next: Function
) => {
  const { method, url, body, params, query } = req;
  const { statusCode } = res;

  const logMessage = {
    timestamp: new Date().toISOString(),
    method,
    url,
    body,
    params,
    query,
    statusCode,
  };

  logger.info("HTTP Request", logMessage);

  res.on("finish", () => {
    const responseLogMessage = {
      timestamp: new Date().toISOString(),
      method,
      url,
      statusCode,
    };
    logger.info("HTTP Response", responseLogMessage);
  });

  next();
};

export default logger;
