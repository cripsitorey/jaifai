import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/auth/LoginPage';
import SetupPage from './pages/setup/SetupPage';
import DashboardPage from './pages/dashboard/DashboardPage';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/setup" element={<SetupPage />} />

        <Route path="/" element={<ProtectedRoute />}>
          <Route index element={<DashboardPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
