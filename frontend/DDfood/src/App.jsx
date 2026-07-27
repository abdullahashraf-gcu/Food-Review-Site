import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Common/ProtectedRoute';
import Navbar from './components/Bars/navbar';
import Sidebar from './components/Bars/Sidebar';
import Footer from './components/Bars/footer';


// Pages
import Login from './pages/login';
import Register from './pages/register';
import Home from './pages/home';
import Explore from './pages/explore';
import CreatePost from './pages/CreatePost';
import PostDetails from './pages/PostDetails';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import SavedPosts from './pages/SavedPosts';
import Followers from './pages/Followers';
import Following from './pages/Following';
import Settings from './pages/Settings';
import Search from './pages/Search';
import Restaurants from './pages/Restaurants';
import RestaurantDetails from './pages/RestaurantDetails';
import Foods from './pages/Foods';
import FoodDetails from './pages/FoodDetails';
import Admin from './pages/Admin';
import NotFound from './pages/notfound';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-primary-bg">
            <Navbar />
            <Sidebar />
            <main className="pb-20 lg:pb-0">
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/explore"
                  element={
                    <ProtectedRoute>
                      <Explore />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/create"
                  element={
                    <ProtectedRoute>
                      <CreatePost />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/post/:id"
                  element={
                    <ProtectedRoute>
                      <PostDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile/:id"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile/:id/edit"
                  element={
                    <ProtectedRoute>
                      <EditProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile/:id/followers"
                  element={
                    <ProtectedRoute>
                      <Followers />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile/:id/following"
                  element={
                    <ProtectedRoute>
                      <Following />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/saved"
                  element={
                    <ProtectedRoute>
                      <SavedPosts />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/search"
                  element={
                    <ProtectedRoute>
                      <Search />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/restaurants"
                  element={
                    <ProtectedRoute>
                      <Restaurants />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/restaurants/:id"
                  element={
                    <ProtectedRoute>
                      <RestaurantDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/foods"
                  element={
                    <ProtectedRoute>
                      <Foods />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/foods/:id"
                  element={
                    <ProtectedRoute>
                      <FoodDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <Admin />
                    </ProtectedRoute>
                  }
                />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
