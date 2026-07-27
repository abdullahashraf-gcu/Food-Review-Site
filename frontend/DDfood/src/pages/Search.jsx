import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../lib/axios';
import { FaSearch, FaUser, FaMapMarkerAlt } from 'react-icons/fa';

const Search = () => {
  const [query, setQuery] = useState('');

  const { data: users, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      if (!query.trim()) return [];
      const response = await api.get(`/users/search?q=${query}`);
      return response.data.data;
    },
    enabled: query.trim().length > 0,
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto px-4 py-8 lg:ml-64"
    >
      <h1 className="text-3xl font-display font-bold text-text-heading mb-8">
        Search
      </h1>

      <div className="relative mb-8">
        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users, places, foods..."
          className="input-field w-full pl-12"
        />
      </div>

      {query.trim() && (
        <div>
          <h2 className="text-xl font-semibold text-text-heading mb-4">
            Users
          </h2>
          {isLoading ? (
            <p className="text-text-muted">Searching...</p>
          ) : users && users.length > 0 ? (
            <div className="space-y-4">
              {users.map((user, index) => (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={`/profile/${user._id}`}
                    className="card flex items-center gap-4 hover:border-accent-amber/50 transition-colors"
                  >
                    <img
                      src={user.avatar || '/images/default-avatar.svg'}
                      alt={user.username}
                      className="w-16 h-16 rounded-full object-cover border border-border"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/default-avatar.svg';
                      }}
                    />
                    <div>
                      <h3 className="font-semibold text-text-heading">
                        {user.fullName || user.username}
                      </h3>
                      <p className="text-sm text-text-muted">@{user.username}</p>
                      {user.bio && (
                        <p className="text-sm text-text-subtext mt-1">{user.bio}</p>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-text-muted">No results found</p>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default Search;

