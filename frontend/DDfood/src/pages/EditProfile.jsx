import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import Loader from '../components/Common/Loader';
import { useAuth } from '../context/AuthContext';
import { FaImage, FaHeart } from 'react-icons/fa';

const EditProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, updateUser } = useAuth();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const response = await api.get(`/users/${id}`);
      return response.data.data;
    },
  });

  const { data: approvedRestaurants } = useQuery({
    queryKey: ['approvedRestaurants'],
    queryFn: async () => {
      const response = await api.get('/restaurants?limit=50');
      return response.data.data;
    },
  });

  const { data: approvedFoods } = useQuery({
    queryKey: ['approvedFoods'],
    queryFn: async () => {
      const response = await api.get('/foods?limit=50');
      return response.data.data;
    },
  });

  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
  });
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [favoriteRestaurantIds, setFavoriteRestaurantIds] = useState([]);
  const [favoriteError, setFavoriteError] = useState('');
  const [favoriteFoodIds, setFavoriteFoodIds] = useState([]);
  const [favoriteFoodError, setFavoriteFoodError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        bio: user.bio || '',
      });
      setFavoriteRestaurantIds((user.favoriteRestaurants || []).map((r) => r._id));
      setFavoriteFoodIds((user.favoriteFoods || []).map((food) => food._id));
    }
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const formDataToSend = new FormData();
      formDataToSend.append('fullName', data.fullName);
      formDataToSend.append('bio', data.bio);
      formDataToSend.append('favoriteRestaurants', JSON.stringify(favoriteRestaurantIds));
      formDataToSend.append('favoriteFoods', JSON.stringify(favoriteFoodIds));
      if (avatar) formDataToSend.append('avatar', avatar);
      if (coverImage) formDataToSend.append('coverImage', coverImage);

      const response = await api.put(`/users/${id}`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: (response) => {
      updateUser(response.data.data);
      queryClient.invalidateQueries({ queryKey: ['user', id] });
      navigate(`/profile/${id}`);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (favoriteRestaurantIds.length > 4) {
      setFavoriteError('You can only select up to 4 favorite restaurants.');
      return;
    }
    if (favoriteFoodIds.length > 4) {
      setFavoriteFoodError('You can only select up to 4 favorite foods.');
      return;
    }
    setFavoriteError('');
    setFavoriteFoodError('');
    updateMutation.mutate(formData);
  };

  const toggleFavoriteRestaurant = (restaurantId) => {
    setFavoriteError('');
    setFavoriteRestaurantIds((prev) => {
      if (prev.includes(restaurantId)) {
        return prev.filter((idValue) => idValue !== restaurantId);
      }
      if (prev.length >= 4) {
        setFavoriteError('Limit reached: remove one to add another.');
        return prev;
      }
      return [...prev, restaurantId];
    });
  };

const toggleFavoriteFood = (foodId) => {
  setFavoriteFoodError('');
  setFavoriteFoodIds((prev) => {
    if (prev.includes(foodId)) {
      return prev.filter((idValue) => idValue !== foodId);
    }
    if (prev.length >= 4) {
      setFavoriteFoodError('Limit reached: remove one to add another.');
      return prev;
    }
    return [...prev, foodId];
  });
};

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (currentUser?._id !== id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text-muted">Not authorized</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto px-4 py-8 lg:ml-64"
    >
      <h1 className="text-3xl font-display font-bold text-text-heading mb-8">
        Edit Profile
      </h1>

      <form onSubmit={handleSubmit} className="card space-y-6">
        {/* Avatar */}
        <div>
          <label className="block text-text-subtext text-sm mb-2">
            Avatar
          </label>
          <div className="flex items-center gap-4">
            <img
              src={
                avatar
                  ? URL.createObjectURL(avatar)
                  : user?.avatar || '/images/default-avatar.svg'
              }
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover border border-border"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/default-avatar.svg';
              }}
            />
            <label className="btn-secondary inline-flex items-center gap-2 cursor-pointer">
              <FaImage />
              <span>Change Avatar</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setAvatar(e.target.files[0])}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-text-subtext text-sm mb-2">
            Cover Image
          </label>
          <div className="flex items-center gap-4">
            {coverImage || user?.coverImage ? (
              <img
                src={
                  coverImage
                    ? URL.createObjectURL(coverImage)
                    : user?.coverImage
                }
                alt="Cover"
                className="w-full h-32 object-cover rounded-xl border border-border"
              />
            ) : null}
            <label className="btn-secondary inline-flex items-center gap-2 cursor-pointer">
              <FaImage />
              <span>Change Cover</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverImage(e.target.files[0])}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-text-subtext text-sm mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            className="input-field w-full"
            placeholder="Your full name"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-text-subtext text-sm mb-2">Bio</label>
          <textarea
            value={formData.bio}
            onChange={(e) =>
              setFormData({ ...formData, bio: e.target.value })
            }
            rows={4}
            maxLength={200}
            className="input-field w-full resize-none"
            placeholder="Tell us about yourself..."
          />
          <p className="text-xs text-text-muted mt-1">
            {formData.bio.length}/200
          </p>
        </div>

        {/* Favorite Restaurants */}
        <div>
          <label className="block text-text-subtext text-sm mb-2">
            Favorite Restaurants (max 4, approved only)
          </label>
          <p className="text-xs text-text-muted mb-3">
            These appear on your profile as quick links. Pick from admin-approved listings.
          </p>
          {favoriteError && <p className="text-xs text-red-400 mb-2">{favoriteError}</p>}
          {!approvedRestaurants ? (
            <div className="flex justify-center py-4">
              <Loader size="sm" />
            </div>
          ) : approvedRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
              {approvedRestaurants.map((restaurant) => {
                const isSelected = favoriteRestaurantIds.includes(restaurant._id);
                return (
                  <button
                    type="button"
                    key={restaurant._id}
                    onClick={() => toggleFavoriteRestaurant(restaurant._id)}
                    className={`flex items-center gap-3 border rounded-xl p-3 text-left transition-colors ${
                      isSelected
                        ? 'border-accent-amber bg-accent-amber/10'
                        : 'border-border hover:border-accent-amber/60'
                    }`}
                  >
                    <FaHeart
                      className={`${
                        isSelected ? 'text-accent-amber' : 'text-text-muted'
                      }`}
                    />
                    <div>
                      <p className="font-semibold text-sm text-text-heading">{restaurant.name}</p>
                      <p className="text-xs text-text-muted">
                        {restaurant.cuisine} • {restaurant.priceRange}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-text-muted text-sm">No approved restaurants available yet.</p>
          )}
        </div>

        {/* Favorite Foods */}
        <div>
          <label className="block text-text-subtext text-sm mb-2">
            Favorite Foods (max 4, approved only)
          </label>
          <p className="text-xs text-text-muted mb-3">
            Pick dishes from the food explorer. These show up on your profile as cards.
          </p>
          {favoriteFoodError && (
            <p className="text-xs text-red-400 mb-2">{favoriteFoodError}</p>
          )}
          {!approvedFoods ? (
            <div className="flex justify-center py-4">
              <Loader size="sm" />
            </div>
          ) : approvedFoods.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
              {approvedFoods.map((food) => {
                const isSelected = favoriteFoodIds.includes(food._id);
                return (
                  <button
                    type="button"
                    key={food._id}
                    onClick={() => toggleFavoriteFood(food._id)}
                    className={`flex items-center gap-3 border rounded-xl p-3 text-left transition-colors ${
                      isSelected
                        ? 'border-accent-turquoise bg-accent-turquoise/10'
                        : 'border-border hover:border-accent-turquoise/60'
                    }`}
                  >
                    <FaHeart
                      className={`${isSelected ? 'text-accent-turquoise' : 'text-text-muted'}`}
                    />
                    <div>
                      <p className="font-semibold text-sm text-text-heading">{food.name}</p>
                      <p className="text-xs text-text-muted">
                        {food.cuisine} {food.category ? `• ${food.category}` : ''}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-text-muted text-sm">No approved foods available yet.</p>
          )}
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={updateMutation.isPending}
          className="btn-primary w-full"
        >
          {updateMutation.isPending ? <Loader size="sm" /> : 'Save Changes'}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default EditProfile;

