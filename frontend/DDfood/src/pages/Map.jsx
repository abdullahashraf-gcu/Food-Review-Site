import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';
import Loader from '../components/Common/Loader';

const Map = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await api.get('/posts');
      return response.data.data;
    },
  });

  const postsWithLocation = posts?.filter((post) => post.location?.coordinates) || [];

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
        Food Places Map
      </h1>

      <div className="card">
        <div className="h-96 bg-primary-bgSecondary rounded-xl flex items-center justify-center">
          {postsWithLocation.length > 0 ? (
            <div className="text-center">
              <p className="text-text-subtext mb-4">
                {postsWithLocation.length} places with location data
              </p>
              <p className="text-text-muted text-sm">
                Map integration would go here (Google Maps, Mapbox, etc.)
              </p>
            </div>
          ) : (
            <p className="text-text-muted">No posts with location data yet</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Map;

