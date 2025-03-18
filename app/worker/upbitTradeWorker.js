const ccxt = require('ccxt');
const ccxtpro = ccxt.pro;
const { logger, formatMessage } = require('../logger');
const { saveTrade } = require('../db');
const { messages } = require('../messages');

// Upbit watchTrade 실행
(async () => {
  const exchangeId = 'upbit';
  const symbol = 'BTC/KRW';
  const exchange = new ccxtpro[exchangeId]({
    enableRateLimit: true,
  });

  while (true) {
    logger.info(
      formatMessage(messages.app.connectTrade, { app: 'Upbit Trade' }),
    );
    try {
      const trades = await exchange.watchTrades(symbol);

      if (trades.length > 0) {
        for (const trade of trades) {
          await saveTrade(exchangeId, symbol, trade);
        }
      }
    } catch (error) {
      logger.error(
        formatMessage(messages.error.failWatchTrade, { error: error.message }),
      );
    }
  }
})();
