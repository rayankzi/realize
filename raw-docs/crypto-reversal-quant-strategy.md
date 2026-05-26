# Simple Crypto Reversal: The Simplest Quant Strategy

**Topic/Category:** Quant Finance / Crypto Trading
**Primary Goal of the Reel:** To introduce beginners to a basic mean-reversion quant strategy and highlight the importance of considering transaction costs in backtesting.

---

## Executive Summary

The video demonstrates a "simplest" quantitative trading strategy applied to cryptocurrency markets: a basic reversal (mean reversion) approach. By analyzed hourly data from Binance for coins like Bitcoin, Ethereum, and Solana, the creator shows that a simple "buy the dips, short the peaks" strategy can produce a backtested Sharpe ratio of over five. However, the creator provides a crucial reality check, noting that these "perfect world" results often vanish once slippage and commissions are factored in.

## Core Insights & Takeaways

- **Mean Reversion Logic:** The strategy relies on the assumption that price movements will reverse over short timeframes (hourly).
- **Portfolio Construction:** The strategy uses a dollar-neutral approach, meaning total longs equal total shorts, with normalized weights and hourly rebalancing.
- **Backtest vs. Reality:** A raw backtest can show spectacular results (Sharpe > 5), but real-world execution is difficult due to transaction costs.
- **Educational Starting Point:** Despite its flaws in a live environment, the creator suggests this is an ideal starting point for learning quantitative research.

## Narrative & Step-by-Step Breakdown

- **Beginning (The Hook):** The creator introduces the "simplest quant strategy you can build" and shows a highly profitable-looking cumulative return graph.
- **Middle (The Method):** 
    1. Data source: Hourly Binance data over the last three years.
    2. Logic: If the price went up in the last hour, short it; if it went down, buy it.
    3. Management: Make the portfolio dollar-neutral, normalize weights, and rebalance every hour.
- **End (The Reality Check):** The creator reveals the "catch"—transaction costs like slippage and commission are ignored in this backtest. He concludes by offering the code to those who comment "quant."

## Visual Context & On-Screen Text

- **On-Screen Text:** Large green and white text overlays saying "SIMPLEST QUANT STRATEGY" and "REVERSAL STRATEGY".
- **Visual Aids:** The creator shows a comparison graph between the "Reversal Strategy" (a steady upward slope) and a "Buy and Hold" strategy (much more volatile with lower returns).
- **Physical Context:** The creator is speaking into a small microphone in an office/home setup with code visible on a monitor in the background.

## Verbatim Templates & Scripts

> **The Reversal Strategy:**
> "If in the last hour the price went up, short it. If it went down, buy it. Then make your portfolio dollar neutral, normalize the weights, and rebalance every hour."

## Hook & Call to Action

- **The Hook:** "This is the simplest quant strategy you can build." (Paired with a high-performing profit graph).
- **Call to Action:** "Comment quant for the code and follow for more mathematical finance content."
