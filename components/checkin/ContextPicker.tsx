"use client";

import { motion } from "framer-motion";
import type { Context } from "@/lib/types";

type ContextOption = {
  value: Context;
  label: string;
  emoji: string;
};

const CONTEXT_OPTIONS: ContextOption[] = [
  { value: "private", label: "Private space", emoji: "🏠" },
  { value: "desk",    label: "At a desk",     emoji: "💻" },
  { value: "public",  label: "Out in public",  emoji: "🏙️" },
  { value: "car",     label: "In a car",       emoji: "🚗" },
  { value: "bed",     label: "Lying in bed",   emoji: "🛏️" },
];

type ContextPickerProps = {
  selected: Context | null;
  onSelect: (context: Context) => void;
};

export default function ContextPicker({ selected, onSelect }: ContextPickerProps) {
  return (
    <div className="flex flex-col gap-2">
      {CONTEXT_OPTIONS.map((opt) => {
        const isSelected = selected === opt.value;
        return (
          <motion.button
            key={opt.value}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(opt.value)}
            className={
              isSelected
                ? "flex items-center gap-3 w-full rounded-xl px-4 py-3 text-sm font-medium border-2 border-brand-teal bg-brand-teal-light text-brand-teal text-left"
                : "flex items-center gap-3 w-full rounded-xl px-4 py-3 text-sm border border-brand-border bg-white text-brand-slate text-left"
            }
          >
            <span className="text-base">{opt.emoji}</span>
            <span>{opt.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
