import React, { useState } from 'react';
import AddProfileForm from '../components/AddProfileForm';

function Home({ users, onNavigate, onAddUser, onDeleteUser }) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddUser = async (user) => {
    setLoading(true);
    setError(null);
    
    setTimeout(() => {
      const success = onAddUser(user);
      if (success) {
        setShowForm(false);
      } else {
        setError('Failed to add user. Please try again.');
      }
      setLoading(false);
    }, 500);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setLoading(true);
      setTimeout(() => {
        const success = onDeleteUser(userId);
        if (!success) {
          setError('Failed to delete user. Please try again.');
        }
        setLoading(false);
      }, 300);
    }
  };

  const getUserProfileImage = (userId) => {
    const profileKey = `profile_${userId}`;
    const savedProfile = localStorage.getItem(profileKey);
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      return parsed.profileImage;
    }
    return null;
  };

  return (
    <div className="p-4 md:p-8 fade-in">
      {/* Modern Header */}
      <div className="glass rounded-2xl p-4 mb-6 shadow-xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <span className="text-2xl font-bold gradient-text">UserHub</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="icon-bounce p-3 hover:bg-purple-100 rounded-xl transition-all" title="Home">
              <svg className="w-6 h-6 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </button>
            <button className="icon-bounce p-3 hover:bg-purple-100 rounded-xl relative transition-all" title="Notifications">
              <svg className="w-6 h-6 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-2 right-2 w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
            </button>
            <button className="icon-bounce p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-lg hover:shadow-xl" title="Profile">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Users Section */}
      <div className="glass rounded-2xl shadow-2xl p-6 md:p-8 fade-in">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Users</h2>
              <p className="text-sm text-gray-500">Manage your team members</p>
            </div>
          </div>
          <button
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 font-semibold"
            onClick={() => setShowForm(true)}
            disabled={loading}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add User
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-3">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
            <button onClick={() => setError(null)} className="ml-auto underline hover:no-underline">Dismiss</button>
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse flex items-center gap-4 p-5 border border-gray-200 rounded-xl bg-gray-50">
                <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                </div>
                <div className="h-8 w-20 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg mb-2">No users found</p>
            <p className="text-gray-400 text-sm">Click "Add User" to create your first user</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Sr. No</th>
                    <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User Name</th>
                    <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">E-mail</th>
                    <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => {
                    const profileImage = getUserProfileImage(user.id);
                    return (
                      <tr key={user.id} className="border-b border-gray-100 hover:bg-purple-50 transition-colors">
                        <td className="p-4">
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-600 rounded-lg font-semibold text-sm">
                            {index + 1}
                          </span>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => onNavigate(user.id)}
                            className="flex items-center gap-3 hover:underline text-left"
                          >
                            <div className="profile-overlay">
                              {profileImage ? (
                                <img 
                                  src={profileImage} 
                                  alt={user.name}
                                  className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-100"
                                />
                              ) : (
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                  {user.name.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <span className="font-semibold text-gray-800 hover:text-purple-600 transition-colors">
                              {user.name}
                            </span>
                          </button>
                        </td>
                        <td className="p-4">
                          <span className="text-gray-600">{user.email}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => onNavigate(user.id)}
                              className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg transition-all"
                              title="View Profile"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-all"
                              title="Delete User"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden grid grid-cols-1 gap-4">
              {users.map((user, index) => {
                const profileImage = getUserProfileImage(user.id);
                return (
                  <div key={user.id} className="card-hover border-2 border-gray-100 rounded-xl p-4 bg-white">
                    <button
                      onClick={() => onNavigate(user.id)}
                      className="flex items-center gap-4 mb-3 w-full text-left"
                    >
                      <div className="profile-overlay">
                        {profileImage ? (
                          <img 
                            src={profileImage} 
                            alt={user.name}
                            className="w-16 h-16 rounded-full object-cover ring-4 ring-purple-100"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-purple-600 font-semibold mb-1">#{index + 1}</div>
                        <div className="font-bold text-lg text-gray-800">{user.name}</div>
                        <div className="text-sm text-gray-600">{user.email}</div>
                      </div>
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onNavigate(user.id)}
                        className="flex-1 py-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg font-semibold flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="flex-1 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg font-semibold flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {showForm && (
        <AddProfileForm 
          onAddUser={handleAddUser} 
          onCancel={() => setShowForm(false)}
          loading={loading}
        />
      )}
    </div>
  );
}

export default Home;
