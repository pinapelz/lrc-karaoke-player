export interface GState {
  displayedLineIdx: number;
  typedCount: number;
  lineCompleted: boolean;
  combo: number;
  maxCombo: number;
  score: number;
  totalCorrect: number;
  totalMiss: number;
  linesCleared: number;
  wpm: number;
}

export type GAction =
  | { type: "ADVANCE"; newIdx: number; prevCompleted: boolean }
  | { type: "CORRECT"; willComplete: boolean }
  | { type: "WRONG" }
  | { type: "RESET" };

export const initialGState: GState = {
  displayedLineIdx: -1,
  typedCount: 0,
  lineCompleted: false,
  combo: 0,
  maxCombo: 0,
  score: 0,
  totalCorrect: 0,
  totalMiss: 0,
  linesCleared: 0,
  wpm: 0,
};

export function gReducer(state: GState, action: GAction): GState {
  switch (action.type) {
    case "ADVANCE": {
      const prevIdx = state.displayedLineIdx;
      const comboReset = !action.prevCompleted && prevIdx >= 0;
      return {
        ...state,
        displayedLineIdx: action.newIdx,
        typedCount: 0,
        lineCompleted: false,
        combo: comboReset ? 0 : state.combo,
      };
    }

    case "CORRECT": {
      const newTypedCount = state.typedCount + 1;
      const newCombo = state.combo + 1;
      const newMaxCombo = Math.max(state.maxCombo, newCombo);
      const comboBonus = Math.min(50, Math.floor(newCombo / 10) * 5);
      const newScore = state.score + 10 + comboBonus;
      const newTotalCorrect = state.totalCorrect + 1;
      if (action.willComplete) {
        return {
          ...state,
          typedCount: newTypedCount,
          lineCompleted: true,
          combo: newCombo,
          maxCombo: newMaxCombo,
          score: newScore,
          totalCorrect: newTotalCorrect,
          linesCleared: state.linesCleared + 1,
        };
      }
      return {
        ...state,
        typedCount: newTypedCount,
        combo: newCombo,
        maxCombo: newMaxCombo,
        score: newScore,
        totalCorrect: newTotalCorrect,
      };
    }
    case "WRONG":
      return { ...state, totalMiss: state.totalMiss + 1, combo: 0 };
    case "RESET":
      return { ...initialGState };
    default:
      return state;
  }
}