import { useState } from 'react';
import { motion } from 'framer-motion';
import Loader from '../Common/Loader';
import { FaEnvelope } from 'react-icons/fa';

const ResetForm = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    // TODO: Implement password reset API call
    // For now, just simulate success
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
    }, 1500);
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="card text-center">
          <div className="w-16 h-16 bg-accent-amber/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaEnvelope className="text-2xl text-accent-amber" />
          </div>
          <h2 className="text-2xl font-display font-bold text-text-heading mb-2">
            Check Your Email
          </h2>
          <p className="text-text-subtext mb-4">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
          <p className="text-text-muted text-sm">
            Didn't receive the email? Check your spam folder or try again.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <div className="card">
        <h1 className="text-3xl font-display font-bold text-text-heading mb-2">
          Reset Password
        </h1>
        <p className="text-text-muted mb-8">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/20 border border-red-500/50 text-red-400 rounded-xl p-3 mb-4"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-text-subtext text-sm mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              required
              className="input-field w-full"
              placeholder="your@email.com"
            />
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? <Loader size="sm" /> : 'Send Reset Link'}
          </motion.button>
        </form>

        <p className="text-center text-text-muted mt-6">
          Remember your password?{' '}
          <a
            href="/login"
            className="text-accent-amber hover:underline"
          >
            Sign in
          </a>
        </p>
      </div>
    </motion.div>
  );
};

export default ResetForm;

