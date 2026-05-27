# Building a Simple Crypto Reversal Quantitative Strategy

**Topic/Category:** Quantitative Finance / Crypto Trading
**Primary Goal of the Reel:** To introduce a basic mean-reversion trading strategy for cryptocurrencies and demonstrate its performance in a "perfect world" backtest while highlighting the importance of transaction costs.

---

## Executive Summary

This reel presents a "simplest quant strategy" based on price reversals in the crypto market. Using three years of hourly data from Binance for major coins like BTC, ETH, and SOL, the creator demonstrates a strategy that shorts recent gainers and buys recent losers. While the backtest shows an impressive Sharpe ratio of 5.1 compared to 0.6 for a buy-and-hold approach, the creator warns that these results ignore critical real-world factors like slippage and commissions, which often "vanish" the returns of such high-frequency strategies.

## Core Insights & Takeaways

- **Mean-Reversion Principle:** The strategy assumes that short-term price movements tend to reverse (if it went up, it's likely to go down in the next interval, and vice versa).
- **Portfolio Construction:** The strategy utilizes a dollar-neutral approach, meaning the total value of long positions equals the total value of short positions, which helps mitigate market-wide risk.
- **High Sharpe Ratio Illusion:** A Sharpe ratio of 5+ is exceptional but usually indicative of an "over-idealized" backtest that lacks realistic friction (transaction costs).
- **Educational Starting Point:** This strategy serves as an excellent entry point for beginners in quant research to understand data fetching, signal generation, and portfolio balancing.

## Narrative & Step-by-Step Breakdown

1.  **Data Collection:** Pull hourly price data from Binance for a universe of cryptocurrencies (e.g., BTC, ETH, SOL, BNB, ADA, XRP).
2.  **Signal Generation:**
    - If the price increased in the last hour: **Short** the asset.
    - If the price decreased in the last hour: **Buy** (Long) the asset.
3.  **Portfolio Management:**
    - Make the portfolio **dollar neutral** (Total Longs = Total Shorts).
    - **Normalize weights** so the total absolute exposure equals 1 (consistent risk).
4.  **Execution:** Rebalance the portfolio every hour.
5.  **Evaluation:** Compare cumulative returns against a simple buy-and-hold strategy over the same period.

## Visual Context & On-Screen Text

- **Graphs:** The video prominently features two cumulative percentage return graphs.
    - **Reversal Strategy Graph:** Shows a steady, upward-sloping line with very low volatility, resulting in a **Sharpe = 5.1**.
    - **Buy and Hold Graph:** Shows significantly higher volatility and periods of deep drawdown, resulting in a **Sharpe = 0.6**.
- **Code Snippets:** Multiple frames show Python code using `binance.client` and `pandas`.
- **Crypto Icons:** Icons for BNB, BTC, ADA, SOL, XRP, and ETH are shown when discussing the asset universe.
- **Overlay Text:** Key phrases like "SIMPLEST QUANT STRATEGY", "SHARPE = 5.1", and "THE CATCH" emphasize the narrative shifts.

## Verbatim Templates & Scripts

### Binance Data Fetching Script
```python
from binance.client import Client as bnb_client

cols = ['close', 'volume', 'quote_volume', 'num_trades', 'taker_base_volume', 'taker_quote_volume']
client = bnb_client(tld='us')

def get_binance_px(symbol, freq, start, end):
    data = client.get_historical_klines(symbol, freq, start, end)
    columns = ['open_time', 'open', 'high', 'low', 'close', 'volume', 'close_time', 'quote_volume', 'num_trades', 'taker_base_volume', 'taker_quote_volume', 'ignore']
    data = pd.DataFrame(data, columns=columns)
    
    # Convert from POSIX timestamp
    data['open_time'] = pd.to_datetime(data['open_time'], unit='ms')
    data['close_time'] = pd.to_datetime(data['close_time'], unit='ms')
    data = data.set_index('open_time')
    return data
```

### Strategy Logic
```python
# If previous return is positive go short; if negative, go long
positions = ret[univ].shift(1).apply(np.sign) * -1

# Dollar-neutral (go long and short equal number of dollars)
positions = positions.subtract(positions.mean(axis=1), axis=0)

# Fully invested (normalize so total absolute exposure sums to 1)
positions = positions.divide(positions.abs().sum(axis=1), axis=0)
```

## Hook & Call to Action

- **The Hook:** "This is the simplest quant strategy you can build." combined with a high-growth profit graph overlay.
- **Call to Action:** "Comment 'quant' for the code and follow for more mathematical finance content."
