require("dotenv").config(); // .env 파일 로드

const ccxt = require("ccxt");
const { saveCoins, deleteCoins, updateCoins, getAllCoins } = require("../db");
const { logger, formatMessage } = require("../logger");
const { writeValidSymbols } = require("../file");
const cron = require("node-cron");

const syncSymbols = async (currentValidSymbols, newValidSymbols) => {
  // 비교를 위해 심볼만 추출
  const newSymbolSet = new Set(newValidSymbols.map((s) => s.symbol));
  const currentSymbolSet = new Set(currentValidSymbols.map((s) => s.symbol));

  // 추가된 종목
  const addedSymbols = newValidSymbols.filter(
    (s) => !currentSymbolSet.has(s.symbol),
  );

  // 삭제된 종목
  const removedSymbols = currentValidSymbols.filter(
    (s) => !newSymbolSet.has(s.symbol),
  );

  // 이름이 변경된 종목
  const currentMap = new Map(currentValidSymbols.map((c) => [c.symbol, c]));
  const changedSymbols = newValidSymbols.filter((s) => {
    const old = currentMap.get(s.symbol);
    return old && old.name !== s.name;
  });

  // 새로운 종목 삽입
  if (addedSymbols.length > 0) {
    logger.info(
      `새로 추가된 코인:`,
      addedSymbols.map((s) => s.symbol),
    );
    await saveCoins(addedSymbols);
  }

  // 사라진 종목 삭제
  if (removedSymbols.length > 0) {
    logger.info(
      `삭제된 코인:`,
      removedSymbols.map((s) => s.symbol),
    );
    await deleteCoins(removedSymbols);
  }

  // 이름이 변경된 종목 업데이트
  if (changedSymbols.length > 0) {
    logger.info(
      `이름 변경된 종목:`,
      changedSymbols.map((s) => s.symbol),
    );
    await updateCoins(changedSymbols);
  }
};

// 업비트와 바이낸스에 동시에 존재하는 종목만 추출
const fetchValidSymbols = async () => {
  try {
    const upbit = new ccxt.upbit();
    const binance = new ccxt.binance();

    // 거래소 별 마켓 정보 로드
    await upbit.loadMarkets();
    await binance.loadMarkets();

    // 1. 업비트는 KRW 마켓만
    const upbitMarkets = Object.values(upbit.markets).filter(
      (m) => m.quote === "KRW",
    );

    // 2. 바이낸스는 USDT 현물 마켓만
    const binanceMarkets = Object.values(binance.markets).filter(
      (m) => m.quote === "USDT" && m.spot,
    );

    // 3. Set/Map 구조로 필터링
    const binanceSet = new Set(binanceMarkets.map((m) => m.base));
    const upbitMap = new Map(
      upbitMarkets.map((m) => [
        m.base,
        {
          symbol: m.base,
          name: m.info.korean_name,
        },
      ]),
    );

    // 4. 교집합 데이터를 반환
    return (
      [...upbitMap.entries()]
        // 교집합 데이터 + 테더 데이터를 포함
        .filter(([base]) => binanceSet.has(base) || base === "USDT")
        .map(([, data]) => data)
    );
  } catch (e) {
    logger.error("마켓 로딩 실패", e);
  }
};

const runSyncSymbol = async () => {
  // 1. 업비트와 바이낸스의 공동 상장 코인 목록을 추출한다.
  const newValidSymbols = await fetchValidSymbols();

  // 2. 데이터 수집 워커가 읽을 코인 목록 파일을 쓴다.
  writeValidSymbols(newValidSymbols);

  // 3. 데이터베이스에서 코인 목록 데이터를 조회한다.
  const currentValidSymbols = await getAllCoins();

  // 4. 데이터베이스에서 관리되는 코인 데이터를 최신화한다.
  await syncSymbols(currentValidSymbols, newValidSymbols);
};

(async () => {
  await runSyncSymbol();
})();

// 매일 정각 (00:00:00)
cron.schedule("0 0 * * *", async () => {
  logger.info("[코인 목록 동기화] 크론 작업 시작");

  try {
    await runSyncSymbol();
    logger.info(`[코인 목록 동기화] 크론 완료`);
  } catch (err) {
    logger.error("[코인 목록 동기화] 실패 ", err);
  }
});
