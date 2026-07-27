import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';
import Loader from '../components/Common/Loader';

const Followers = () => {
  const { id } = useParams();

  const { data: user, isLoading } = useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const response = await api.get(`/users/${id}`);
      return response.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto px-4 py-8 lg:ml-64"
    >
      <h1 className="text-3xl font-display font-bold text-text-heading mb-8">
        Followers
      </h1>

      {user?.followers && user.followers.length > 0 ? (
        <div className="space-y-4">
          {user.followers.map((follower, index) => (
            <motion.div
              key={follower._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={`/profile/${follower._id}`}
                className="card flex items-center gap-4 hover:border-accent-amber/50 transition-colors"
              >
                <img
                  src={follower.avatar || '/images/default-avatar.svg'}
                  alt={follower.username}
                  className="w-16 h-16 rounded-full object-cover border border-border"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/default-avatar.svg';
                  }}
                />
                <div>
                  <h3 className="font-semibold text-text-heading">
                    {follower.fullName || follower.username}
                  </h3>
                  <p className="text-sm text-text-muted">@{follower.username}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-text-muted">No followers yet</p>
        </div>
      )}
    </motion.div>
  );
};

export default Followers;

