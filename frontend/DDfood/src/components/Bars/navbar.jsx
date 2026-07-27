import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaCompass, FaPlus, FaUser, FaSearch, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-primary-bgSecondary/80 backdrop-blur-md border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-display font-bold text-gradient"
            >
              DDFood
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-text-subtext hover:text-accent-amber transition-colors"
            >
              <FaHome className="text-xl" />
            </Link>
            <Link
              to="/explore"
              className="text-text-subtext hover:text-accent-turquoise transition-colors"
            >
              <FaCompass className="text-xl" />
            </Link>
            <Link
              to="/create"
              className="text-text-subtext hover:text-accent-amber transition-colors"
            >
              <FaPlus className="text-xl" />
            </Link>
            <Link
              to="/search"
              className="text-text-subtext hover:text-accent-turquoise transition-colors"
            >
              <FaSearch className="text-xl" />
            </Link>
            {user && (
              <>
                <Link
                  to={`/profile/${user._id}`}
                  className="text-text-subtext hover:text-accent-amber transition-colors"
                >
                  <FaUser className="text-xl" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-text-subtext hover:text-red-400 transition-colors"
                >
                  <FaSignOutAlt className="text-xl" />
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            {user && (
              <Link to={`/profile/${user._id}`}>
                <img
                  src={user.avatar || '/images/default-avatar.svg'}
                  alt={user.username}
                  className="w-8 h-8 rounded-full border border-border"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/default-avatar.svg';
                  }}
                />
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;

