import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaHome,
  FaCompass,
  FaPlus,
  FaUser,
  FaBookmark,
  FaCog,
  FaUtensils,
  FaUserShield,
  FaDrumstickBite,
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { icon: FaHome, path: '/', label: 'Home' },
    { icon: FaCompass, path: '/explore', label: 'Explore' },
    { icon: FaPlus, path: '/create', label: 'Create' },
    { icon: FaUtensils, path: '/restaurants', label: 'Restaurants' },
    { icon: FaDrumstickBite, path: '/foods', label: 'Foods' },
    { icon: FaBookmark, path: '/saved', label: 'Saved' },
    { icon: FaUser, path: `/profile/${user?._id}`, label: 'Profile' },
    { icon: FaCog, path: '/settings', label: 'Settings' },
    ...(user?.role === 'admin' ? [{ icon: FaUserShield, path: '/admin', label: 'Admin' }] : []),
  ];

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="hidden lg:block fixed left-0 top-16 h-[calc(100vh-4rem)] w-52 bg-primary-bgSecondary border-r border-border pt-6 p-2"
    >
      <nav className="space-y-2">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-2 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-accent-amber text-primary-bg'
                    : 'text-text-subtext hover:text-text-heading hover:bg-primary-card'
                }`}
              >
                <Icon className="text-xl" />
                <span className="font-medium">{item.label}</span>
              </Link>
            </motion.div>
          );
        })}
      </nav>
    </motion.aside>
  );
};

export default Sidebar;

