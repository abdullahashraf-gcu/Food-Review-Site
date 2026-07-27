import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import api from '../../lib/axios';
import Loader from '../Common/Loader';

const CommentList = ({ postId }) => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const response = await api.get(`/comments/${postId}`);
      return response.data.data;
    },
  });

  if (isLoading) {
    return <Loader size="sm" />;
  }

  const voteMutation = useMutation({
    mutationFn: ({ id, value }) => api.post(`/comments/vote/${id}`, { value }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });

  const handleVote = (comment, currentValue, direction) => {
    const newValue = currentValue === direction ? 0 : direction;
    voteMutation.mutate({ id: comment._id, value: newValue });
  };

  return (
    <div className="space-y-4">
      {data && data.length > 0 ? (
        data.map((comment, index) => {
          const upvotes = comment.upvotes || [];
          const downvotes = comment.downvotes || [];
          const score = upvotes.length - downvotes.length;
          const currentValue =
            upvotes.some((id) => (typeof id === 'object' ? id._id : id) === comment.user?._id)
              ? 1
              : downvotes.some(
                  (id) => (typeof id === 'object' ? id._id : id) === comment.user?._id
                )
              ? -1
              : 0;

          return (
            <motion.div
              key={comment._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-3"
            >
              <Link to={`/profile/${comment.user?._id}`}>
                <img
                  src={comment.user?.avatar || '/images/default-avatar.svg'}
                  alt={comment.user?.username}
                  className="w-8 h-8 rounded-full object-cover border border-border"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/default-avatar.svg';
                  }}
                />
              </Link>
              <div className="flex-1 bg-primary-bgSecondary rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <Link
                    to={`/profile/${comment.user?._id}`}
                    className="flex items-center gap-2"
                  >
                    <span className="font-semibold text-text-heading text-sm">
                      {comment.user?.fullName || comment.user?.username}
                    </span>
                    <span className="text-xs text-text-muted">
                      @{comment.user?.username}
                    </span>
                  </Link>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleVote(comment, currentValue, 1)}
                      className={`p-1 rounded-full transition-colors ${
                        currentValue === 1
                          ? 'text-accent-amber bg-accent-amber/10'
                          : 'text-text-subtext hover:text-accent-amber'
                      }`}
                    >
                      <FaArrowUp />
                    </button>
                    <span className="text-xs font-semibold text-text-heading min-w-[1.5rem] text-center">
                      {score}
                    </span>
                    <button
                      onClick={() => handleVote(comment, currentValue, -1)}
                      className={`p-1 rounded-full transition-colors ${
                        currentValue === -1
                          ? 'text-accent-turquoise bg-accent-turquoise/10'
                          : 'text-text-subtext hover:text-accent-turquoise'
                      }`}
                    >
                      <FaArrowDown />
                    </button>
                  </div>
                </div>
                <p className="text-text-subtext text-sm">{comment.content}</p>
              </div>
            </motion.div>
          );
        })
      ) : (
        <p className="text-text-muted text-center py-4">No comments yet</p>
      )}
    </div>
  );
};

export default CommentList;

