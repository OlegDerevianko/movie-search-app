import { motion } from 'framer-motion';

export const SkeletonCard = () => {
  return (
    <motion.div 
      className="skeleton-card"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="skeleton-poster"></div>
      <div className="skeleton-info">
        <div className="skeleton-title"></div>
        <div className="skeleton-year"></div>
        <div className="skeleton-button"></div>
      </div>
    </motion.div>
  );
};