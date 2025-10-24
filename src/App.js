import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import ProfileDetails from './pages/ProfileDetails';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      setLoading(true);
      const savedUsers = localStorage.getItem('users');
      if (savedUsers) {
        setUsers(JSON.parse(savedUsers));
      } else {
        const defaultUsers = [
          { id: 1, name: 'Dave Richards', email: 'dave@mail.com', contact: '+91 8332883854' },
          { id: 2, name: 'Abhishek Hari', email: 'hari@mail.com', contact: '+91 9876543210' },
          { id: 3, name: 'Nishta Gupta', email: 'nishta@mail.com', contact: '+91 9988776655' },
        ];
        setUsers(defaultUsers);
        localStorage.setItem('users', JSON.stringify(defaultUsers));
      }
      setError(null);
    } catch (err) {
      setError('Failed to load users from storage');
      console.error(err);
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      try {
        localStorage.setItem('users', JSON.stringify(users));
      } catch (err) {
        setError('Failed to save users to storage');
        console.error(err);
      }
    }
  }, [users]);

  const navigateToProfile = (userId) => {
    setSelectedUserId(userId);
    setCurrentPage('profile');
  };

  const navigateToHome = () => {
    setCurrentPage('home');
    setSelectedUserId(null);
  };

  const addUser = (userData) => {
    try {
      const newUser = {
        ...userData,
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1
      };
      setUsers([...users, newUser]);
      setError(null);
      return true;
    } catch (err) {
      setError('Failed to add user');
      console.error(err);
      return false;
    }
  };

  const updateUser = (userId, userData) => {
    try {
      setUsers(users.map(user => 
        user.id === userId ? { ...user, ...userData } : user
      ));
      setError(null);
      return true;
    } catch (err) {
      setError('Failed to update user');
      console.error(err);
      return false;
    }
  };

  const deleteUser = (userId) => {
    try {
      setUsers(users.filter(user => user.id !== userId));
      setError(null);
      return true;
    } catch (err) {
      setError('Failed to delete user');
      console.error(err);
      return false;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-white rounded-full animate-spin"></div>
          </div>
          <div className="text-white text-xl font-semibold">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
      {error && (
        <div className="bg-red-500 text-white px-6 py-4 text-center shadow-lg relative">
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="absolute right-4 top-1/2 transform -translate-y-1/2 hover:bg-red-600 px-3 py-1 rounded">
            ✕
          </button>
        </div>
      )}
      {currentPage === 'home' && (
        <Home 
          users={users}
          onNavigate={navigateToProfile} 
          onAddUser={addUser}
          onDeleteUser={deleteUser}
        />
      )}
      {currentPage === 'profile' && (
        <ProfileDetails 
          userId={selectedUserId}
          users={users}
          onBack={navigateToHome}
          onUpdateUser={updateUser}
        />
      )}
    </div>
  );
}

export default App;
