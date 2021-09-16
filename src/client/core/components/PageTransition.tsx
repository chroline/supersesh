import React from "react";

import { motion } from "framer-motion";

const variants = {
  upAndDown: {
    hidden: { opacity: 0, x: 0, y: 50 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 0, y: 25 },
  },
  fade: {
    hidden: { opacity: 0 },
    enter: { opacity: 1 },
    exit: { opacity: 0 },
  },
};

export const PageTransition: React.FC<{ variant: keyof typeof variants }> = ({ variant, children }) => (
  <motion.div
    initial="hidden"
    animate="enter"
    exit="exit"
    variants={variants[variant]}
    style={{ width: "100%", height: "100%" }}
  >
    {children}
  </motion.div>
);
