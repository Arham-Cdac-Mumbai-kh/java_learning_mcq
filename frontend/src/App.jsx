import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TopicDetail from './pages/TopicDetail';
import Quiz from './pages/Quiz';
import Playground from './pages/Playground';
import AdminPanel from './pages/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-main-gradient text-slate-900 dark:text-slate-100">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />

                <Route path="/topic/:id" element={
                  <ProtectedRoute>
                    <TopicDetail />
                  </ProtectedRoute>
                } />

                <Route path="/quiz/:topicId" element={
                  <ProtectedRoute>
                    <Quiz />
                  </ProtectedRoute>
                } />

                <Route path="/playground" element={
                  <ProtectedRoute>
                    <Playground />
                  </ProtectedRoute>
                } />

                <Route path="/admin" element={
                  <ProtectedRoute role="admin">
                    <AdminPanel />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
