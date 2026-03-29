"use client";

import { motion } from "framer-motion";

type SignalChipProps = {
  label: string;
  selected: boolean;
  onToggle: () => void;
};

export default function SignalChip({ label, selected, onToggle }: SignalChipProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onToggle}
      className={
        selected
          ? "border-2 border-brand-teal rounded-full px-4 py-2 text-sm text-brand-teal bg-brand-teal-light font-medium"
          : "border border-brand-border rounded-full px-4 py-2 text-sm text-brand-slate bg-white"
      }
    >
      {label}
    </motion.button>
  );
}
