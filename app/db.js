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

pool.on("error", () => {
  logger.error(formatMessage(messages.error.failConnectDB));
});

// DB에 Ticker 데이터 저장
const saveTicker = async (exchangeId, baseSymbol, quoteSymbol, data) => {
  const query = `
    INSERT INTO temp_ticker (
      timestamp, exchange, base_symbol, quote_symbol, open, high, low, close, last, previous_close,
      change, percentage, base_volume, quote_volume
    ) 
    VALUES (to_timestamp($1 / 1000.0), $2, $3, $4, $5, $6, $7, $8, $9, $10, 
    $11, $12, $13, $14)
    ON CONFLICT (timestamp, exchange, base_symbol, quote_symbol) DO NOTHING
  `;

  const values = [
    data.timestamp,
    exchangeId,
    baseSymbol,
    quoteSymbol,
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
  } catch (error) {
    logger.error(
      formatMessage(messages.error.failInsertTicker, { error: error.message }),
    );
  }
};

// DB에 Trade 데이터 저장
const saveTrade = async (exchangeId, baseSymbol, quoteSymbol, data) => {
  const query = `
    INSERT INTO temp_trade (
      timestamp, exchange, base_symbol, quote_symbol, trade_id, price, amount, cost, side
    ) 
    VALUES (to_timestamp($1 / 1000.0), $2, $3, $4, $5, $6, $7, $8, $9)
    ON CONFLICT (timestamp, exchange, base_symbol, quote_symbol) DO NOTHING
  `;

  const values = [
    data.timestamp,
    exchangeId,
    baseSymbol,
    quoteSymbol,
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
      formatMessage(messages.error.failInsertTrade, { error: values }),
    );
  }
};

const getAllCoins = async () => {
  const query = "SELECT symbol, name FROM coins";

  try {
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    logger.error(
      formatMessage(messages.error.failReadCoin, { error: error.message }),
    );
  }
};

const saveCoins = async (coins) => {
  if (!coins.length) return;

  const values = coins
    .map((coin) => `('${coin.name}', '${coin.symbol}')`)
    .join(", ");
  const query = `
    INSERT INTO coins (
        name, symbol
    )
    VALUES ${values}
    ON CONFLICT (symbol) DO NOTHING
  `;

  try {
    await pool.query(query);
  } catch (error) {
    logger.error(
      formatMessage(messages.error.failInsertCoin, { error: error.message }),
    );
  }
};

const deleteCoins = async (coins) => {
  if (!coins.length) return;

  const symbols = coins.map((coin) => `'${coin.symbol}'`).join(", ");
  const query = `DELETE FROM coins WHERE symbol IN (${symbols});`;

  try {
    await pool.query(query);
  } catch (error) {
    logger.error(
      formatMessage(messages.error.failDeleteCoin, { error: error.message }),
    );
  }
};

const updateCoins = async (coins) => {
  if (!coins.length) return;

  const updates = coins
    .map((coin) => `WHEN '${coin.symbol}' THEN '${coin.name}'`)
    .join("\n ");
  const symbols = coins.map((coin) => `'${coin.symbol}'`).join(", ");

  const query = `
    UPDATE coins
    SET name = CASE symbol
      ${updates}
    END
    WHERE symbol IN (${symbols});
  `;

  try {
    await pool.query(query);
  } catch (error) {
    logger.error(
      formatMessage(messages.error.failUpdateCoin, { error: error.message }),
    );
  }
};

module.exports = {
  pool,
  saveTicker,
  saveTrade,
  getAllCoins,
  saveCoins,
  updateCoins,
  deleteCoins,
};
