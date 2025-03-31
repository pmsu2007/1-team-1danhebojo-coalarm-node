const ccxt = require("ccxt");
const ccxtpro = ccxt.pro;
const { logger, formatMessage } = require("../logger");
const { saveTicker } = require("../db");
const { messages } = require("../messages");
const { readValidSymbols } = require("../file");

// Binance watchTicker 실행
(async () => {
  const exchangeId = "upbit";
  const symbol = readValidSymbols("KRW");
  const exchange = new ccxtpro.upbit({
    enableRateLimit: true,
  });

  logger.info(
    formatMessage(messages.app.connectTicker, { app: "[업비트 티커]" }),
  );

  while (true) {
    try {
      const result = Object.values(await exchange.watchTickers(symbol))[0];
      const [baseSymbol, quoteSymbol] = result.symbol.split("/");
      await saveTicker(exchangeId, baseSymbol, quoteSymbol, result);
    } catch (error) {
      logger.error(
        formatMessage(messages.error.failWatchTickerUpbit, {
          error: error.message,
        }),
      );
    }
  }
})();
