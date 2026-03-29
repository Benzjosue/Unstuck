"use client";

import { motion } from "framer-motion";
import type { Outcome } from "@/lib/types";

type OutcomeOption = {
  value: Outcome;
  label: string;
};

const OUTCOME_OPTIONS: OutcomeOption[] = [
  { value: "better", label: "Better" },
  { value: "same",   label: "Same" },
  { value: "worse",  label: "Worse" },
];

type OutcomePickerProps = {
  selected: Outcome | null;
  onSelect: (outcome: Outcome) => void;
};

export default function OutcomePicker({ selected, onSelect }: OutcomePickerProps) {
  return (
    <div className="flex flex-col gap-3">
      {OUTCOME_OPTIONS.map((opt) => {
        const isSelected = selected === opt.value;
        return (
          <motion.button
            key={opt.value}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(opt.value)}
            className={`flex items-center justify-center w-full min-h-[48px] rounded-xl px-6 py-3 text-base font-medium border transition-colors ${
              isSelected
                ? "bg-brand-teal-light border-brand-teal text-brand-teal border-2"
                : "bg-white border-brand-border text-brand-slate"
            }`}
          >
            {opt.label}
          </motion.button>
        );
      })}
    </div>
  );
}
