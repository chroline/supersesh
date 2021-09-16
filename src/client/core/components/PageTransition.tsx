import React from "react";

import { motion } from "framer-motion";

export const TransitionEasings = {
  easeIn: [0.4, 0, 1, 1],
  easeOut: [0, 0, 0.2, 1],
};

const variants = {
  upAndDown: {
    hidden: { opacity: 0, x: 0, y: 100 },
    enter: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.2,
        ease: TransitionEasings.easeOut,
      },
    },
    exit: {
      opacity: 0,
      x: 0,
      y: 50,
      transition: {
        duration: 0.1,
        ease: TransitionEasings.easeIn,
      },
    },
  },
  fade: {
    hidden: { opacity: 0 },
    enter: {
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: TransitionEasings.easeOut,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: TransitionEasings.easeIn,
      },
    },
  },
};

export const PageTransition: React.FC<{ variant: keyof typeof variants }> = ({ variant, children }) => (
  <motion.div
    initial="hidden"
    animate="enter"
    exit="exit"
    variants={{ ...variants[variant] }}
    transition={{ duration: 0.2 }}
    style={{ width: "100%", height: "100%" }}
  >
    {children}
  </motion.div>
);
