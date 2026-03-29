"use client";

import { motion } from "framer-motion";

type ClosingMessageProps = {
  message: string;
};

export default function ClosingMessage({ message }: ClosingMessageProps) {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="text-brand-slate leading-relaxed text-center"
    >
      {message}
    </motion.p>
  );
}
