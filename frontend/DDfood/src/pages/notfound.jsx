import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-primary-bg">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <h1 className="text-9xl font-display font-bold text-gradient mb-4">
          404
        </h1>
        <h2 className="text-3xl font-display font-bold text-text-heading mb-4">
          Page Not Found
        </h2>
        <p className="text-text-muted mb-8">
          The page you're looking for doesn't exist.
        </p>
        <Link to="/" className="btn-primary inline-block">
          Go Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;

