import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import Loader from '../components/Common/Loader';
import { useAuth } from '../context/AuthContext';
import { FaImage, FaStar, FaHeart, FaRegHeart } from 'react-icons/fa';

const FoodDetails = () => {
  const { id } = useParams();
  const { user, updateUser } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, review: '' });
  const [reviewImages, setReviewImages] = useState([]);
  const queryClient = useQueryClient();

  const { data: food, isLoading } = useQuery({
    queryKey: ['food', id],
    queryFn: async () => {
      const response = await api.get(`/foods/${id}`);
      return response.data.data;
    },
  });

  const { data: reviewsData, isLoading: reviewsLoading } = useQuery({
    queryKey: ['foodReviews', id],
    queryFn: async () => {
      const response = await api.get(`/foods/${id}/reviews`);
      return response.data;
    },
  });

  const reviews = reviewsData?.data || [];

  const createReviewMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await api.post(`/foods/${id}/reviews`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['food', id] });
      queryClient.invalidateQueries({ queryKey: ['foodReviews', id] });
      setShowReviewForm(false);
      setReviewData({ rating: 5, review: '' });
      setReviewImages([]);
    },
  });

  const likeReviewMutation = useMutation({
    mutationFn: async (reviewId) => {
      const response = await api.post(`/foods/reviews/${reviewId}/like`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foodReviews', id] });
    },
  });

  const favoriteFoodIds = useMemo(() => {
    if (!user?.favoriteFoods) return [];
    return user.favoriteFoods.map((foodItem) =>
      typeof foodItem === 'string' ? foodItem : foodItem._id
    );
  }, [user]);

  const isFavorite = favoriteFoodIds.includes(id);

  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(`/users/favorites/foods/${id}`);
      return response.data;
    },
    onSuccess: (response) => {
      if (user) {
        updateUser({
          ...user,
          favoriteFoods: response.data.favorites,
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
    reviewImages.forEach((image) => formData.append('images', image));
    createReviewMutation.mutate(formData);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setReviewImages(files);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!food) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text-muted">Food not found</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto px-4 py-8 lg:ml-64"
    >
      <div className="card mb-8">
        {food.images?.[0] && (
          <img
            src={food.images[0]}
            alt={food.name}
            className="w-full h-64 object-cover rounded-xl mb-6"
          />
        )}
        <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-text-heading mb-2">
              {food.name}
            </h1>
            <p className="text-text-muted mb-2">{food.cuisine}</p>
            {food.category && (
              <span className="inline-flex px-3 py-1 rounded-lg bg-accent-turquoise/20 text-accent-turquoise text-sm mb-3">
                {food.category}
              </span>
            )}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl text-accent-amber">★</span>
              <span className="text-xl font-semibold text-text-heading">
                {food.averageRating?.toFixed(1) || '0.0'}
              </span>
              <span className="text-text-muted">({food.totalReviews || 0} reviews)</span>
            </div>
            {food.description && <p className="text-text-subtext">{food.description}</p>}
            {food.ingredients?.length > 0 && (
              <p className="text-sm text-text-muted mt-3">
                Ingredients: {food.ingredients.join(', ')}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-3">
            {food.origin && (
              <div>
                <p className="text-xs text-text-muted">Origin</p>
                <p className="font-semibold text-text-heading">{food.origin}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-text-muted">Price Range</p>
              <p className="font-semibold text-text-heading">{food.priceRange}</p>
            </div>
            {user && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleFavoriteMutation.mutate()}
                disabled={toggleFavoriteMutation.isPending}
                className={isFavorite ? 'btn-secondary' : 'btn-outline'}
              >
                {toggleFavoriteMutation.isPending ? (
                  <Loader size="sm" />
                ) : isFavorite ? (
                  'Remove from Favorites'
                ) : (
                  'Add to Favorites'
                )}
              </motion.button>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-2xl font-display font-bold text-text-heading">
            Reviews ({food.totalReviews || 0})
          </h2>
          {user && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="btn-primary"
            >
              {showReviewForm ? 'Cancel' : 'Write Review'}
            </motion.button>
          )}
        </div>

        {showReviewForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="border border-border rounded-xl p-6 mb-6"
          >
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm text-text-subtext mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewData({ ...reviewData, rating: star })}
                      className={`text-2xl ${
                        star <= reviewData.rating ? 'text-accent-amber' : 'text-text-muted'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-text-subtext mb-2">Review</label>
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
                  <p className="text-xs text-text-muted mt-1">
                    {reviewImages.length} image(s) selected
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
                  {createReviewMutation.isPending ? <Loader size="sm" /> : 'Submit'}
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

        {reviewsLoading ? (
          <Loader />
        ) : reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-b border-border pb-6 last:border-b-0"
              >
                <div className="flex items-start gap-4">
                  <Link to={`/profile/${review.user?._id}`}>
                    <img
                      src={review.user?.avatar || '/images/default-avatar.svg'}
                      alt={review.user?.username}
                      className="w-12 h-12 rounded-full object-cover border border-border"
                    />
                  </Link>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <Link
                          to={`/profile/${review.user?._id}`}
                          className="font-semibold text-text-heading hover:text-accent-amber"
                        >
                          {review.user?.fullName || review.user?.username}
                        </Link>
                        <div className="flex items-center gap-2 text-sm text-text-muted">
                          <span>
                            {[...Array(5)].map((_, idx) => (
                              <FaStar
                                key={idx}
                                className={`${
                                  idx < review.rating ? 'text-accent-amber' : 'text-text-muted'
                                }`}
                              />
                            ))}
                          </span>
                          <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-text-subtext mt-3">{review.review}</p>
                    {review.images?.length > 0 && (
                      <div className="flex gap-2 mt-3">
                        {review.images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt=""
                            className="w-20 h-20 object-cover rounded-lg border border-border"
                          />
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-4 mt-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => likeReviewMutation.mutate(review._id)}
                        className="flex items-center gap-2 text-text-muted hover:text-accent-amber"
                      >
                        {review.likes?.some((like) => like._id === user?._id) ? (
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
                            api.post(`/foods/reviews/${review._id}/flag`, {
                              reason: 'Suspicious review',
                            })
                          }
                          className="text-xs text-text-muted hover:text-red-400"
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
            <p className="text-text-muted">No reviews yet. Be the first!</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default FoodDetails;

