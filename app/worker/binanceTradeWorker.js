const ccxt = require("ccxt");
const ccxtpro = ccxt.pro;
const { logger, formatMessage } = require("../logger");
const { saveTrade } = require("../db");
const { messages } = require("../messages");
const { readValidSymbols } = require("../file");

// Binance watchTrade 실행
(async () => {
  const exchangeId = "binance";
  const symbol = readValidSymbols("USDT");
  const exchange = new ccxtpro.binance({
    enableRateLimit: true,
    options: {
      defaultType: "spot",
    },
  });

  logger.info(
    formatMessage(messages.app.connectTrade, { app: "[바이낸스 체결 내역]" }),
  );

  while (true) {
    try {
      const trades = await exchange.watchTradesForSymbols(symbol);
      if (trades.length > 0) {
        for (const trade of trades) {
          const [baseSymbol, quoteSymbol] = trade.symbol.split("/");
          await saveTrade(exchangeId, baseSymbol, quoteSymbol, trade);
        }
      }
    } catch (error) {
      logger.error(
        formatMessage(messages.error.failWatchTradeBinance, {
          error: error.message,
        }),
      );
    }
  }
})();
