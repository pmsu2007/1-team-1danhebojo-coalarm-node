const fs = require("fs");
const path = require("path");
const { logger } = require("./logger");

const SYMBOL_FILE_PATH = path.resolve(__dirname, "./shared/valid-symbols.json");

const writeValidSymbols = (symbols) => {
  try {
    fs.writeFileSync(
      SYMBOL_FILE_PATH,
      JSON.stringify(symbols, null, 2),
      "utf-8",
    );
    logger.info(
      `공통 심볼 파일 저장 완료 (${symbols.length}종목): ${SYMBOL_FILE_PATH}`,
    );
  } catch (e) {
    logger.error("심볼 파일 저장 실패:", e);
  }
};

const readValidSymbols = (quote) => {
  try {
    const data = fs.readFileSync(SYMBOL_FILE_PATH, "utf-8");
    const symbols = JSON.parse(data);
    return symbols
      .filter((s) => !(quote === "USDT" && s.symbol === "USDT"))
      .map((s) => `${s.symbol}/${quote}`);
  } catch (err) {
    logger.error("심볼 파일 읽기 실패:", err);
    return [];
  }
};

module.exports = { readValidSymbols, writeValidSymbols };
