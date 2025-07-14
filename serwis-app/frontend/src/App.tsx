import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { LoginForm } from './components/LoginForm';
import { Dashboard } from './pages/Dashboard';
import { RepairsList } from './pages/RepairsList';
import { RepairForm } from './components/RepairForm';
import { ClientPortal } from './pages/ClientPortal';
import './index.css';

// Komponent chroniący trasy wymagające autoryzacji
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Komponent dla chronionych tras z layoutem
const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          
          <Routes>
            {/* Publiczne trasy */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/client" element={<ClientPortal />} />
            
            {/* Chronione trasy */}
            <Route path="/dashboard" element={
              <ProtectedLayout>
                <Dashboard />
              </ProtectedLayout>
            } />
            
            <Route path="/repairs" element={
              <ProtectedLayout>
                <RepairsList />
              </ProtectedLayout>
            } />
            
            <Route path="/repairs/new" element={
              <ProtectedLayout>
                <RepairForm />
              </ProtectedLayout>
            } />
            
            <Route path="/repairs/:id/edit" element={
              <ProtectedLayout>
                <RepairForm />
              </ProtectedLayout>
            } />
            
            {/* Przekierowanie domyślne */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App; 