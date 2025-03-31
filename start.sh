#!/bin/bash

# 쉘 에러 발생 시 즉시 종료
set -e

echo "===================================="
echo "🟡 [1/2] 심볼 동기화 워커 실행"
echo "===================================="
pm2 start pm2.config.json --only load_symbol

sleep 5

echo ""
echo "===================================="
echo "🟢 [2/2] 데이터 수집 워커 실행"
echo "===================================="
pm2 start pm2.config.json --only binance_ticker,binance_trade,upbit_ticker,upbit_trade

echo ""
echo "✅ 모든 작업 완료"