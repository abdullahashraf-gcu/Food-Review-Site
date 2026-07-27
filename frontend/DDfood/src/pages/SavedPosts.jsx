import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';
import ReviewCard from '../components/Cards/reviewcard';
import Loader from '../components/Common/Loader';
import { useAuth } from '../context/AuthContext';

const SavedPosts = () => {
  const { user } = useAuth();

  const { data: userData, isLoading } = useQuery({
    queryKey: ['user', user?._id],
    queryFn: async () => {
      const response = await api.get(`/users/${user._id}`);
      return response.data.data;
    },
    enabled: !!user,
  });

  const savedPostIds = userData?.savedPosts || [];

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ['savedPosts', savedPostIds],
    queryFn: async () => {
      const promises = savedPostIds.map((id) => api.get(`/posts/${id}`));
      const responses = await Promise.all(promises);
      return responses.map((res) => res.data.data);
    },
    enabled: savedPostIds.length > 0,
  });

  if (isLoading || postsLoading) {
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
        Saved Posts
      </h1>

      {posts && posts.length > 0 ? (
        <div>
          {posts.map((post, index) => (
            <ReviewCard key={post._id} post={post} index={index} />
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-text-muted mb-4">No saved posts yet</p>
          <p className="text-text-subtext">
            Save posts you like to view them later!
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default SavedPosts;

