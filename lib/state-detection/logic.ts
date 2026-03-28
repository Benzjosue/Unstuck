import type { StateLabel } from "@/lib/types";
import { SIGNAL_TABLE } from "@/lib/state-detection/signals";

// Tie-breaking priority when two states share the highest score.
// Earlier in this array = wins the tie.
const TIE_BREAK_ORDER: StateLabel[] = [
  "Overactivated",
  "Tense & Overloaded",
  "Wired but Tired",
  "Foggy & Depleted",
  "Shut Down",
];

export function detectState(selectedSignalIds: string[]): StateLabel {
  // Initialise all state totals at 0.
  const totals: Record<StateLabel, number> = {
    Overactivated: 0,
    "Tense & Overloaded": 0,
    "Wired but Tired": 0,
    "Foggy & Depleted": 0,
    "Shut Down": 0,
  };

  // Accumulate weights for every recognised signal ID.
  for (const id of selectedSignalIds) {
    const signal = SIGNAL_TABLE[id];
    if (!signal) continue; // unknown IDs are silently skipped

    for (const state of TIE_BREAK_ORDER) {
      totals[state] += signal.weights[state];
    }
  }

  // Find the highest total, honouring tie-break order (first in array wins).
  let winner: StateLabel = TIE_BREAK_ORDER[0];
  for (const state of TIE_BREAK_ORDER) {
    if (totals[state] > totals[winner]) {
      winner = state;
    }
  }

  return winner;
}
