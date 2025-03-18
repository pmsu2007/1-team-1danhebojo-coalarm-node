const ccxt = require('ccxt');
const ccxtpro = ccxt.pro;
const { logger, formatMessage } = require('../logger');
const { saveTicker } = require('../db');
const { messages } = require('../messages');

// Binance watchTicker 실행
(async () => {
  const exchangeId = 'binance';
  const symbol = 'BTC/USDT';
  const exchange = new ccxtpro[exchangeId]({
    enableRateLimit: true,
  });

  while (true) {
    logger.info(
      formatMessage(messages.app.connectTicker, { app: 'Binance Ticker' }),
    );
    try {
      const ticker = await exchange.watchTicker(symbol);
      await saveTicker(exchangeId, symbol, ticker);
    } catch (error) {
      logger.error(
        formatMessage(messages.error.failWatchTicker, { error: error.message }),
      );
    }
  }
})();
