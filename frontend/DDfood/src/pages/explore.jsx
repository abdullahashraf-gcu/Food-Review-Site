import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';
import ReviewCard from '../components/Cards/reviewcard';
import Loader from '../components/Common/Loader';

const Explore = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['trending'],
    queryFn: async () => {
      const response = await api.get('/posts/trending');
      return response.data.data;
    },
  });

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
      className="max-w-2xl mx-auto px-4 py-8 lg:ml-64"
    >
      <h1 className="text-3xl font-display font-bold text-text-heading mb-8">
        Trending Now
      </h1>

      {posts && posts.length > 0 ? (
        <div>
          {posts.map((post, index) => (
            <ReviewCard key={post._id} post={post} index={index} />
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-text-muted">No trending posts yet</p>
        </div>
      )}
    </motion.div>
  );
};

export default Explore;

