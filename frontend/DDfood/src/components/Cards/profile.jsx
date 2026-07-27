import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaEdit, FaUserPlus, FaUserMinus } from 'react-icons/fa';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';

const Profile = ({ user, showEditButton = true }) => {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      {/* Cover Image */}
      {user.coverImage && (
        <div className="mb-4 -mx-6 -mt-6">
          <img
            src={user.coverImage}
            alt="Cover"
            className="w-full h-48 object-cover rounded-t-2xl"
          />
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <img
            src={user.avatar || '/images/default-avatar.svg'}
            alt={user.username}
            className="w-24 h-24 rounded-full object-cover border-2 border-accent-amber"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/default-avatar.svg';
            }}
          />
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-text-heading mb-2">
                {user.fullName || user.username}
              </h1>
              <p className="text-text-muted">@{user.username}</p>
            </div>
            {isOwnProfile && showEditButton ? (
              <Link
                to={`/profile/${user._id}/edit`}
                className="btn-secondary flex items-center gap-2"
              >
                <FaEdit />
                <span>Edit Profile</span>
              </Link>
            ) : !isOwnProfile ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  isFollowing
                    ? unfollowMutation.mutate()
                    : followMutation.mutate()
                }
                className="btn-primary flex items-center gap-2"
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
            ) : null}
          </div>

          {user.bio && (
            <p className="text-text-subtext mb-4 leading-relaxed">{user.bio}</p>
          )}

          <div className="flex gap-6">
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

export default Profile;

