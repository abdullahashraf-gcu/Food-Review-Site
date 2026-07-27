import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../lib/axios';
import Loader from '../components/Common/Loader';
import { useAuth } from '../context/AuthContext';
import { FaSearch, FaFilter, FaPlus } from 'react-icons/fa';

const categories = [
  'Appetizer',
  'Main Course',
  'Dessert',
  'Snack',
  'Street Food',
  'Beverage',
];

const Foods = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [submissionData, setSubmissionData] = useState({
    name: '',
    cuisine: '',
    category: '',
    origin: '',
    priceRange: '$$',
    description: '',
    ingredients: '',
  });
  const [submissionImages, setSubmissionImages] = useState([]);

  const { data: foodsData, isLoading } = useQuery({
    queryKey: ['foods', searchQuery, selectedCuisine, selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCuisine) params.append('cuisine', selectedCuisine);
      if (selectedCategory) params.append('category', selectedCategory);
      const response = await api.get(`/foods?${params.toString()}`);
      return response.data;
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await api.post('/foods/submit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      setSubmissionMessage('Thanks! Your food suggestion is awaiting admin approval.');
      setSubmissionData({
        name: '',
        cuisine: '',
        category: '',
        origin: '',
        priceRange: '$$',
        description: '',
        ingredients: '',
      });
      setSubmissionImages([]);
      setShowSubmitForm(false);
    },
    onError: (error) => {
      setSubmissionMessage(
        error.response?.data?.message || 'Unable to submit suggestion right now.'
      );
    },
  });

  const handleSubmitSuggestion = (e) => {
    e.preventDefault();
    setSubmissionMessage('');

    const formData = new FormData();
    Object.entries(submissionData).forEach(([key, value]) => {
      if (value) {
        if (key === 'ingredients') {
          const list = value
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);
          formData.append(key, JSON.stringify(list));
        } else {
          formData.append(key, value);
        }
      }
    });
    submissionImages.forEach((image) => formData.append('images', image));

    submitMutation.mutate(formData);
  };

  const handleSuggestionImages = (e) => {
    const files = Array.from(e.target.files);
    setSubmissionImages(files);
  };

  const foods = foodsData?.data || [];

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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-heading">Foods</h1>
          <p className="text-text-muted">
            Discover dishes shared by the community and add them to your favorites.
          </p>
        </div>

        {user && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSubmissionMessage('');
              setShowSubmitForm(!showSubmitForm);
            }}
            className="btn-primary flex items-center gap-2 justify-center"
          >
            <FaPlus />
            <span>{showSubmitForm ? 'Close Form' : 'Suggest Food'}</span>
          </motion.button>
        )}
      </div>

      {user && showSubmitForm && (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmitSuggestion}
          className="card mb-8 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-text-subtext mb-1">Food Name *</label>
              <input
                type="text"
                value={submissionData.name}
                onChange={(e) => setSubmissionData({ ...submissionData, name: e.target.value })}
                required
                className="input-field w-full"
                placeholder="e.g., Spicy Ramen"
              />
            </div>
            <div>
              <label className="block text-sm text-text-subtext mb-1">Cuisine *</label>
              <input
                type="text"
                value={submissionData.cuisine}
                onChange={(e) => setSubmissionData({ ...submissionData, cuisine: e.target.value })}
                required
                className="input-field w-full"
                placeholder="Japanese"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-text-subtext mb-1">Category</label>
              <select
                value={submissionData.category}
                onChange={(e) => setSubmissionData({ ...submissionData, category: e.target.value })}
                className="input-field w-full"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-text-subtext mb-1">Origin</label>
              <input
                type="text"
                value={submissionData.origin}
                onChange={(e) => setSubmissionData({ ...submissionData, origin: e.target.value })}
                className="input-field w-full"
                placeholder="City or region"
              />
            </div>
            <div>
              <label className="block text-sm text-text-subtext mb-1">Price Range</label>
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
              placeholder="What makes this dish special?"
            />
          </div>

  <div>
    <label className="block text-sm text-text-subtext mb-1">
      Key Ingredients (comma separated)
    </label>
    <input
      type="text"
      value={submissionData.ingredients}
      onChange={(e) =>
        setSubmissionData({ ...submissionData, ingredients: e.target.value })
      }
      className="input-field w-full"
      placeholder="Noodles, chili oil, scallions..."
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
    {submitMutation.isPending ? <Loader size="sm" /> : 'Submit for Review'}
  </motion.button>
</motion.form>
      )}

      <div className="card mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search foods..."
              className="input-field w-full pl-10"
            />
          </div>
          <input
            type="text"
            value={selectedCuisine}
            onChange={(e) => setSelectedCuisine(e.target.value)}
            placeholder="Cuisine"
            className="input-field w-full"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-field w-full"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSearchQuery('');
              setSelectedCuisine('');
              setSelectedCategory('');
            }}
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <FaFilter />
            <span>Clear</span>
          </motion.button>
        </div>
      </div>

      {foods.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {foods.map((food) => (
            <motion.div
              key={food._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              className="card hover:shadow-lg transition-shadow duration-300"
            >
              <Link to={`/foods/${food._id}`}>
                {food.images?.[0] && (
                  <img
                    src={food.images[0]}
                    alt={food.name}
                    className="w-full h-48 object-cover rounded-xl mb-4"
                  />
                )}
                <h3 className="text-xl font-semibold text-text-heading mb-2">
                  {food.name}
                </h3>
                <p className="text-sm text-text-muted mb-2">{food.cuisine}</p>
                {food.category && (
                  <span className="inline-flex px-2 py-1 rounded-lg text-xs bg-accent-turquoise/20 text-accent-turquoise mb-2">
                    {food.category}
                  </span>
                )}
                <div className="flex items-center justify-between text-sm text-text-muted">
                  <span>★ {food.averageRating?.toFixed(1) || '0.0'}</span>
                  <span>{food.totalReviews || 0} reviews</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-text-muted">No foods match your filters yet.</p>
        </div>
      )}
    </motion.div>
  );
};

export default Foods;

