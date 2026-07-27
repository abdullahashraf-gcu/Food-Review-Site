import { motion } from 'framer-motion';

export const PrimaryButton = ({ children, onClick, disabled, type = 'button', className = '', ...props }) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`btn-primary ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export const SecondaryButton = ({ children, onClick, disabled, type = 'button', className = '', ...props }) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`btn-secondary ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export const GhostButton = ({ children, onClick, disabled, type = 'button', className = '', ...props }) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={`btn-ghost ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export const IconButton = ({ children, onClick, disabled, className = '', ...props }) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.1 }}
      whileTap={{ scale: disabled ? 1 : 0.9 }}
      className={`p-2 rounded-lg bg-primary-card hover:bg-primary-bgSecondary text-text-subtext hover:text-text-heading transition-colors ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

