"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

type DurationOption = "30s" | "2min" | "5min";

const DURATION_LABELS: Record<DurationOption, string> = {
  "30s": "30 sec",
  "2min": "2 min",
  "5min": "5 min",
};

type DurationSelectorProps = {
  options: DurationOption[];
  selected: string | null;
  onSelect: (duration: string) => void;
};

export default function DurationSelector({
  options,
  selected,
  onSelect,
}: DurationSelectorProps) {
  // Pre-select the first option on mount if nothing is selected yet.
  useEffect(() => {
    if (selected === null && options.length > 0) {
      onSelect(options[0]);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex gap-2">
      {options.map((opt) => {
        const isSelected = selected === opt;
        return (
          <motion.button
            key={opt}
            whileTap={{ scale: 0.96 }}
            onClick={() => onSelect(opt)}
            className={
              isSelected
                ? "border-2 border-brand-teal rounded-full px-4 py-2 text-sm text-brand-teal bg-brand-teal-light font-medium"
                : "border border-brand-border rounded-full px-4 py-2 text-sm text-brand-slate bg-white"
            }
          >
            {DURATION_LABELS[opt]}
          </motion.button>
        );
      })}
    </div>
  );
}
