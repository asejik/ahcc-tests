import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home'; // Import the new Home page
import { Assessment } from './pages/Assessment'; // Temperament Test
import { BigFiveTest } from './pages/BigFiveTest'; // Big Five Test
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { useAuth } from './hooks/useAuth';
import { AttachmentTest } from './pages/AttachmentTest';
import { LoveLanguageTest } from './pages/LoveLanguageTest';

// ... ProtectedRoute component stays the same ...
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/temperament" element={<Assessment />} />
          <Route path="/big-five" element={<BigFiveTest />} />
          <Route path="/attachment" element={<AttachmentTest />} />
          <Route path="/love-language" element={<LoveLanguageTest />} />

          {/* Admin Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;