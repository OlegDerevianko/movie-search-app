import { motion } from 'framer-motion';

export const SkeletonDetails = () => {
    return (
    <motion.div 
        className="movie-details"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
    >
        <div className="skeleton-back-btn"></div>
        <div className="details-container">
        <div className="skeleton-details-poster"></div>
        <div className="details-info">
            <div className="skeleton-details-title"></div>
            <div className="skeleton-details-text"></div>
            <div className="skeleton-details-text"></div>
            <div className="skeleton-details-button"></div>
        </div>
        </div>
    </motion.div>
    );
};