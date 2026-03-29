"use client";

import { motion } from "framer-motion";

type LoadingStateProps = {
  message?: string;
};

export default function LoadingState({ message }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      {/* Pulsing circle spinner in brand-teal */}
      <motion.div
        className="w-10 h-10 rounded-full border-4 border-brand-teal border-t-transparent"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.9, ease: "linear", repeat: Infinity }}
      />
      {message && (
        <p className="text-sm text-brand-mid text-center">{message}</p>
      )}
    </div>
  );
}
