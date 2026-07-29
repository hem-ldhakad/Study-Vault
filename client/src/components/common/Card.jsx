import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({ children, className = '', hover = true, ...props }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : undefined}
      className={`glass-panel rounded-3xl p-6 shadow-xl shadow-slate-950/5 dark:shadow-black/20 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
