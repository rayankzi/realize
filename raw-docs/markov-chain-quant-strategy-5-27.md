# How to Make 10k Stealing Quant Strategies: Markov Chain Strategy Pt. 2

**Topic/Category:** Quant Finance / Trading Strategy
**Primary Goal of the Reel:** To demonstrate how to adapt and deploy a quant trading strategy (Markov Chains) based on Jim Simons' methods to achieve high returns.

---

## Executive Summary

This video is part of a series where the creator explores "stealing" and implementing quant strategies from the internet. In this installment, he focuses on Markov Chains—a mathematical system where future market states are predicted based on the current state. The creator outlines a simple entry and exit logic based on bullish/bearish transitions, shows the mathematical formulation used for his model, and shares backtesting results showing a 56% return on NVIDIA (NVDA) before deploying to E-Trade.

## Core Insights & Takeaways

- **Markov Chain Application:** The strategy models price action as a discrete-time Markov process.
- **State-Based Trading:** Market states are simplified into "Bullish" and "Bearish" based on price changes from the previous bar.
- **Automated Workflow:** The process involves strategy identification, mathematical modeling, automated backtesting, and finally deployment to a brokerage (E-Trade).
- **Performance Metrics:** The creator claims a 56.14% total return with a Sharpe Ratio of 0.74 using this specific Markov Chain implementation on NVDA.

## Narrative & Step-by-Step Breakdown

1. **Introduction:** The creator introduces the concept of using Markov Chains, a method famously used by Jim Simons (Renaissance Technologies).
2. **Strategy Logic:**
   - **Entry:** Enter when the market transitions from a Bearish state (2) to a Bullish state (1) to capture reversal momentum.
   - **Exit:** Exit as soon as the Bullish trend is lost (price no longer making higher closes).
3. **Mathematical Formulation:** The state $S_t$ is defined based on price $P_t$ vs previous price $P_{t-1}$:
   - $S_t = 1$ if $P_t > P_{t-1}$ (Bullish)
   - $S_t = 2$ if $P_t < P_{t-1}$ (Bearish)
4. **Execution:** After backtesting, the strategy is deployed to an E-Trade account for live or paper trading.
5. **Results:** Displaying a dashboard showing $+56,140.95$ earnings on a backtest of NVDA.

## Visual Context & On-Screen Text

- **On-Screen Text:** "COPYING QUANT STRATEGIES Pt. 2 💸" is displayed throughout the intro.
- **Strategy Dashboard:** A custom UI shows "Markov Chain Strategy" with:
  - **Entry Logic:** "when the market transitions from a Bearish state (2) to a Bullish state (1). This captures the immediate momentum of a reversal."
  - **Exit Logic:** "as soon as the Bullish state (1) is lost, meaning the price is no longer making higher closes."
  - **Transition Diagrams:** Visual representations of Markov state transitions with probabilities (e.g., 0.3, 0.7, 0.4, 0.6).
- **Mathematical Formula:** A clear LaTeX-style block shows the definition of $S_t$:
  - $S_t = \begin{cases} 1 & \text{if } P_t > P_{t-1} \text{ (Bullish)} \\ 2 & \text{if } P_t < P_{t-1} \text{ (Bearish)} \end{cases}$
- **Trading Results (NVDA):**
  - **Earnings:** +$56,140.95
  - **Total Return:** 56.14%
  - **Sharpe Ratio:** 0.74
- **Software/Tools:** The creator shows a laptop screen with code/charts and an E-Trade logo.

## Hook & Call to Action

- **The Hook:** "Can I make 10k stealing quant strategies off the internet? Here's how much I made." (Accompanied by holding a $100 bill).
- **Call to Action:** "Comment 'Astral' if you want my quant strategy!" (Caption also suggests following for more).
