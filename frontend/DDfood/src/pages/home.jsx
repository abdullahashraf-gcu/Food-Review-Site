import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';
import ReviewCard from '../components/Cards/reviewcard';
import Loader from '../components/Common/Loader';

const Home = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await api.get('/posts');
      return response.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center lg:pl-64">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex lg:pl-64">
      {/* This wrapper ensures the feed is centered **within the remaining space**
          after the sidebar (which is 16rem / 64px in Tailwind) instead of
          being centered across the full viewport. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 flex justify-center"
      >
        <div className="w-full max-w-2xl px-4 py-8">
          <h1 className="text-3xl font-display font-bold text-text-heading mb-8">
            Your Feed
          </h1>

          {posts && posts.length > 0 ? (
            <div>
              {posts.map((post, index) => (
                <ReviewCard key={post._id} post={post} index={index} />
              ))}
            </div>
          ) : (
            <div className="card text-center py-12">
              <p className="text-text-muted mb-4">No posts yet</p>
              <p className="text-text-subtext">
                Follow users or create your first post to see content here!
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Home;

