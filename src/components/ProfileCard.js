import React from 'react';

function ProfileCard({ user, onClick }) {
  return (
    <div
      className="bg-white rounded shadow p-6 flex items-center gap-4 cursor-pointer hover:shadow-lg"
      onClick={onClick}
    >
      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-xl text-purple-500">
        👤
      </div>
      <div>
        <div className="text-lg font-semibold">{user.name}</div>
        <div className="text-sm text-gray-500">{user.email}</div>
      </div>
    </div>
  );
}

export default ProfileCard;
