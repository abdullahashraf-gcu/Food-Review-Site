import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto px-4 py-8 lg:ml-64"
    >
      <h1 className="text-3xl font-display font-bold text-text-heading mb-8">
        Settings
      </h1>

      <div className="card space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-text-heading mb-4">
            Account
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-text-subtext">Notifications</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-primary-bgSecondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-amber"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-subtext">Email Updates</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-primary-bgSecondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-amber"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <h2 className="text-xl font-semibold text-text-heading mb-4">
            Danger Zone
          </h2>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="btn-secondary text-red-400 border-red-400/50 hover:bg-red-400/10"
          >
            Logout
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;

