const ccxt = require("ccxt");
const ccxtpro = ccxt.pro;
const { logger, formatMessage } = require("../logger");
const { saveTrade } = require("../db");
const { messages } = require("../messages");
const { readValidSymbols } = require("../file");

// Upbit watchTrade 실행
(async () => {
  const exchangeId = "upbit";
  const symbol = readValidSymbols("KRW");
  const exchange = new ccxtpro.upbit({
    enableRateLimit: true,
  });

  logger.info(
    formatMessage(messages.app.connectTrade, { app: "[업비트 체결 내역]" }),
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
        formatMessage(messages.error.failWatchTradeUpbit, {
          error: error.message,
        }),
      );
    }
  }
})();
