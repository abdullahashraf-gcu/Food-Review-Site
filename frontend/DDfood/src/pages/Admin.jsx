import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import Loader from '../components/Common/Loader';
import { useAuth } from '../context/AuthContext';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaImage,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaNewspaper,
} from 'react-icons/fa';

const tabs = [
  { key: 'restaurants', label: 'Restaurants' },
  { key: 'approvals', label: 'Approvals' },
  { key: 'foods', label: 'Foods' },
  { key: 'foodApprovals', label: 'Food Approvals' },
  { key: 'flagged', label: 'Flagged Reviews' },
  { key: 'foodFlagged', label: 'Flagged Food Reviews' },
  { key: 'posts', label: 'User Posts' },
  { key: 'analytics', label: 'Analytics' },
];

const Admin = () => {
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [activeTab, setActiveTab] = useState('restaurants');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [pendingNotes, setPendingNotes] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    cuisine: '',
    priceRange: '$',
    phone: '',
    website: '',
  });
  const [images, setImages] = useState([]);
  const [showFoodForm, setShowFoodForm] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [foodStatusFilter, setFoodStatusFilter] = useState('all');
  const [foodSearchTerm, setFoodSearchTerm] = useState('');
  const [foodFormData, setFoodFormData] = useState({
    name: '',
    description: '',
    cuisine: '',
    category: '',
    origin: '',
    priceRange: '$$',
    ingredients: '',
  });
  const [foodImages, setFoodImages] = useState([]);
  const [foodNotes, setFoodNotes] = useState({});
  const queryClient = useQueryClient();

  // Guard access
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text-muted">Access denied. Admin privileges required.</p>
      </div>
    );
  }

  const { data: analytics } = useQuery({
    queryKey: ['adminAnalytics'],
    queryFn: async () => {
      const response = await api.get('/admin/analytics');
      return response.data.data;
    },
  });

  const {
    data: restaurantsResponse,
    isLoading: restaurantsLoading,
  } = useQuery({
    queryKey: ['adminRestaurants', statusFilter, searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('status', statusFilter);
      if (searchTerm) params.append('search', searchTerm);
      const response = await api.get(`/admin/restaurants?${params.toString()}`);
      return response.data;
    },
    keepPreviousData: true,
  });

  const {
    data: foodsResponse,
    isLoading: foodsLoading,
  } = useQuery({
    queryKey: ['adminFoods', foodStatusFilter, foodSearchTerm],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('status', foodStatusFilter);
      if (foodSearchTerm) params.append('search', foodSearchTerm);
      const response = await api.get(`/admin/foods?${params.toString()}`);
      return response.data;
    },
    keepPreviousData: true,
  });

  const { data: pendingRestaurants } = useQuery({
    queryKey: ['pendingRestaurants'],
    queryFn: async () => {
      const response = await api.get('/admin/restaurants/pending');
      return response.data.data;
    },
  });

  const { data: flaggedReviews } = useQuery({
    queryKey: ['adminFlaggedReviews'],
    queryFn: async () => {
      const response = await api.get('/admin/reviews/flagged');
      return response.data.data;
    },
  });

  const { data: pendingFoods } = useQuery({
    queryKey: ['pendingFoods'],
    queryFn: async () => {
      const response = await api.get('/admin/foods/pending');
      return response.data.data;
    },
  });

  const { data: flaggedFoodReviews } = useQuery({
    queryKey: ['adminFlaggedFoodReviews'],
    queryFn: async () => {
      const response = await api.get('/admin/foods/reviews/flagged');
      return response.data.data;
    },
  });

  const { data: postsResponse } = useQuery({
    queryKey: ['adminPosts'],
    queryFn: async () => {
      const response = await api.get('/admin/posts');
      return response.data;
    },
  });

  const restaurants = useMemo(() => restaurantsResponse?.data ?? [], [restaurantsResponse]);
  const foods = useMemo(() => foodsResponse?.data ?? [], [foodsResponse]);
  const posts = useMemo(() => postsResponse?.data ?? [], [postsResponse]);

  const createMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await api.post('/restaurants', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminRestaurants'] });
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }) => {
      const response = await api.put(`/restaurants/${id}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminRestaurants'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => api.delete(`/restaurants/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminRestaurants'] });
    },
  });

  const createFoodMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await api.post('/foods', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminFoods'] });
      queryClient.invalidateQueries({ queryKey: ['foods'] });
      resetFoodForm();
    },
  });

  const updateFoodMutation = useMutation({
    mutationFn: async ({ id, payload }) => {
      const response = await api.put(`/foods/${id}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminFoods'] });
      resetFoodForm();
    },
  });

  const deleteFoodMutation = useMutation({
    mutationFn: async (id) => api.delete(`/foods/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminFoods'] });
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (id) => api.patch(`/admin/restaurants/${id}/approve`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingRestaurants'] });
      queryClient.invalidateQueries({ queryKey: ['adminRestaurants'] });
    },
  });

  const denyMutation = useMutation({
    mutationFn: async ({ id, reason }) =>
      api.patch(`/admin/restaurants/${id}/deny`, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingRestaurants'] });
      queryClient.invalidateQueries({ queryKey: ['adminRestaurants'] });
    },
  });

  const resolveReviewMutation = useMutation({
    mutationFn: async (reviewId) => api.patch(`/admin/reviews/${reviewId}/resolve`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminFlaggedReviews'] });
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: async (reviewId) => api.delete(`/admin/reviews/${reviewId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminFlaggedReviews'] });
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: async (postId) => api.delete(`/admin/posts/${postId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPosts'] });
    },
  });

  const approveFoodMutation = useMutation({
    mutationFn: async (id) => api.patch(`/admin/foods/${id}/approve`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingFoods'] });
      queryClient.invalidateQueries({ queryKey: ['adminFoods'] });
    },
  });

  const denyFoodMutation = useMutation({
    mutationFn: async ({ id, reason }) =>
      api.patch(`/admin/foods/${id}/deny`, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingFoods'] });
      queryClient.invalidateQueries({ queryKey: ['adminFoods'] });
    },
  });

  const resolveFoodReviewMutation = useMutation({
    mutationFn: async (reviewId) => api.patch(`/admin/foods/reviews/${reviewId}/resolve`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminFlaggedFoodReviews'] });
    },
  });

  const deleteFoodReviewMutation = useMutation({
    mutationFn: async (reviewId) => api.delete(`/admin/foods/reviews/${reviewId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminFlaggedFoodReviews'] });
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      address: '',
      cuisine: '',
      priceRange: '$',
      phone: '',
      website: '',
    });
    setImages([]);
    setShowCreateForm(false);
    setEditingRestaurant(null);
  };

  const resetFoodForm = () => {
    setFoodFormData({
      name: '',
      description: '',
      cuisine: '',
      category: '',
      origin: '',
      priceRange: '$$',
      ingredients: '',
    });
    setFoodImages([]);
    setShowFoodForm(false);
    setEditingFood(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) submitData.append(key, value);
    });
    images.forEach((image) => submitData.append('images', image));

    if (editingRestaurant) {
      updateMutation.mutate({ id: editingRestaurant._id, payload: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleEdit = (restaurant) => {
    setFormData({
      name: restaurant.name,
      description: restaurant.description || '',
      address: restaurant.address,
      cuisine: restaurant.cuisine,
      priceRange: restaurant.priceRange,
      phone: restaurant.phone || '',
      website: restaurant.website || '',
    });
    setEditingRestaurant(restaurant);
    setShowCreateForm(true);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleFoodSubmit = (e) => {
    e.preventDefault();
    const submitData = new FormData();
    Object.entries(foodFormData).forEach(([key, value]) => {
      if (value) {
        if (key === 'ingredients') {
          const list = value
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);
          submitData.append(key, JSON.stringify(list));
        } else {
          submitData.append(key, value);
        }
      }
    });
    foodImages.forEach((image) => submitData.append('images', image));

    if (editingFood) {
      updateFoodMutation.mutate({ id: editingFood._id, payload: submitData });
    } else {
      createFoodMutation.mutate(submitData);
    }
  };

  const handleFoodEdit = (food) => {
    setFoodFormData({
      name: food.name,
      description: food.description || '',
      cuisine: food.cuisine,
      category: food.category || '',
      origin: food.origin || '',
      priceRange: food.priceRange || '$$',
      ingredients: food.ingredients?.join(', ') || '',
    });
    setEditingFood(food);
    setShowFoodForm(true);
  };

  const handleFoodImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFoodImages(files);
  };

  const renderStatusBadge = (status) => {
    const map = {
      approved: 'bg-green-500/10 text-green-400',
      pending: 'bg-yellow-500/10 text-yellow-400',
      denied: 'bg-red-500/10 text-red-400',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${map[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto px-4 py-8 lg:ml-64"
    >
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-display font-bold text-text-heading">
          Admin Dashboard
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-8 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 -mb-px border-b-2 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'border-accent-amber text-text-heading'
                : 'border-transparent text-text-muted hover:text-text-heading'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Restaurants Management */}
      {activeTab === 'restaurants' && (
        <>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-display font-bold text-text-heading">
                Restaurant Management
              </h2>
              <p className="text-text-muted text-sm">
                Manage active listings and keep information fresh.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, cuisine or address"
                className="input-field w-full sm:w-64"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field w-full sm:w-48"
              >
                <option value="all">All statuses</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="denied">Denied</option>
              </select>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="btn-primary flex items-center gap-2 justify-center"
              >
                <FaPlus />
                <span>{showCreateForm ? 'Close Form' : 'Add Restaurant'}</span>
              </motion.button>
            </div>
          </div>

          {showCreateForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card mb-8"
            >
              <h2 className="text-2xl font-display font-bold text-text-heading mb-6">
                {editingRestaurant ? 'Edit Restaurant' : 'Add New Restaurant'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-text-subtext text-sm mb-2">
                      Restaurant Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="input-field w-full"
                      placeholder="Restaurant name"
                    />
                  </div>

                  <div>
                    <label className="block text-text-subtext text-sm mb-2">
                      Cuisine Type *
                    </label>
                    <input
                      type="text"
                      value={formData.cuisine}
                      onChange={(e) =>
                        setFormData({ ...formData, cuisine: e.target.value })
                      }
                      required
                      className="input-field w-full"
                      placeholder="Italian, Chinese, etc."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-text-subtext text-sm mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    required
                    className="input-field w-full"
                    placeholder="Full address"
                  />
                </div>

                <div>
                  <label className="block text-text-subtext text-sm mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    className="input-field w-full resize-none"
                    placeholder="Restaurant description"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-text-subtext text-sm mb-2">
                      Price Range *
                    </label>
                    <select
                      value={formData.priceRange}
                      onChange={(e) =>
                        setFormData({ ...formData, priceRange: e.target.value })
                      }
                      required
                      className="input-field w-full"
                    >
                      <option value="$">$ - Budget</option>
                      <option value="$$">$$ - Moderate</option>
                      <option value="$$$">$$$ - Expensive</option>
                      <option value="$$$$">$$$$ - Very Expensive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-text-subtext text-sm mb-2">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="input-field w-full"
                      placeholder="Phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-text-subtext text-sm mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) =>
                        setFormData({ ...formData, website: e.target.value })
                      }
                      className="input-field w-full"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-text-subtext text-sm mb-2">Images</label>
                  <label className="btn-secondary inline-flex items-center gap-2 cursor-pointer">
                    <FaImage />
                    <span>Add Images</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  {images.length > 0 && (
                    <p className="text-sm text-text-muted mt-2">
                      {images.length} image(s) selected
                    </p>
                  )}
                </div>

                <div className="flex gap-4">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="btn-primary"
                  >
                    {createMutation.isPending || updateMutation.isPending ? (
                      <Loader size="sm" />
                    ) : editingRestaurant ? (
                      'Update Restaurant'
                    ) : (
                      'Create Restaurant'
                    )}
                  </motion.button>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={resetForm}
                    className="btn-secondary"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Restaurants List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <motion.div
                key={restaurant._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card space-y-3"
              >
                {restaurant.images?.[0] && (
                  <img
                    src={restaurant.images[0]}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover rounded-xl mb-2"
                  />
                )}

                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-text-heading">
                    {restaurant.name}
                  </h3>
                  {renderStatusBadge(restaurant.approvalStatus)}
                </div>
                <p className="text-text-muted text-sm">{restaurant.cuisine}</p>
                <p className="text-text-subtext text-sm">{restaurant.address}</p>

                <div className="flex items-center gap-2 text-sm">
                  <span className="text-accent-amber font-semibold">
                    {restaurant.priceRange}
                  </span>
                  <span className="text-text-muted">
                    • {Number(restaurant.averageRating || 0).toFixed(1)} ★ (
                    {restaurant.totalReviews || 0})
                  </span>
                </div>

                {restaurant.submittedBy && (
                  <p className="text-xs text-text-muted">
                    Submitted by: {restaurant.submittedBy.fullName || restaurant.submittedBy.username}{' '}
                    {restaurant.source === 'user' && '(user)'}
                  </p>
                )}

                <div className="flex gap-2 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEdit(restaurant)}
                    className="btn-secondary flex-1 flex items-center justify-center gap-2"
                  >
                    <FaEdit />
                    <span>Edit</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (window.confirm('Delete this restaurant and its reviews?')) {
                        deleteMutation.mutate(restaurant._id);
                      }
                    }}
                    className="btn-danger flex items-center justify-center gap-2 px-4"
                  >
                    <FaTrash />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {restaurants.length === 0 && (
            <div className="text-center py-12">
              <p className="text-text-muted">No restaurants match your filters.</p>
            </div>
          )}
        </>
      )}

      {/* Flagged food reviews */}
      {activeTab === 'foodFlagged' && (
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <FaExclamationTriangle className="text-accent-turquoise" />
            <div>
              <h2 className="text-xl font-display font-bold text-text-heading">
                Flagged Food Reviews
              </h2>
              <p className="text-sm text-text-muted">
                Investigate suspicious feedback on food submissions.
              </p>
            </div>
          </div>
          {flaggedFoodReviews && flaggedFoodReviews.length > 0 ? (
            <div className="space-y-4">
              {flaggedFoodReviews.map((review) => (
                <div
                  key={review._id}
                  className="border border-border rounded-xl p-4 flex flex-col gap-3"
                >
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <p className="font-semibold text-text-heading">{review.food?.name}</p>
                      <p className="text-sm text-text-muted">
                        by {review.user?.fullName || review.user?.username}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-red-500/10 text-red-400">
                      {review.flags?.length || 0} flag(s)
                    </span>
                  </div>
                  <p className="text-sm text-text-subtext">{review.review}</p>
                  {review.flags?.length > 0 && (
                    <p className="text-xs text-text-muted">
                      Latest reason: {review.flags[review.flags.length - 1].reason}
                    </p>
                  )}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => resolveFoodReviewMutation.mutate(review._id)}
                      disabled={resolveFoodReviewMutation.isPending}
                      className="btn-secondary flex items-center justify-center gap-2"
                    >
                      {resolveFoodReviewMutation.isPending ? <Loader size="sm" /> : <FaCheckCircle />}
                      <span>Mark Safe</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (window.confirm('Delete this review?')) {
                          deleteFoodReviewMutation.mutate(review._id);
                        }
                      }}
                      className="btn-danger flex items-center justify-center gap-2"
                    >
                      <FaTrash />
                      <span>Delete Review</span>
                    </motion.button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-muted text-sm">No flagged food reviews.</p>
          )}
        </div>
      )}

      {/* Food Approvals */}
      {activeTab === 'foodApprovals' && (
        <div className="card space-y-6">
          <div className="flex items-center gap-2">
            <FaCheckCircle className="text-accent-turquoise" />
            <div>
              <h2 className="text-xl font-display font-bold text-text-heading">
                Pending Food Submissions
              </h2>
              <p className="text-sm text-text-muted">
                Review dishes submitted by users before they go live.
              </p>
            </div>
          </div>
          {pendingFoods && pendingFoods.length > 0 ? (
            <div className="space-y-4">
              {pendingFoods.map((food) => (
                <div
                  key={food._id}
                  className="border border-border rounded-xl p-4 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <p className="text-lg font-semibold text-text-heading">{food.name}</p>
                      <p className="text-sm text-text-muted">
                        Submitted by {food.submittedBy?.fullName || food.submittedBy?.username}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-400">
                      Waiting for approval
                    </span>
                  </div>
                  <p className="text-sm text-text-subtext">
                    {food.description || 'No description provided.'}
                  </p>
                  <textarea
                    value={foodNotes[food._id] || ''}
                    onChange={(e) =>
                      setFoodNotes((prev) => ({
                        ...prev,
                        [food._id]: e.target.value,
                      }))
                    }
                    className="input-field w-full"
                    rows={2}
                    placeholder="Optional note / denial reason"
                  />
                  <div className="flex flex-col sm:flex-row gap-3">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => approveFoodMutation.mutate(food._id)}
                      disabled={approveFoodMutation.isPending}
                      className="btn-primary flex items-center justify-center gap-2"
                    >
                      {approveFoodMutation.isPending ? <Loader size="sm" /> : <FaCheckCircle />}
                      <span>Approve</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() =>
                        denyFoodMutation.mutate({
                          id: food._id,
                          reason: foodNotes[food._id],
                        })
                      }
                      disabled={denyFoodMutation.isPending}
                      className="btn-danger flex items-center justify-center gap-2"
                    >
                      {denyFoodMutation.isPending ? <Loader size="sm" /> : <FaTimesCircle />}
                      <span>Deny</span>
                    </motion.button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-muted text-sm">No pending food submissions right now.</p>
          )}
        </div>
      )}

      {/* Foods Management */}
      {activeTab === 'foods' && (
        <>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-display font-bold text-text-heading">Food Management</h2>
              <p className="text-text-muted text-sm">
                Curate dishes shared by the community and keep information accurate.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={foodSearchTerm}
                onChange={(e) => setFoodSearchTerm(e.target.value)}
                placeholder="Search by name, cuisine or category"
                className="input-field w-full sm:w-64"
              />
              <select
                value={foodStatusFilter}
                onChange={(e) => setFoodStatusFilter(e.target.value)}
                className="input-field w-full sm:w-48"
              >
                <option value="all">All statuses</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="denied">Denied</option>
              </select>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFoodForm(!showFoodForm)}
                className="btn-primary flex items-center gap-2 justify-center"
              >
                <FaPlus />
                <span>{showFoodForm ? 'Close Form' : 'Add Food'}</span>
              </motion.button>
            </div>
          </div>

          {showFoodForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card mb-8"
            >
              <h2 className="text-2xl font-display font-bold text-text-heading mb-6">
                {editingFood ? 'Edit Food' : 'Add New Food'}
              </h2>

              <form onSubmit={handleFoodSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-text-subtext text-sm mb-2">Name *</label>
                    <input
                      type="text"
                      value={foodFormData.name}
                      onChange={(e) => setFoodFormData({ ...foodFormData, name: e.target.value })}
                      required
                      className="input-field w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-text-subtext text-sm mb-2">Cuisine *</label>
                    <input
                      type="text"
                      value={foodFormData.cuisine}
                      onChange={(e) =>
                        setFoodFormData({ ...foodFormData, cuisine: e.target.value })
                      }
                      required
                      className="input-field w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-text-subtext text-sm mb-2">Category</label>
                    <input
                      type="text"
                      value={foodFormData.category}
                      onChange={(e) =>
                        setFoodFormData({ ...foodFormData, category: e.target.value })
                      }
                      className="input-field w-full"
                      placeholder="e.g., Dessert"
                    />
                  </div>
                  <div>
                    <label className="block text-text-subtext text-sm mb-2">Origin</label>
                    <input
                      type="text"
                      value={foodFormData.origin}
                      onChange={(e) =>
                        setFoodFormData({ ...foodFormData, origin: e.target.value })
                      }
                      className="input-field w-full"
                      placeholder="City or region"
                    />
                  </div>
                  <div>
                    <label className="block text-text-subtext text-sm mb-2">Price Range</label>
                    <select
                      value={foodFormData.priceRange}
                      onChange={(e) =>
                        setFoodFormData({ ...foodFormData, priceRange: e.target.value })
                      }
                      className="input-field w-full"
                    >
                      <option value="$">$ - Budget</option>
                      <option value="$$">$$ - Moderate</option>
                      <option value="$$$">$$$ - Expensive</option>
                      <option value="$$$$">$$$$ - Very Expensive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-text-subtext text-sm mb-2">Description</label>
                  <textarea
                    value={foodFormData.description}
                    onChange={(e) =>
                      setFoodFormData({ ...foodFormData, description: e.target.value })
                    }
                    rows={3}
                    className="input-field w-full resize-none"
                  />
                </div>

                <div>
                  <label className="block text-text-subtext text-sm mb-2">
                    Ingredients (comma separated)
                  </label>
                  <input
                    type="text"
                    value={foodFormData.ingredients}
                    onChange={(e) =>
                      setFoodFormData({ ...foodFormData, ingredients: e.target.value })
                    }
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-text-subtext text-sm mb-2">Images</label>
                  <label className="btn-secondary inline-flex items-center gap-2 cursor-pointer">
                    <FaImage />
                    <span>Add Images</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFoodImageChange}
                      className="hidden"
                    />
                  </label>
                  {foodImages.length > 0 && (
                    <p className="text-sm text-text-muted mt-2">
                      {foodImages.length} image(s) selected
                    </p>
                  )}
                </div>

                <div className="flex gap-4">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={createFoodMutation.isPending || updateFoodMutation.isPending}
                    className="btn-primary"
                  >
                    {createFoodMutation.isPending || updateFoodMutation.isPending ? (
                      <Loader size="sm" />
                    ) : editingFood ? (
                      'Update Food'
                    ) : (
                      'Create Food'
                    )}
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={resetFoodForm}
                    className="btn-secondary"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}

          {foodsLoading ? (
            <div className="flex justify-center py-12">
              <Loader />
            </div>
          ) : foods.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {foods.map((food) => (
                <motion.div
                  key={food._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card space-y-3"
                >
                  {food.images?.[0] && (
                    <img
                      src={food.images[0]}
                      alt={food.name}
                      className="w-full h-48 object-cover rounded-xl mb-2"
                    />
                  )}
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-text-heading">{food.name}</h3>
                    {renderStatusBadge(food.approvalStatus || 'approved')}
                  </div>
                  <p className="text-sm text-text-muted">{food.cuisine}</p>
                  {food.category && (
                    <p className="text-xs text-text-subtext">{food.category}</p>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-accent-amber font-semibold">
                      {food.priceRange || '$$'}
                    </span>
                    <span className="text-text-muted">
                      • {Number(food.averageRating || 0).toFixed(1)} ★ ({food.totalReviews || 0})
                    </span>
                  </div>
                  {food.submittedBy && (
                    <p className="text-xs text-text-muted">
                      Submitted by:{' '}
                      {food.submittedBy.fullName || food.submittedBy.username}{' '}
                      {food.source === 'user' && '(user)'}
                    </p>
                  )}
                  <div className="flex gap-2 pt-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleFoodEdit(food)}
                      className="btn-secondary flex-1 flex items-center justify-center gap-2"
                    >
                      <FaEdit />
                      <span>Edit</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (window.confirm('Delete this food and its reviews?')) {
                          deleteFoodMutation.mutate(food._id);
                        }
                      }}
                      className="btn-danger flex items-center justify-center gap-2 px-4"
                    >
                      <FaTrash />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-text-muted">No foods match your filters.</p>
            </div>
          )}
        </>
      )}

      {/* Approvals */}
      {activeTab === 'approvals' && (
        <div className="card space-y-6">
          <div className="flex items-center gap-2">
            <FaCheckCircle className="text-accent-turquoise" />
            <div>
              <h2 className="text-xl font-display font-bold text-text-heading">
                Pending Restaurant Submissions
              </h2>
              <p className="text-sm text-text-muted">
                Review user submissions and approve or deny them.
              </p>
            </div>
          </div>

          {pendingRestaurants && pendingRestaurants.length > 0 ? (
            <div className="space-y-4">
              {pendingRestaurants.map((restaurant) => (
                <div
                  key={restaurant._id}
                  className="border border-border rounded-xl p-4 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <p className="text-lg font-semibold text-text-heading">
                        {restaurant.name}
                      </p>
                      <p className="text-sm text-text-muted">
                        Submitted by{' '}
                        {restaurant.submittedBy?.fullName || restaurant.submittedBy?.username}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-400">
                      Waiting for approval
                    </span>
                  </div>
                  <p className="text-sm text-text-subtext">{restaurant.description}</p>

                  <textarea
                    value={pendingNotes[restaurant._id] || ''}
                    onChange={(e) =>
                      setPendingNotes((prev) => ({
                        ...prev,
                        [restaurant._id]: e.target.value,
                      }))
                    }
                    className="input-field w-full"
                    rows={2}
                    placeholder="Optional note / denial reason"
                  />

                  <div className="flex flex-col sm:flex-row gap-3">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => approveMutation.mutate(restaurant._id)}
                      disabled={approveMutation.isPending}
                      className="btn-primary flex items-center justify-center gap-2"
                    >
                      {approveMutation.isPending ? <Loader size="sm" /> : <FaCheckCircle />}
                      <span>Approve</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() =>
                        denyMutation.mutate({
                          id: restaurant._id,
                          reason: pendingNotes[restaurant._id],
                        })
                      }
                      disabled={denyMutation.isPending}
                      className="btn-danger flex items-center justify-center gap-2"
                    >
                      {denyMutation.isPending ? <Loader size="sm" /> : <FaTimesCircle />}
                      <span>Deny</span>
                    </motion.button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-muted text-sm">No pending submissions right now.</p>
          )}
        </div>
      )}

      {/* Flagged Reviews */}
      {activeTab === 'flagged' && (
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <FaExclamationTriangle className="text-accent-amber" />
            <div>
              <h2 className="text-xl font-display font-bold text-text-heading">
                Flagged Restaurant Reviews
              </h2>
              <p className="text-sm text-text-muted">
                Resolve suspicious reviews or remove them entirely.
              </p>
            </div>
          </div>
          {flaggedReviews && flaggedReviews.length > 0 ? (
            <div className="space-y-4">
              {flaggedReviews.map((review) => (
                <div
                  key={review._id}
                  className="border border-border rounded-xl p-4 flex flex-col gap-3"
                >
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <p className="font-semibold text-text-heading">
                        {review.restaurant?.name}
                      </p>
                      <p className="text-sm text-text-muted">
                        by {review.user?.fullName || review.user?.username}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-red-500/10 text-red-400">
                      {review.flags?.length || 0} flag(s)
                    </span>
                  </div>
                  <p className="text-sm text-text-subtext">{review.review}</p>
                  {review.flags?.length > 0 && (
                    <p className="text-xs text-text-muted">
                      Latest reason: {review.flags[review.flags.length - 1].reason}
                    </p>
                  )}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => resolveReviewMutation.mutate(review._id)}
                      disabled={resolveReviewMutation.isPending}
                      className="btn-secondary flex items-center justify-center gap-2"
                    >
                      {resolveReviewMutation.isPending ? <Loader size="sm" /> : <FaCheckCircle />}
                      <span>Mark Safe</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (window.confirm('Delete this review?')) {
                          deleteReviewMutation.mutate(review._id);
                        }
                      }}
                      className="btn-danger flex items-center justify-center gap-2"
                    >
                      <FaTrash />
                      <span>Delete Review</span>
                    </motion.button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-muted text-sm">No flagged reviews.</p>
          )}
        </div>
      )}

      {/* Posts moderation */}
      {activeTab === 'posts' && (
        <div className="card space-y-4">
          <div className="flex items-center gap-2">
            <FaNewspaper className="text-accent-amber" />
            <div>
              <h2 className="text-xl font-display font-bold text-text-heading">
                Recent User Posts
              </h2>
              <p className="text-sm text-text-muted">
                Remove posts that violate community guidelines.
              </p>
            </div>
          </div>
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post._id}
                className="border border-border rounded-xl p-4 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-text-heading">
                      {post.user?.fullName || post.user?.username}
                    </p>
                    <p className="text-xs text-text-muted">
                      {new Date(post.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (window.confirm('Delete this post?')) {
                        deletePostMutation.mutate(post._id);
                      }
                    }}
                    className="btn-danger flex items-center justify-center gap-2 px-3 py-1"
                  >
                    <FaTrash />
                    <span>Delete</span>
                  </motion.button>
                </div>
                <p className="text-text-subtext text-sm">{post.content}</p>
                {post.images?.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {post.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt="post"
                        className="w-20 h-20 object-cover rounded-lg border border-border"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-text-muted text-sm">No posts available.</p>
          )}
        </div>
      )}

      {/* Analytics */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { label: 'Total Users', value: analytics?.usersCount },
            { label: 'New users (7d)', value: analytics?.newUsersWeek },
            { label: 'Total Posts', value: analytics?.postsCount },
            { label: 'Posts (7d)', value: analytics?.postsWeek },
            { label: 'Restaurants', value: analytics?.restaurantsCount },
            { label: 'Pending Restaurants', value: analytics?.pendingRestaurantsCount },
            { label: 'Restaurant Reviews', value: analytics?.reviewsCount },
            { label: 'Flagged Reviews', value: analytics?.flaggedReviewsCount },
            { label: 'Foods', value: analytics?.foodsCount },
            { label: 'Pending Foods', value: analytics?.pendingFoodsCount },
            { label: 'Food Reviews', value: analytics?.foodReviewsCount },
            { label: 'Flagged Food Reviews', value: analytics?.flaggedFoodReviewsCount },
          ].map((metric) => (
            <div key={metric.label} className="card">
              <h3 className="text-sm text-text-muted mb-1">{metric.label}</h3>
              <p className="text-2xl font-bold text-text-heading">
                {metric.value ?? '—'}
              </p>
            </div>
          ))}

          <div className="card md:col-span-2">
            <h3 className="text-lg font-semibold text-text-heading mb-4">
              Top Restaurants
            </h3>
            {analytics?.topRestaurants?.length ? (
              <ul className="space-y-2">
                {analytics.topRestaurants.map((r) => (
                  <li key={r._id} className="flex items-center justify-between text-sm">
                    <span>{r.name}</span>
                    <span className="text-text-muted">
                      ★ {r.averageRating.toFixed(1)} ({r.totalReviews})
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-text-muted text-sm">No data yet.</p>
            )}
          </div>

          <div className="card md:col-span-2">
            <h3 className="text-lg font-semibold text-text-heading mb-4">Top Foods</h3>
            {analytics?.topFoods?.length ? (
              <ul className="space-y-2">
                {analytics.topFoods.map((f) => (
                  <li key={f._id} className="flex items-center justify-between text-sm">
                    <span>{f.name}</span>
                    <span className="text-text-muted">
                      ★ {f.averageRating.toFixed(1)} ({f.totalReviews})
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-text-muted text-sm">No data yet.</p>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Admin;
