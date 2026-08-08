import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ message, type = 'success', onClose }) => {
  if (!message) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />,
    error: <AlertCircle className="w-4 h-4 text-[#DC2626]" />,
    info: <Info className="w-4 h-4 text-[#C9A96E]" />,
  };

  const bgStyles = {
    success: 'bg-[#2E7D32]/10 border-[#2E7D32]/30 text-[#050E1A]',
    error: 'bg-[#DC2626]/10 border-[#DC2626]/30 text-[#050E1A]',
    info: 'bg-[#C9A96E]/15 border-[#C9A96E]/40 text-[#050E1A]',
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl border-2 shadow-lg flex items-center gap-3 backdrop-blur-md font-mono text-xs font-bold ${bgStyles[type] || bgStyles.info}`}
        role="status"
        aria-live="polite"
      >
        {icons[type]}
        <span>{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-black/5 transition-colors cursor-pointer text-[#050E1A]"
            aria-label="Close notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default Toast;
