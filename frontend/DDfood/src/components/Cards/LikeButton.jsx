import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';

// Reddit-style voting for posts
// value: 1 = upvote, -1 = downvote, 0 = no vote
const VoteButton = ({
  post,
  initialValue = 0,
  initialScore = 0,
}) => {
  const queryClient = useQueryClient();
  const [value, setValue] = useState(initialValue);
  const [score, setScore] = useState(initialScore);

  const voteMutation = useMutation({
    mutationFn: (newValue) => api.post(`/posts/vote/${post._id}`, { value: newValue }),
    onSuccess: (response) => {
      const data = response.data.data;
      setValue(data.value);
      setScore(data.score);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', post._id] });
    },
  });

  const handleVote = (direction) => {
    const newValue = value === direction ? 0 : direction;
    voteMutation.mutate(newValue);
  };

  return (
    <div className="flex items-center gap-2 text-text-subtext">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => handleVote(1)}
        className={`p-1 rounded-full transition-colors ${
          value === 1 ? 'text-accent-amber bg-accent-amber/10' : 'hover:text-accent-amber'
        }`}
      >
        <FaArrowUp />
      </motion.button>

      <span className="font-semibold text-text-heading min-w-[2rem] text-center">
        {score}
      </span>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => handleVote(-1)}
        className={`p-1 rounded-full transition-colors ${
          value === -1 ? 'text-accent-turquoise bg-accent-turquoise/10' : 'hover:text-accent-turquoise'
        }`}
      >
        <FaArrowDown />
      </motion.button>
    </div>
  );
};

export default VoteButton;

