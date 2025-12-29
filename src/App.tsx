import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Assessment } from './pages/Assessment';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { useAuth } from './hooks/useAuth'; // We will create this next

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950">
        <Routes>
          {/* Public Route: The Test */}
          <Route path="/" element={<Assessment />} />

          {/* Admin Routes */}
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;