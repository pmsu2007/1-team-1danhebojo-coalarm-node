require("dotenv").config(); // .env 파일 로드

const { Pool } = require("pg");
const { logger } = require("./logger");
const { formatMessage } = require("./logger");
const { messages } = require("./messages");

// PostgreSQL Connection
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

pool.on("connect", () => {
  logger.info(formatMessage(messages.db.connect));
});

pool.on("error", (err) => {
  logger.error(formatMessage(messages.error.failConnectDB));
});

// DB에 Ticker 데이터 저장
const saveTicker = async (exchangeId, symbol, data) => {
  const query = `
    INSERT INTO tickers (
      timestamp, exchange, symbol, vwap, open, high, low, close, last, previous_close,
      change, percentage, base_volume, quote_volume
    ) 
    VALUES (to_timestamp($1 / 1000.0), $2, $3, $4, $5, $6, $7, $8, $9, $10, 
    $11, $12, $13, $14)
    ON CONFLICT (timestamp, exchange, symbol) DO NOTHING
  `;

  const values = [
    data.timestamp,
    exchangeId,
    symbol,
    data.vwap,
    data.open,
    data.high,
    data.low,
    data.close,
    data.last,
    data.previousClose,
    data.change,
    data.percentage,
    data.baseVolume,
    data.quoteVolume,
  ];

  try {
    await pool.query(query, values);
  } catch (e) {
    logger.error(`Error inserting trade: ${e.message}`);
  }
};

// DB에 Trade 데이터 저장
const saveTrade = async (exchangeId, symbol, data) => {
  const query = `
    INSERT INTO trades (
      timestamp, exchange, symbol, trade_id, price, amount, cost, side
    ) 
    VALUES (to_timestamp($1 / 1000.0), $2, $3, $4, $5, $6, $7, $8)
    ON CONFLICT (timestamp, exchange, symbol) DO NOTHING
  `;

  const values = [
    data.timestamp,
    exchangeId,
    symbol,
    data.id,
    data.price,
    data.amount,
    data.cost,
    data.side,
  ];

  try {
    await pool.query(query, values);
  } catch (error) {
    logger.error(
      formatMessage(messages.error.failInsertDB, { error: error.message }),
    );
  }
};

module.exports = { pool, saveTicker, saveTrade };
