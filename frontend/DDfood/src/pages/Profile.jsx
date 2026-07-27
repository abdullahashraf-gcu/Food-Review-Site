import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import Loader from '../components/Common/Loader';
import ReviewCard from '../components/Cards/reviewcard';
import { useAuth } from '../context/AuthContext';
import { FaUserPlus, FaUserMinus, FaEdit } from 'react-icons/fa';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const response = await api.get(`/users/${id}`);
      return response.data.data;
    },
  });

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ['userPosts', id],
    queryFn: async () => {
      const response = await api.get(`/posts/user/${id}`);
      return response.data.data;
    },
  });

  const followMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(`/users/follow/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', id] });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(`/users/unfollow/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', id] });
    },
  });

  const isOwnProfile = currentUser?._id === id;
  const isFollowing =
    user?.followers?.some((follower) => follower._id === currentUser?._id) ||
    false;

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text-muted">User not found</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto px-4 py-8 lg:ml-64"
    >
      {/* Profile Header */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={user.avatar || '/images/default-avatar.svg'}
            alt={user.username}
            className="w-24 h-24 rounded-full object-cover border-2 border-accent-amber"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/default-avatar.svg';
            }}
          />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-display font-bold text-text-heading mb-2">
                  {user.fullName || user.username}
                </h1>
                <p className="text-text-muted">@{user.username}</p>
              </div>
              {isOwnProfile ? (
                <Link
                  to={`/profile/${id}/edit`}
                  className="btn-secondary flex items-center gap-2"
                >
                  <FaEdit />
                  <span>Edit Profile</span>
                </Link>
              ) : (
                <div className="flex gap-2">
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
                </div>
              )}
            </div>

            {user.bio && (
              <p className="text-text-subtext mb-4">{user.bio}</p>
            )}

            <div className="flex gap-6">
              <Link
                to={`/profile/${id}/following`}
                className="text-text-subtext hover:text-accent-amber transition-colors"
              >
                <span className="font-semibold text-text-heading">
                  {user.following?.length || 0}
                </span>{' '}
                Following
              </Link>
              <Link
                to={`/profile/${id}/followers`}
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
      </div>

      {/* Favorites */}
      <div className="card mb-6">
        <h2 className="text-xl font-display font-bold text-text-heading mb-4">
          Favorite Restaurants
        </h2>
        {user.favoriteRestaurants && user.favoriteRestaurants.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {user.favoriteRestaurants.slice(0, 4).map((restaurant) => (
              <Link
                key={restaurant._id}
                to={`/restaurants/${restaurant._id}`}
                className="min-w-[150px] max-w-[180px] bg-primary-bgSecondary rounded-xl p-3 hover:bg-primary-card transition-colors"
              >
                {restaurant.images?.[0] && (
                  <img
                    src={restaurant.images[0]}
                    alt={restaurant.name}
                    className="w-full h-24 object-cover rounded-lg mb-2"
                  />
                )}
                <p className="font-semibold text-sm text-text-heading truncate">
                  {restaurant.name}
                </p>
                <p className="text-xs text-text-muted">
                  {restaurant.cuisine} • {restaurant.priceRange}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-text-muted text-sm">
            No favorite restaurants selected.
          </p>
        )}

        <h2 className="text-xl font-display font-bold text-text-heading mt-6 mb-4">
          Favorite Foods
        </h2>
        {user.favoriteFoods && user.favoriteFoods.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {user.favoriteFoods.slice(0, 4).map((food, index) => {
              if (typeof food === 'string' || !food?._id) {
                return (
                  <div
                    key={`${food}-${index}`}
                    className="min-w-[150px] max-w-[180px] bg-primary-bgSecondary rounded-xl p-3"
                  >
                    <p className="font-semibold text-sm text-text-heading truncate">{food}</p>
                  </div>
                );
              }

              return (
                <Link
                  key={food._id}
                  to={`/foods/${food._id}`}
                  className="min-w-[150px] max-w-[180px] bg-primary-bgSecondary rounded-xl p-3 hover:bg-primary-card transition-colors"
                >
                  {food.images?.[0] && (
                    <img
                      src={food.images[0]}
                      alt={food.name}
                      className="w-full h-24 object-cover rounded-lg mb-2"
                    />
                  )}
                  <p className="font-semibold text-sm text-text-heading truncate">{food.name}</p>
                  <p className="text-xs text-text-muted">
                    {food.cuisine} {food.category ? `• ${food.category}` : ''}
                  </p>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-text-muted text-sm">No favorite foods selected.</p>
        )}
      </div>

      {/* Posts */}
      <div>
        <h2 className="text-2xl font-display font-bold text-text-heading mb-6">
          Posts
        </h2>
        {postsLoading ? (
          <Loader />
        ) : posts && posts.length > 0 ? (
          <div>
            {posts.map((post, index) => (
              <ReviewCard key={post._id} post={post} index={index} />
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <p className="text-text-muted">No posts yet</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Profile;

