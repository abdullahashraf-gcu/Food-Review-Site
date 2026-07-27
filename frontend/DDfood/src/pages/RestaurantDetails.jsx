import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import Loader from '../components/Common/Loader';
import { useAuth } from '../context/AuthContext';
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaGlobe, 
  FaStar, 
  FaImage,
  FaHeart,
  FaRegHeart
} from 'react-icons/fa';

const RestaurantDetails = () => {
  const { id } = useParams();
  const { user, updateUser } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    review: '',
  });
  const [reviewImages, setReviewImages] = useState([]);
  const queryClient = useQueryClient();

  const { data: restaurant, isLoading: restaurantLoading } = useQuery({
    queryKey: ['restaurant', id],
    queryFn: async () => {
      const response = await api.get(`/restaurants/${id}`);
      return response.data.data;
    },
  });

  const { data: reviewsData, isLoading: reviewsLoading } = useQuery({
    queryKey: ['restaurantReviews', id],
    queryFn: async () => {
      const response = await api.get(`/restaurants/${id}/reviews`);
      return response.data;
    },
  });

  const createReviewMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await api.post(`/restaurants/${id}/reviews`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurantReviews', id] });
      queryClient.invalidateQueries({ queryKey: ['restaurant', id] });
      setShowReviewForm(false);
      setReviewData({ rating: 5, review: '' });
      setReviewImages([]);
    },
  });

  const likeReviewMutation = useMutation({
    mutationFn: async (reviewId) => {
      const response = await api.post(`/restaurants/reviews/${reviewId}/like`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurantReviews', id] });
    },
  });

  const favoriteRestaurantIds = useMemo(() => {
    if (!user?.favoriteRestaurants) return [];
    return user.favoriteRestaurants.map((restaurant) =>
      typeof restaurant === 'string' ? restaurant : restaurant._id
    );
  }, [user]);

  const isFavorite = favoriteRestaurantIds.includes(id);

  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(`/users/favorites/restaurants/${id}`);
      return response.data;
    },
    onSuccess: (response) => {
      if (user) {
        updateUser({
          ...user,
          favoriteRestaurants: response.data.favorites,
        });
      }
      queryClient.invalidateQueries({ queryKey: ['user', user?._id] });
    },
  });

  const handleSubmitReview = (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('rating', reviewData.rating);
    formData.append('review', reviewData.review);
    
    reviewImages.forEach((image) => {
      formData.append('images', image);
    });

    createReviewMutation.mutate(formData);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setReviewImages(files);
  };

  if (restaurantLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text-muted">Restaurant not found</p>
      </div>
    );
  }

  const reviews = reviewsData?.data || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto px-4 py-8 lg:ml-64"
    >
      {/* Restaurant Header */}
      <div className="card mb-8">
        {restaurant.images?.[0] && (
          <img
            src={restaurant.images[0]}
            alt={restaurant.name}
            className="w-full h-64 object-cover rounded-xl mb-6"
          />
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h1 className="text-3xl font-display font-bold text-text-heading mb-4">
              {restaurant.name}
            </h1>
            
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-accent-turquoise/20 text-accent-turquoise rounded-lg">
                {restaurant.cuisine}
              </span>
              <span className="px-3 py-1 bg-accent-amber/20 text-accent-amber rounded-lg font-semibold">
                {restaurant.priceRange}
              </span>
            </div>
            
            <div className="flex items-center gap-2 mb-4">
              <span className="text-accent-amber text-2xl">★</span>
              <span className="text-xl font-semibold text-text-heading">
                {restaurant.averageRating.toFixed(1)}
              </span>
              <span className="text-text-muted">
                ({restaurant.totalReviews} reviews)
              </span>
            </div>
            
            {restaurant.description && (
              <p className="text-text-subtext mb-4">{restaurant.description}</p>
            )}
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-text-subtext">
              <FaMapMarkerAlt className="text-accent-turquoise" />
              <span>{restaurant.address}</span>
            </div>
            
            {restaurant.phone && (
              <div className="flex items-center gap-3 text-text-subtext">
                <FaPhone className="text-accent-turquoise" />
                <a href={`tel:${restaurant.phone}`} className="hover:text-accent-turquoise">
                  {restaurant.phone}
                </a>
              </div>
            )}
            
            {restaurant.website && (
              <div className="flex items-center gap-3 text-text-subtext">
                <FaGlobe className="text-accent-turquoise" />
                <a 
                  href={restaurant.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-accent-turquoise"
                >
                  Visit Website
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="card">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-2xl font-display font-bold text-text-heading">
            Reviews ({restaurant.totalReviews})
          </h2>
          
          {user && (
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="btn-primary flex-1"
              >
                Write Review
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleFavoriteMutation.mutate()}
                disabled={toggleFavoriteMutation.isPending}
                className={`flex-1 ${
                  isFavorite ? 'btn-secondary' : 'btn-outline'
                }`}
              >
                {toggleFavoriteMutation.isPending ? (
                  <Loader size="sm" />
                ) : isFavorite ? (
                  'Remove Favorite'
                ) : (
                  'Add to Favorites'
                )}
              </motion.button>
            </div>
          )}
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="border border-border rounded-xl p-6 mb-6"
          >
            <h3 className="text-lg font-semibold text-text-heading mb-4">
              Write Your Review
            </h3>
            
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-text-subtext text-sm mb-2">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewData({ ...reviewData, rating: star })}
                      className={`text-2xl transition-colors ${
                        star <= reviewData.rating
                          ? 'text-accent-amber'
                          : 'text-text-muted hover:text-accent-amber/50'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-text-subtext text-sm mb-2">
                  Review
                </label>
                <textarea
                  value={reviewData.review}
                  onChange={(e) => setReviewData({ ...reviewData, review: e.target.value })}
                  required
                  rows={4}
                  className="input-field w-full resize-none"
                  placeholder="Share your experience..."
                />
              </div>
              
              <div>
                <label className="btn-secondary inline-flex items-center gap-2 cursor-pointer">
                  <FaImage />
                  <span>Add Photos</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                {reviewImages.length > 0 && (
                  <p className="text-sm text-text-muted mt-2">
                    {reviewImages.length} photo(s) selected
                  </p>
                )}
              </div>
              
              <div className="flex gap-4">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={createReviewMutation.isPending}
                  className="btn-primary"
                >
                  {createReviewMutation.isPending ? <Loader size="sm" /> : 'Submit Review'}
                </motion.button>
                
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowReviewForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Reviews List */}
        {reviewsLoading ? (
          <Loader />
        ) : reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-b border-border pb-6 last:border-b-0"
              >
                <div className="flex items-start gap-4">
                  <Link to={`/profile/${review.user?._id}`}>
                    <img
                      src={review.user?.avatar || '/images/default-avatar.svg'}
                      alt={review.user?.username}
                      className="w-12 h-12 rounded-full object-cover border border-border"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/default-avatar.svg';
                      }}
                    />
                  </Link>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <Link
                          to={`/profile/${review.user?._id}`}
                          className="font-semibold text-text-heading hover:text-accent-amber"
                        >
                          {review.user?.fullName || review.user?.username}
                        </Link>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={`text-sm ${
                                  i < review.rating ? 'text-accent-amber' : 'text-text-muted'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-text-muted">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-text-subtext mb-3">{review.review}</p>
                    
                    {review.images && review.images.length > 0 && (
                      <div className="flex gap-2 mb-3">
                        {review.images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Review ${index + 1}`}
                            className="w-20 h-20 object-cover rounded-lg border border-border"
                          />
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => likeReviewMutation.mutate(review._id)}
                        className="flex items-center gap-2 text-text-muted hover:text-accent-amber transition-colors"
                      >
                        {review.likes?.some(like => like._id === user?._id) ? (
                          <FaHeart className="text-accent-amber" />
                        ) : (
                          <FaRegHeart />
                        )}
                        <span>{review.likes?.length || 0}</span>
                      </motion.button>
                      {user && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            api.post(`/restaurants/reviews/${review._id}/flag`, {
                              reason: 'Suspicious review',
                            })
                          }
                          className="text-xs text-text-muted hover:text-red-400 transition-colors"
                        >
                          Report
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-text-muted">No reviews yet. Be the first to review!</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RestaurantDetails;
