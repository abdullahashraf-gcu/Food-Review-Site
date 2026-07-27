import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowUp, FaArrowDown, FaComment, FaBookmark, FaRegBookmark, FaMapMarkerAlt } from 'react-icons/fa';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';

const ReviewCard = ({ post, index = 0 }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const upvotes = post.upvotes || [];
  const downvotes = post.downvotes || [];
  const initialScore = upvotes.length - downvotes.length;
  const initialValue =
    upvotes.some((id) => (typeof id === 'object' ? id._id : id) === user?._id) ? 1 :
    downvotes.some((id) => (typeof id === 'object' ? id._id : id) === user?._id) ? -1 :
    0;

  const [voteValue, setVoteValue] = useState(initialValue);
  const [score, setScore] = useState(initialScore);
  const [isSaved, setIsSaved] = useState(false);

  const voteMutation = useMutation({
    mutationFn: (value) => api.post(`/posts/vote/${post._id}`, { value }),
    onSuccess: (response) => {
      const data = response.data.data;
      setVoteValue(data.value);
      setScore(data.score);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const saveMutation = useMutation({
    mutationFn: () => api.post(`/posts/save/${post._id}`),
    onSuccess: () => {
      setIsSaved(!isSaved);
    },
  });

  const handleVote = (e, direction) => {
    e.preventDefault();
    const newValue = voteValue === direction ? 0 : direction;
    voteMutation.mutate(newValue);
  };

  const handleSave = (e) => {
    e.preventDefault();
    saveMutation.mutate();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="card mb-6"
    >
      <Link to={`/post/${post._id}`} className="block">
        {/* User Info */}
        <div className="flex items-center gap-3 mb-4">
          <Link
            to={`/profile/${post.user?._id}`}
            className="flex items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={post.user?.avatar || '/images/default-avatar.svg'}
              alt={post.user?.username}
              className="w-10 h-10 rounded-full object-cover border border-border"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/default-avatar.svg';
              }}
            />
            <div>
              <h3 className="font-semibold text-text-heading">
                {post.user?.fullName || post.user?.username}
              </h3>
              <p className="text-sm text-text-muted">@{post.user?.username}</p>
            </div>
          </Link>
        </div>

        {/* Content */}
        <p className="text-text-subtext mb-4 leading-relaxed">{post.content}</p>

        {/* Images */}
        {post.images && post.images.length > 0 && (
          <div className="mb-4 rounded-xl overflow-hidden">
            <img
              src={post.images[0]}
              alt="Food"
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Location */}
        {post.location?.name && (
          <div className="flex items-center gap-2 text-text-muted text-sm mb-4">
            <FaMapMarkerAlt className="text-accent-turquoise" />
            <span>{post.location.name}</span>
          </div>
        )}

        {/* Rating */}
        {post.rating && (
          <div className="mb-4">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-lg ${
                    i < post.rating
                      ? 'text-accent-amber'
                      : 'text-text-muted'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => handleVote(e, 1)}
              className={`p-1 rounded-full transition-colors ${
                voteValue === 1
                  ? 'text-accent-amber bg-accent-amber/10'
                  : 'text-text-subtext hover:text-accent-amber'
              }`}
            >
              <FaArrowUp />
            </button>
            <span className="font-semibold text-text-heading min-w-[2rem] text-center">
              {score}
            </span>
            <button
              onClick={(e) => handleVote(e, -1)}
              className={`p-1 rounded-full transition-colors ${
                voteValue === -1
                  ? 'text-accent-turquoise bg-accent-turquoise/10'
                  : 'text-text-subtext hover:text-accent-turquoise'
              }`}
            >
              <FaArrowDown />
            </button>
          </div>

          <Link
            to={`/post/${post._id}`}
            className="flex items-center gap-2 text-text-subtext hover:text-accent-turquoise transition-colors"
          >
            <FaComment />
            <span>{post.comments?.length || 0}</span>
          </Link>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 text-text-subtext hover:text-accent-amber transition-colors"
          >
            {isSaved ? (
              <FaBookmark className="text-accent-amber" />
            ) : (
              <FaRegBookmark />
            )}
          </button>
        </div>
      </Link>
    </motion.div>
  );
};

export default ReviewCard;

