# Building the Simplest Crypto Quant Reversal Strategy

**Topic/Category:** Quant Finance / Crypto Trading
**Primary Goal of the Reel:** To introduce a simple hourly reversal strategy for cryptocurrencies and demonstrate its performance in a "perfect world" backtest while cautioning about real-world costs.

---

## Executive Summary

This video breaks down a basic quantitative trading strategy based on price reversal: buying assets that dropped in the last hour and shorting those that rose. Using three years of hourly Binance data for major coins like Bitcoin, Ethereum, and Solana, the creator demonstrates a strategy that achieves a Sharpe ratio over 5 in a idealized backtest. However, the video concludes with a crucial caveat: transaction costs like slippage and commissions can quickly erode these high theoretical returns.

## Core Insights & Takeaways

- **The Strategy Logic:** A mean-reversion approach where you short recent winners and buy recent losers on an hourly timeframe.
- **Portfolio Management:** The strategy utilizes a "dollar-neutral" approach (equal long and short exposure) and is "fully invested" (total absolute exposure equals 1) to maintain consistent risk.
- **Backtest Results:** The strategy shows a significantly higher Sharpe ratio (>5) and smoother cumulative returns compared to a simple "buy and hold" strategy in a zero-fee environment.
- **The Reality Check:** High-frequency rebalancing (hourly) is extremely sensitive to transaction costs. For a strategy like this to be viable, it must survive commission and slippage.

## Narrative & Step-by-Step Breakdown

1.  **Introduction & Data:** The creator starts by pulling 3 years of hourly data from Binance for a universe of coins (BTC, ETH, SOL, XRP, ADA, BNB).
2.  **The Signal:** The core logic is defined: if the price went up in the last hour, short it; if it went down, buy it.
3.  **Optimization:** The portfolio is made dollar-neutral and weights are normalized so the total absolute exposure is 1.
4.  **Rebalancing:** The strategy rebalances every hour.
5.  **Comparison:** The creator plots the cumulative returns of this reversal strategy against a "buy and hold" benchmark.
6.  **Conclusion:** The creator highlights the amazing Sharpe ratio but warns about the "catch" (transaction costs).

## Visual Context & On-Screen Text

- **Code Overlays:** The video extensively uses on-screen code snippets (Python/Pandas) to show exactly how the data is processed and the strategy is calculated.
- **Performance Graphs:**
    - A "Reversal Strategy" plot shows a very steady, linear-looking growth in cumulative percentage returns from 2022 to 2024.
    - A "Buy and Hold" plot shows the typical high volatility of the crypto market during the same period, with significant drawdowns.
- **On-Screen Captions:** Key phrases like "I PULLED HOURLY", "3 YEARS", "IF IN THE", "BUY IT THEN", and "WE GET A" emphasize the spoken points.

## Verbatim Templates & Scripts

### Data Fetching Script
```python
from binance.client import Client as bnb_client

cols = ['close', 'volume', 'quote_volume', 'num_trades', 'taker_base_volume', 'taker_quote_volume']
client = bnb_client(tld='US')

def get_binance_px(symbol, freq, start, end):
    data = client.get_historical_klines(symbol, freq, start, end)
    columns = ['open_time', 'open', 'high', 'low', 'close', 'volume', 'close_time', 'quote_volume',
               'num_trades', 'taker_base_volume', 'taker_quote_volume', 'ignore']
    data = pd.DataFrame(data, columns=columns)
    
    # Convert from POSIX timestamp
    data['open_time'] = pd.to_datetime(data['open_time'], unit='ms')
    data['close_time'] = pd.to_datetime(data['close_time'], unit='ms')
    data = data.set_index('open_time')
    return data

univ = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'XRPUSDT', 'ADAUSDT', 'BNBUSDT']
```

### Signal & Position Logic
```python
# if previous return is positive go short; if negative, go long
positions = ret[univ].shift(1).apply(np.sign) * -1

# dollar-neutral (go long and short equal number of dollars)
positions = positions.subtract(positions.mean(axis=1), axis=0)

# fully invested (normalize so total absolute exposure sums to 1)
positions = positions.divide(positions.abs().sum(axis=1), axis=0)
```

## Hook & Call to Action

- **The Hook:** "This is the simplest quant strategy you can build." (A bold claim that appeals to beginners in quant research).
- **Call to Action:** "Comment quant for the code and follow for more mathematical finance content."
