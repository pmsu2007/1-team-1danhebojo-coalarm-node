const winston = require('winston');

const logger = winston.createLogger({
  level: 'info', // error > warn > info
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    }),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'app.log' }),
  ],
});

const formatMessage = (message, data = {}) => {
  return Object.keys(data).reduce(
    (msg, key) => msg.replace(`{${key}}`, data[key]),
    message,
  );
};

module.exports = { logger, formatMessage };
