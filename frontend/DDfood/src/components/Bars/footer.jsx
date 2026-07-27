import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaCompass, FaPlus, FaBookmark, FaUser } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Footer = () => {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { icon: FaHome, path: '/', label: 'Home' },
    { icon: FaCompass, path: '/explore', label: 'Explore' },
    { icon: FaPlus, path: '/create', label: 'Create' },
    { icon: FaBookmark, path: '/saved', label: 'Saved' },
    { icon: FaUser, path: `/profile/${user?._id}`, label: 'Profile' },
  ];

  return (
    <motion.footer
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="lg:hidden fixed bottom-0 left-0 right-0 bg-primary-bgSecondary border-t border-border z-50"
    >
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 px-4 py-2 transition-colors ${
                isActive
                  ? 'text-accent-amber'
                  : 'text-text-subtext hover:text-text-heading'
              }`}
            >
              <Icon className="text-xl" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </motion.footer>
  );
};

export default Footer;

