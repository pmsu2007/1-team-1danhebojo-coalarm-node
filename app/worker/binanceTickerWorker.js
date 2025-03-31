const ccxt = require("ccxt");
const ccxtpro = ccxt.pro;
const { logger, formatMessage } = require("../logger");
const { saveTicker } = require("../db");
const { messages } = require("../messages");
const { readValidSymbols } = require("../file");

// 바이낸스 티커 데이터 수집 워커

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
    formatMessage(messages.app.connectTicker, { app: "[바이낸스 티커]" }),
  );

  while (true) {
    try {
      const result = Object.values(await exchange.watchTickers(symbol))[0];
      const [baseSymbol, quoteSymbol] = result.symbol.split("/");
      await saveTicker(exchangeId, baseSymbol, quoteSymbol, result);
    } catch (error) {
      logger.error(
        formatMessage(messages.error.failWatchTickerBinance, {
          error: error.message,
        }),
      );
    }
  }
})();
