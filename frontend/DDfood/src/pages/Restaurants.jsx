import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../lib/axios';
import Loader from '../components/Common/Loader';
import { useAuth } from '../context/AuthContext';
import {
  FaMapMarkerAlt,
  FaPhone,
  FaGlobe,
  FaSearch,
  FaFilter,
  FaPlus,
} from 'react-icons/fa';

const Restaurants = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [submissionData, setSubmissionData] = useState({
    name: '',
    address: '',
    cuisine: '',
    priceRange: '$',
    description: '',
    phone: '',
    website: '',
  });
  const [submissionImages, setSubmissionImages] = useState([]);
  const [submissionMessage, setSubmissionMessage] = useState('');
  const { user } = useAuth();

  const { data: restaurantsData, isLoading } = useQuery({
    queryKey: ['restaurants', searchQuery, selectedCuisine, selectedPriceRange],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCuisine) params.append('cuisine', selectedCuisine);
      if (selectedPriceRange) params.append('priceRange', selectedPriceRange);
      
      const response = await api.get(`/restaurants?${params.toString()}`);
      return response.data;
    },
  });

  const restaurants = restaurantsData?.data || [];

  const submitMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await api.post('/restaurants/submit', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      setSubmissionMessage('Thanks! Your restaurant is waiting for admin approval.');
      setSubmissionData({
        name: '',
        address: '',
        cuisine: '',
        priceRange: '$',
        description: '',
        phone: '',
        website: '',
      });
      setSubmissionImages([]);
      setShowSubmitForm(false);
    },
    onError: (error) => {
      setSubmissionMessage(
        error.response?.data?.message || 'Unable to submit right now. Please try again.'
      );
    },
  });

  const handleSuggestionSubmit = (e) => {
    e.preventDefault();
    setSubmissionMessage('');

    const formData = new FormData();
    Object.entries(submissionData).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    submissionImages.forEach((image) => formData.append('images', image));

    submitMutation.mutate(formData);
  };

  const handleSuggestionImages = (e) => {
    const files = Array.from(e.target.files);
    setSubmissionImages(files);
  };

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
      className="max-w-6xl mx-auto px-4 py-8 lg:ml-64"
    >
      <h1 className="text-3xl font-display font-bold text-text-heading mb-8">
        Restaurants
      </h1>

      {user && (
        <div className="card mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-text-heading">
                Know a place we missed?
              </h2>
              <p className="text-sm text-text-muted">
                Suggest a restaurant and our admins will review it.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSubmitForm(!showSubmitForm)}
              className="btn-primary flex items-center gap-2 justify-center"
            >
              <FaPlus />
              <span>{showSubmitForm ? 'Close form' : 'Suggest a restaurant'}</span>
            </motion.button>
          </div>
          {showSubmitForm && (
            <motion.form
              onSubmit={handleSuggestionSubmit}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-6 space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-text-subtext mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    value={submissionData.name}
                    onChange={(e) =>
                      setSubmissionData({ ...submissionData, name: e.target.value })
                    }
                    className="input-field w-full"
                    placeholder="Restaurant name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-text-subtext mb-1">Cuisine *</label>
                  <input
                    type="text"
                    required
                    value={submissionData.cuisine}
                    onChange={(e) =>
                      setSubmissionData({ ...submissionData, cuisine: e.target.value })
                    }
                    className="input-field w-full"
                    placeholder="Cuisine type"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-text-subtext mb-1">Address *</label>
                <input
                  type="text"
                  required
                  value={submissionData.address}
                  onChange={(e) =>
                    setSubmissionData({ ...submissionData, address: e.target.value })
                  }
                  className="input-field w-full"
                  placeholder="Street, City"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-text-subtext mb-1">Price Range *</label>
                  <select
                    value={submissionData.priceRange}
                    onChange={(e) =>
                      setSubmissionData({ ...submissionData, priceRange: e.target.value })
                    }
                    className="input-field w-full"
                  >
                    <option value="$">$ - Budget</option>
                    <option value="$$">$$ - Moderate</option>
                    <option value="$$$">$$$ - Expensive</option>
                    <option value="$$$$">$$$$ - Very Expensive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-text-subtext mb-1">Phone</label>
                  <input
                    type="tel"
                    value={submissionData.phone}
                    onChange={(e) =>
                      setSubmissionData({ ...submissionData, phone: e.target.value })
                    }
                    className="input-field w-full"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm text-text-subtext mb-1">Website</label>
                  <input
                    type="url"
                    value={submissionData.website}
                    onChange={(e) =>
                      setSubmissionData({ ...submissionData, website: e.target.value })
                    }
                    className="input-field w-full"
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-text-subtext mb-1">Description</label>
                <textarea
                  value={submissionData.description}
                  onChange={(e) =>
                    setSubmissionData({ ...submissionData, description: e.target.value })
                  }
                  rows={3}
                  className="input-field w-full resize-none"
                  placeholder="Why is it great?"
                />
              </div>

              <div>
                <label className="block text-sm text-text-subtext mb-2">Photos</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleSuggestionImages}
                  className="input-field w-full"
                />
                {submissionImages.length > 0 && (
                  <p className="text-xs text-text-muted mt-1">
                    {submissionImages.length} image(s) selected
                  </p>
                )}
              </div>

              {submissionMessage && (
                <p className="text-sm text-text-muted">{submissionMessage}</p>
              )}

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={submitMutation.isPending}
                className="btn-primary w-full md:w-auto"
              >
                {submitMutation.isPending ? <Loader size="sm" /> : 'Submit for approval'}
              </motion.button>
              <p className="text-xs text-text-muted">
                Admins approve suggestions before they appear publicly.
              </p>
            </motion.form>
          )}
        </div>
      )}

      {/* Search and Filters */}
      <div className="card mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search restaurants..."
              className="input-field w-full pl-10"
            />
          </div>
          
          <select
            value={selectedCuisine}
            onChange={(e) => setSelectedCuisine(e.target.value)}
            className="input-field w-full"
          >
            <option value="">All Cuisines</option>
            <option value="Italian">Italian</option>
            <option value="Chinese">Chinese</option>
            <option value="Mexican">Mexican</option>
            <option value="Indian">Indian</option>
            <option value="Japanese">Japanese</option>
            <option value="American">American</option>
            <option value="Thai">Thai</option>
            <option value="Mediterranean">Mediterranean</option>
          </select>
          
          <select
            value={selectedPriceRange}
            onChange={(e) => setSelectedPriceRange(e.target.value)}
            className="input-field w-full"
          >
            <option value="">All Price Ranges</option>
            <option value="$">$ - Budget</option>
            <option value="$$">$$ - Moderate</option>
            <option value="$$$">$$$ - Expensive</option>
            <option value="$$$$">$$$$ - Very Expensive</option>
          </select>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSearchQuery('');
              setSelectedCuisine('');
              setSelectedPriceRange('');
            }}
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <FaFilter />
            <span>Clear</span>
          </motion.button>
        </div>
      </div>

      {/* Scrollable row of top restaurants */}
      {restaurants.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-display font-bold text-text-heading mb-3">
            Top Picks
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {restaurants.slice(0, 10).map((restaurant) => (
              <Link
                key={restaurant._id}
                to={`/restaurants/${restaurant._id}`}
                className="min-w-[180px] max-w-[200px] bg-primary-bgSecondary rounded-xl p-3 hover:bg-primary-card transition-colors"
              >
                {restaurant.images?.[0] && (
                  <img
                    src={restaurant.images[0]}
                    alt={restaurant.name}
                    className="w-full h-28 object-cover rounded-lg mb-2"
                  />
                )}
                <p className="font-semibold text-sm text-text-heading truncate">
                  {restaurant.name}
                </p>
                <p className="text-xs text-text-muted truncate">
                  {restaurant.cuisine} • {restaurant.priceRange}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Restaurants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
          <motion.div
            key={restaurant._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="card hover:shadow-lg transition-shadow duration-300"
          >
            <Link to={`/restaurants/${restaurant._id}`}>
              {restaurant.images?.[0] && (
                <img
                  src={restaurant.images[0]}
                  alt={restaurant.name}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />
              )}
              
              <h3 className="text-xl font-semibold text-text-heading mb-2">
                {restaurant.name}
              </h3>
              
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-accent-turquoise/20 text-accent-turquoise rounded-lg text-sm">
                  {restaurant.cuisine}
                </span>
                <span className="px-2 py-1 bg-accent-amber/20 text-accent-amber rounded-lg text-sm font-semibold">
                  {restaurant.priceRange}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-text-muted text-sm mb-3">
                <FaMapMarkerAlt className="text-accent-turquoise" />
                <span className="truncate">{restaurant.address}</span>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-accent-amber text-lg">★</span>
                  <span className="text-text-heading font-medium">
                    {restaurant.averageRating.toFixed(1)}
                  </span>
                  <span className="text-text-muted text-sm">
                    ({restaurant.totalReviews})
                  </span>
                </div>
                
                <div className="flex gap-2">
                  {restaurant.phone && (
                    <FaPhone className="text-text-muted" />
                  )}
                  {restaurant.website && (
                    <FaGlobe className="text-text-muted" />
                  )}
                </div>
              </div>
              
              {restaurant.description && (
                <p className="text-text-subtext text-sm line-clamp-2">
                  {restaurant.description}
                </p>
              )}
            </Link>
          </motion.div>
        ))}
      </div>

      {restaurants.length === 0 && (
        <div className="text-center py-12">
          <p className="text-text-muted">
            {searchQuery || selectedCuisine || selectedPriceRange
              ? 'No restaurants found matching your criteria.'
              : 'No restaurants available yet.'}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default Restaurants;
