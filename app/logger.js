const winston = require("winston");

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
  }),
);

const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
  }),
);

const logger = winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.Console({ format: consoleFormat }),
    new winston.transports.File({ filename: "app.log", format: fileFormat }),
  ],
});

const formatMessage = (message, data = {}) => {
  return Object.keys(data).reduce(
    (msg, key) => msg.replace(`{${key}}`, data[key]),
    message,
  );
};

module.exports = { logger, formatMessage };
