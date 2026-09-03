export default async function handler(req, res) {
  try {
    const upbitMarkets = [
      'KRW-BTC','KRW-ETH','KRW-XRP','KRW-SOL','KRW-DOGE','KRW-ADA',
      'KRW-TRX','KRW-LINK','KRW-AVAX','KRW-DOT','KRW-SHIB','KRW-LTC',
      'KRW-BCH','KRW-ETC','KRW-XLM','KRW-ATOM','KRW-NEAR','KRW-ARB',
      'KRW-SUI','KRW-UNI','KRW-HBAR','KRW-ALGO','KRW-USDT'
    ].join(',');

    const binanceSymbols = JSON.stringify([
      'BTCUSDT','ETHUSDT','XRPUSDT','SOLUSDT','DOGEUSDT','ADAUSDT',
      'TRXUSDT','LINKUSDT','AVAXUSDT','DOTUSDT','SHIBUSDT','LTCUSDT',
      'BCHUSDT','ETCUSDT','XLMUSDT','ATOMUSDT','NEARUSDT','ARBUSDT',
      'SUIUSDT','UNIUSDT','HBARUSDT','ALGOUSDT'
    ]);

    const [upbitRes, bithumbRes, binanceRes] = await Promise.all([
      fetch(`https://api.upbit.com/v1/ticker?markets=${upbitMarkets}`),
      fetch('https://api.bithumb.com/public/ticker/ALL_KRW'),
      fetch(`https://api.binance.com/api/v3/ticker/price?symbols=${encodeURIComponent(binanceSymbols)}`),
    ]);

    const [upbit, bithumb, binance] = await Promise.all([
      upbitRes.ok ? upbitRes.json() : [],
      bithumbRes.ok ? bithumbRes.json() : null,
      binanceRes.ok ? binanceRes.json() : [],
    ]);

    res.setHeader('Cache-Control', 's-maxage=3, stale-while-revalidate=10');
    res.status(200).json({ upbit, bithumb, binance });
  } catch (e) {
    res.status(500).json({ error: 'fetch_failed', message: String(e && e.message ? e.message : e) });
  }
}
