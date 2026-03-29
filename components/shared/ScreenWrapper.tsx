"use client";

import { motion } from "framer-motion";

type ScreenWrapperProps = {
  children: React.ReactNode;
  className?: string;
};

export default function ScreenWrapper({ children, className }: ScreenWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`max-w-md mx-auto px-5 py-6 ${className ?? ""}`}
    >
      {children}
    </motion.div>
  );
}
