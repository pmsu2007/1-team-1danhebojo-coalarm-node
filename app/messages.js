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
    failInsertDB: "데이터베이스에 데이터를 저장하는 데애 실패했습니다: {error}",
    failWatchTicker: "티커 데이터를 받아오는 데에 실패했습니다: {error}",
    failWatchTrade: "체결 데이터를 받아오는 데에 실패했습니다: {error}",
  },
};

module.exports = { messages };
