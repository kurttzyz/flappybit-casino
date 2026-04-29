/**
 * slotEngine.js — Core spin logic & win evaluation
 * Django static: slots/js/utils/slotEngine.js
 *
 * This is pure game logic with no Phaser dependency.
 * Can also be used server-side for RTP verification.
 */

window.SlotEngine = (function () {

  // ─── Spin ──────────────────────────────────────────────────────────────────
  /**
   * Generate a random spin result.
   * @returns {string[][]} grid[col][row] = symbolId  (5 cols × 3 rows)
   */
  function spin() {
    const grid = [];
    for (let col = 0; col < window.SLOT_CONFIG.COLS; col++) {
      const strip  = window.REEL_STRIPS[col];
      const startIdx = Math.floor(Math.random() * strip.length);
      const colResult = [];
      for (let row = 0; row < window.SLOT_CONFIG.ROWS; row++) {
        colResult.push(strip[(startIdx + row) % strip.length]);
      }
      grid.push(colResult);
    }
    return grid;
  }

  // ─── Evaluate wins ─────────────────────────────────────────────────────────
  /**
   * Evaluate paylines against a grid result.
   * @param {string[][]} grid   - grid[col][row]
   * @param {number}     bet    - total bet amount
   * @returns {{ totalWin: number, wins: WinEntry[] }}
   *
   * WinEntry: { lineIndex, paylinePattern, symbolId, count, payout, positions }
   */
  function evaluate(grid, bet) {
    const wins = [];
    let totalWin = 0;

    window.PAYLINES.forEach((payline, lineIndex) => {
      // Collect symbols on this payline
      const lineSymbols = payline.map((row, col) => grid[col][row]);

      // Count matching from left, treating wilds as any symbol
      const { symbolId, count, positions } = countMatch(lineSymbols, payline);

      if (count >= 3 && symbolId) {
        const symDef = window.SYMBOL_MAP[symbolId];
        if (symDef && symDef.payouts[count] !== undefined) {
          const payout = symDef.payouts[count] * bet;
          wins.push({ lineIndex, paylinePattern: payline, symbolId, count, payout, positions });
          totalWin += payout;
        }
      }
    });

    return { totalWin, wins };
  }

  /**
   * Count consecutive matching symbols from the left of a payline.
   * Wilds (zeus) substitute for any non-wild symbol.
   */
  function countMatch(lineSymbols, payline) {
    const wildId = 'zeus';
    let matchSymbol = null;
    let count = 0;
    const positions = [];

    for (let col = 0; col < lineSymbols.length; col++) {
      const sym = lineSymbols[col];
      const isWild = sym === wildId;

      if (matchSymbol === null) {
        if (isWild) {
          // Leading wild — tentatively match but don't commit symbol yet
          count++;
          positions.push({ col, row: payline[col] });
        } else {
          matchSymbol = sym;
          count++;
          positions.push({ col, row: payline[col] });
        }
      } else {
        if (sym === matchSymbol || isWild) {
          count++;
          positions.push({ col, row: payline[col] });
        } else {
          break; // chain broken
        }
      }
    }

    // If all were wilds, treat as wild symbol
    if (matchSymbol === null && count > 0) matchSymbol = wildId;

    return { symbolId: matchSymbol, count, positions };
  }

  // ─── RTP helper ────────────────────────────────────────────────────────────
  /**
   * Simulate N spins and return estimated RTP %.
   * Use in browser console: SlotEngine.simulateRTP(100000, 1)
   */
  function simulateRTP(spins, bet) {
    let totalBet = 0;
    let totalReturn = 0;
    for (let i = 0; i < spins; i++) {
      const grid = spin();
      const { totalWin } = evaluate(grid, bet);
      totalBet += bet;
      totalReturn += totalWin;
    }
    return ((totalReturn / totalBet) * 100).toFixed(2) + '%';
  }

  // ─── Public API ────────────────────────────────────────────────────────────
  return { spin, evaluate, simulateRTP };

})();
