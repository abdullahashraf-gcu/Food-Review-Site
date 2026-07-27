import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import Loader from '../components/Common/Loader';
import { FaImage, FaMapMarkerAlt, FaTimes } from 'react-icons/fa';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState(0);
  const [tags, setTags] = useState('');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      navigate('/');
    },
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('content', content);
    if (location) formData.append('location', location);
    if (rating) formData.append('rating', rating);
    if (tags) formData.append('tags', tags);
    images.forEach((image) => {
      formData.append('images', image);
    });

    createMutation.mutate(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto px-4 py-8 lg:ml-64"
    >
      <h1 className="text-3xl font-display font-bold text-text-heading mb-8">
        Create Post
      </h1>

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <label className="block text-text-subtext text-sm mb-2">
            What did you eat?
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={6}
            className="input-field w-full resize-none"
            placeholder="Share your food experience..."
          />
        </div>

        <div>
          <label className="block text-text-subtext text-sm mb-2">
            Images
          </label>
          <div className="flex flex-wrap gap-4 mb-4">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Preview ${index + 1}`}
                  className="w-24 h-24 object-cover rounded-xl border border-border"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>
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
        </div>

        <div>
          <label className="block text-text-subtext text-sm mb-2">
            Location
          </label>
          <div className="relative">
            <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="input-field w-full pl-10"
              placeholder="Where did you eat?"
            />
          </div>
        </div>

        <div>
          <label className="block text-text-subtext text-sm mb-2">
            Rating
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2xl transition-colors ${
                  star <= rating
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
            Tags (comma separated)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="input-field w-full"
            placeholder="pizza, italian, delicious"
          />
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={createMutation.isPending}
          className="btn-primary w-full"
        >
          {createMutation.isPending ? <Loader size="sm" /> : 'Post Review'}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default CreatePost;

