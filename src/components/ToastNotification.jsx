import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const ToastNotification = ({ message, type = 'error', onClose, duration = 3000 }) => {
    useEffect(() => {
    if (duration > 0) {
        const timer = setTimeout(() => {
        onClose();
    }, duration);
    return () => clearTimeout(timer);
    }
    }, [duration, onClose]);

  const icons = {
    error: '⚠️',
    success: '✅',
    info: 'ℹ️',
    warning: '⚠️'
  };

  const titles = {
    error: 'Error',
    success: 'Success',
    info: 'Information',
    warning: 'Warning'
  };

  return (
    <AnimatePresence>
      <motion.div
        className="toast-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={`toast-notification toast-${type}`}
          initial={{ scale: 0.8, opacity: 0, y: -50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: -50 }}
          transition={{ type: 'spring', damping: 25 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="toast-icon">{icons[type]}</div>
          <div className="toast-content">
            <div className="toast-title">{titles[type]}</div>
            <div className="toast-message">{message}</div>
          </div>
          <button className="toast-close" onClick={onClose}>
            ✕
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};