import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import Loader from '../components/Common/Loader';
import CommentList from '../components/Cards/CommentList';
import VoteButton from '../components/Cards/LikeButton';
import { useState } from 'react';
import { FaComment, FaMapMarkerAlt, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const PostDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [comment, setComment] = useState('');
  const queryClient = useQueryClient();

  const { data: post, isLoading } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const response = await api.get(`/posts/${id}`);
      return response.data.data;
    },
  });

  const commentMutation = useMutation({
    mutationFn: async (content) => {
      const response = await api.post(`/comments/${id}`, { content });
      return response.data;
    },
    onSuccess: () => {
      setComment('');
      queryClient.invalidateQueries({ queryKey: ['post', id] });
      queryClient.invalidateQueries({ queryKey: ['comments', id] });
    },
  });

  const handleComment = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      commentMutation.mutate(comment);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text-muted">Post not found</p>
      </div>
    );
  }

  const upvotes = post.upvotes || [];
  const downvotes = post.downvotes || [];
  const score = upvotes.length - downvotes.length;
  const userVote =
    upvotes.some((id) => (typeof id === 'object' ? id._id : id) === user?._id) ? 1 :
    downvotes.some((id) => (typeof id === 'object' ? id._id : id) === user?._id) ? -1 :
    0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto px-4 py-8 lg:ml-64"
    >
      <div className="card">
        {/* User Info */}
        <div className="flex items-center gap-3 mb-4">
          <Link to={`/profile/${post.user?._id}`} className="flex items-center gap-3">
            <img
              src={post.user?.avatar || '/images/default-avatar.svg'}
              alt={post.user?.username}
              className="w-12 h-12 rounded-full object-cover border border-border"
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
        <p className="text-text-subtext mb-6 leading-relaxed text-lg">
          {post.content}
        </p>

        {/* Images */}
        {post.images && post.images.length > 0 && (
          <div className="mb-6 rounded-xl overflow-hidden">
            <img
              src={post.images[0]}
              alt="Food"
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Location */}
        {post.location?.name && (
          <div className="flex items-center gap-2 text-text-muted mb-4">
            <FaMapMarkerAlt className="text-accent-turquoise" />
            <span>{post.location.name}</span>
          </div>
        )}

        {/* Rating */}
        {post.rating && (
          <div className="mb-6">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-2xl ${
                    i < post.rating ? 'text-accent-amber' : 'text-text-muted'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border mb-6">
          <VoteButton post={post} initialValue={userVote} initialScore={score} />
          <div className="flex items-center gap-2 text-text-subtext">
            <FaComment />
            <span>{post.comments?.length || 0}</span>
          </div>
        </div>

        {/* Comment Form */}
        <form onSubmit={handleComment} className="mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="input-field flex-1"
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={commentMutation.isPending}
              className="btn-primary"
            >
              {commentMutation.isPending ? <Loader size="sm" /> : 'Post'}
            </motion.button>
          </div>
        </form>

        {/* Comments */}
        <div>
          <h3 className="text-xl font-semibold text-text-heading mb-4">
            Comments
          </h3>
          <CommentList postId={id} />
        </div>
      </div>
    </motion.div>
  );
};

export default PostDetails;

