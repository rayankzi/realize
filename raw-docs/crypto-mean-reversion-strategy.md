# The Simplest Crypto Mean-Reversion Strategy (And Why It Almost Works)

**Topic/Category:** Quantitative Finance / Algorithmic Trading
**Primary Goal of the Reel:** Introduce beginners to quant research by walking through a simple hourly mean-reversion strategy on crypto — showing both its impressive backtested performance and the critical real-world flaw (transaction costs) that breaks it.

---

## Executive Summary

The creator builds a basic mean-reversion (reversal) strategy on crypto assets (Bitcoin, Ethereum, Solana, and others) using three years of hourly Binance data. The rule is dead simple: if price went up last hour, short it; if it went down, buy it. The portfolio is made dollar-neutral and rebalanced every hour. The backtest produces a stunning Sharpe ratio above 5 — but the catch is that transaction costs (slippage and commission) are completely ignored. Once accounted for, the returns vanish. Despite its real-world limitations, this is positioned as the ideal starting point for aspiring quant researchers.

## Core Insights & Takeaways

- **Mean-Reversion Premise:** Short recent winners and buy recent losers on an hourly timeframe — a classic short-horizon reversal signal used in professional quant trading.
- **Dollar-Neutral Construction:** Total long exposure equals total short exposure, reducing directional market risk and isolating the signal's edge.
- **Weight Normalization:** Positions are scaled so total absolute exposure equals 1, keeping risk consistent across rebalances.
- **Backtest Looks Great... Until It Doesn't:** A Sharpe ratio above 5 is exceptional — but it's a perfect-world backtest with zero transaction costs. The buy-and-hold benchmark has a Sharpe near zero, making the strategy look even more impressive by comparison.
- **Transaction Costs Are the Strategy Killer:** High-frequency reversal strategies earn very small per-trade returns. Slippage and commission eat through those margins quickly — this is why the strategy fails in practice.
- **Value as a Learning Tool:** Even though it doesn't work live, building this strategy teaches the full pipeline: data ingestion, signal construction, portfolio normalization, backtesting, and performance evaluation.

## Narrative & Step-by-Step Breakdown

**Beginning (Hook):** Opens with the promise of "the simplest quant strategy you can build" — immediately targeting beginners curious about algorithmic trading.

**Middle (Strategy Build):**
1. Pull hourly OHLCV data from Binance for BTC, ETH, SOL, and a few other cryptos over 3 years.
2. Compute the 1-hour return for each asset.
3. Signal: short assets with positive returns, go long on assets with negative returns.
4. Make the portfolio dollar-neutral (longs = shorts in dollar terms).
5. Normalize weights so total absolute exposure = 1.
6. Rebalance the portfolio every hour.
7. Compute per-period returns and plot cumulative PnL.

**End (The Twist + Lesson):**
- The backtest Sharpe exceeds 5, but this ignores slippage and commission entirely.
- A real strategy must survive transaction costs — this one does not.
- Despite that, this is the right starting point for beginners before exploring more sophisticated signals.

## Visual Context & On-Screen Text

No frames were extracted for this video. This analysis is based entirely on the transcription and caption.

Based on the transcription, the creator likely showed:
- A cumulative returns chart of the reversal strategy (Sharpe > 5)
- A comparison cumulative returns chart for a buy-and-hold benchmark (Sharpe ≈ 0)
- Possibly a code snippet or terminal output (the offer of "comment quant for the code" suggests code exists)

## Hook & Call to Action

- **The Hook:** Opens with a direct, confidence-inspiring claim: *"This is the simplest quant strategy you can build."* — instantly establishes value and accessibility for the target audience of aspiring quant traders.
- **Call to Action:** Comment "quant" to receive the source code; follow the account for more mathematical finance content.
