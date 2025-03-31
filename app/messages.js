const messages = {
  app: {
    start: "서버가 시작되었습니다.",
    stop: "서버가 중지되었습니다.",
    restart: "서버가 재시작되었습니다.",
    connectTicker: "티커 데이터 웹소켓 연결에 성공했습니다: {app}",
    connectTrade: "체결 데이터 웹소켓 연결에 성공했습니다: {app}",
  },
  db: {
    connect: "데이터베이스에 성공적으로 연결되었습니다.",
  },
  error: {
    failConnectDB: "데이터베이스 연결에 실패했습니다: {error}",
    failReadCoin: "코인 데이터를 조회하는 데에 실패했습니다: {error}",
    failInsertCoin: "코인 데이터를 저장하는 데에 실패했습니다: {error}",
    failDeleteCoin: "코인 데이터를 삭제하는 데에 실패했습니다: {error}",
    failUpdateCoin: "코인 데이터를 수정하는 데에 실패했습니다: {error}",
    failInsertTicker: "티커 데이터를 저장하는 데에 실패했습니다: {error}",
    failInsertTrade: "체결 내역 데이터를 저장하는 데에 실패했습니다: {error}",
    failWatchTickerUpbit:
      "[업비트] 티커 데이터를 받아오는 데에 실패했습니다: {error}",
    failWatchTickerBinance:
      "[바이낸스] 티커 데이터를 받아오는 데에 실패했습니다: {error}",
    failWatchTradeUpbit:
      "[업비트] 체결 데이터를 받아오는 데에 실패했습니다: {error}",
    failWatchTradeBinance:
      "[바이낸스] 체결 데이터를 받아오는 데에 실패했습니다: {error}",
  },
};

module.exports = { messages };
