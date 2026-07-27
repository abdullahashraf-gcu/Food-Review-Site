import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaUserPlus, FaUserMinus, FaMapMarkerAlt } from 'react-icons/fa';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';

const ProfileCard = ({ user, showFollowButton = true, compact = false }) => {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();

  const followMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(`/users/follow/${user._id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', user._id] });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(`/users/unfollow/${user._id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', user._id] });
    },
  });

  const isOwnProfile = currentUser?._id === user._id;
  const isFollowing =
    user.followers?.some((follower) => follower._id === currentUser?._id) ||
    false;

  if (compact) {
    return (
      <Link to={`/profile/${user._id}`}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="card p-4 flex items-center gap-3"
        >
          <img
            src={user.avatar || '/images/default-avatar.svg'}
            alt={user.username}
            className="w-12 h-12 rounded-full object-cover border border-border"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/default-avatar.svg';
            }}
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-text-heading truncate">
              {user.fullName || user.username}
            </h3>
            <p className="text-sm text-text-muted truncate">@{user.username}</p>
          </div>
        </motion.div>
      </Link>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="flex flex-col md:flex-row gap-4">
        <Link to={`/profile/${user._id}`}>
          <img
            src={user.avatar || '/images/default-avatar.svg'}
            alt={user.username}
            className="w-20 h-20 rounded-full object-cover border-2 border-accent-amber cursor-pointer hover:border-accent-turquoise transition-colors"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/default-avatar.svg';
            }}
          />
        </Link>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <Link to={`/profile/${user._id}`}>
                <h3 className="text-xl font-display font-bold text-text-heading hover:text-accent-amber transition-colors">
                  {user.fullName || user.username}
                </h3>
              </Link>
              <p className="text-text-muted">@{user.username}</p>
            </div>
            {showFollowButton && !isOwnProfile && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  isFollowing
                    ? unfollowMutation.mutate()
                    : followMutation.mutate()
                }
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                  isFollowing
                    ? 'bg-primary-bgSecondary text-text-subtext hover:bg-red-500/20 hover:text-red-400'
                    : 'btn-primary'
                }`}
              >
                {isFollowing ? (
                  <>
                    <FaUserMinus />
                    <span>Unfollow</span>
                  </>
                ) : (
                  <>
                    <FaUserPlus />
                    <span>Follow</span>
                  </>
                )}
              </motion.button>
            )}
          </div>

          {user.bio && (
            <p className="text-text-subtext mb-3 text-sm">{user.bio}</p>
          )}

          <div className="flex gap-6 text-sm">
            <Link
              to={`/profile/${user._id}/following`}
              className="text-text-subtext hover:text-accent-amber transition-colors"
            >
              <span className="font-semibold text-text-heading">
                {user.following?.length || 0}
              </span>{' '}
              Following
            </Link>
            <Link
              to={`/profile/${user._id}/followers`}
              className="text-text-subtext hover:text-accent-turquoise transition-colors"
            >
              <span className="font-semibold text-text-heading">
                {user.followers?.length || 0}
              </span>{' '}
              Followers
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileCard;

