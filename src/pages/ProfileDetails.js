import React, { useState, useEffect } from 'react';

const tabs = ['Basic Info', 'Education & skills', 'Experience'];

const countryCodes = [
  { code: '+1', flag: '🇺🇸', name: 'USA' },
  { code: '+44', flag: '🇬🇧', name: 'UK' },
  { code: '+91', flag: '🇮🇳', name: 'India' },
  { code: '+86', flag: '🇨🇳', name: 'China' },
  { code: '+81', flag: '🇯🇵', name: 'Japan' },
  { code: '+49', flag: '🇩🇪', name: 'Germany' },
  { code: '+33', flag: '🇫🇷', name: 'France' },
  { code: '+61', flag: '🇦🇺', name: 'Australia' },
  { code: '+7', flag: '🇷🇺', name: 'Russia' },
  { code: '+55', flag: '🇧🇷', name: 'Brazil' },
];

function ProfileDetails({ userId, users, onBack, onUpdateUser }) {
  const [tab, setTab] = useState(0);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [countryCode, setCountryCode] = useState('+91');

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const foundUser = users.find(u => u.id === userId);
      if (foundUser) {
        setUser(foundUser);
        const profileKey = `profile_${userId}`;
        const savedProfile = localStorage.getItem(profileKey);
        if (savedProfile) {
          const parsedData = JSON.parse(savedProfile);
          setFormData(parsedData);
          if (parsedData.profileImage) {
            setProfileImage(parsedData.profileImage);
          }
          if (parsedData.resumeFile) {
            setResumeFile(parsedData.resumeFile);
          }
          if (parsedData.countryCode) {
            setCountryCode(parsedData.countryCode);
          }
        } else {
          setFormData({
            firstName: '',
            lastName: '',
            yearOfBirth: '',
            gender: '',
            alternatePhone: '',
            address: '',
            pincode: '',
            state: '',
            country: '',
            school: '',
            degree: '',
            course: '',
            yearCompletion: '',
            grade: '',
            skills: '',
            projects: '',
            domain: '',
            subDomain: '',
            experience: '',
            linkedin: '',
            profileImage: null,
            resumeFile: null,
            countryCode: '+91'
          });
        }
        setError(null);
      } else {
        setError('User not found');
      }
      setLoading(false);
    }, 500);
  }, [userId, users]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        setError('Image size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        setFormData(prev => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10000000) {
        setError('Resume size should be less than 10MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setResumeFile({
          name: file.name,
          data: reader.result,
          type: file.type
        });
        setFormData(prev => ({ 
          ...prev, 
          resumeFile: {
            name: file.name,
            data: reader.result,
            type: file.type
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleViewResume = () => {
    if (resumeFile && resumeFile.data) {
      const newWindow = window.open();
      if (resumeFile.type === 'application/pdf') {
        newWindow.document.write(
          `<iframe width='100%' height='100%' src='${resumeFile.data}'></iframe>`
        );
      } else {
        newWindow.location.href = resumeFile.data;
      }
    }
  };

  const handleSave = () => {
    setSaving(true);
    setError(null);
    
    setTimeout(() => {
      try {
        const profileKey = `profile_${userId}`;
        const dataToSave = {
          ...formData,
          profileImage: profileImage,
          resumeFile: resumeFile,
          countryCode: countryCode
        };
        localStorage.setItem(profileKey, JSON.stringify(dataToSave));
        
        onUpdateUser(userId, {
          name: `${formData.firstName || ''} ${formData.lastName || ''}`.trim() || user.name,
          profileImage: profileImage
        });
        
        setIsEditing(false);
        setSaving(false);
      } catch (err) {
        setError('Failed to save profile');
        setSaving(false);
      }
    }, 500);
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8">
        <div className="glass rounded-2xl shadow-xl p-8 animate-pulse">
          <div className="flex gap-6 items-center mb-8">
            <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
            <div className="flex-1 space-y-3">
              <div className="h-6 bg-gray-300 rounded w-48"></div>
              <div className="h-4 bg-gray-300 rounded w-64"></div>
              <div className="h-4 bg-gray-300 rounded w-40"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="p-4 md:p-8">
        <div className="glass rounded-2xl shadow-xl p-8">
          <div className="text-red-500 text-center">
            <p className="text-xl mb-4">{error}</p>
            <button onClick={onBack} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-xl">
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 fade-in">
      {/* Header - Same as Home.js */}
      <div className="glass rounded-2xl p-4 mb-6 shadow-xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-purple-100 rounded-xl transition-all">
              <svg className="w-6 h-6 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
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

      {/* Profile Card */}
      <div className="glass rounded-2xl shadow-2xl p-4 md:p-8 mb-4 md:mb-8">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-3">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
            <button onClick={() => setError(null)} className="ml-auto underline hover:no-underline">Dismiss</button>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center md:items-start border-b pb-4 md:pb-6">
          <div className="relative">
            {profileImage ? (
              <img 
                src={profileImage} 
                alt="Profile" 
                className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover ring-4 ring-purple-200"
              />
            ) : (
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center text-3xl md:text-4xl text-purple-600">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full p-2 cursor-pointer hover:from-purple-700 hover:to-pink-700 shadow-lg">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleProfileImageUpload}
                />
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </label>
            )}
          </div>
          <div className="text-center md:text-left flex-1">
            <div className="text-xl md:text-2xl font-bold mb-1">{user.name}</div>
            <div className="text-gray-600 flex flex-col md:flex-row items-center gap-2">
              <span>{user.email}</span>
              <button className="text-sm text-gray-400 hover:text-purple-600" onClick={() => {
                navigator.clipboard.writeText(user.email);
                alert('Email copied!');
              }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
            <div className="text-gray-600">{user.contact}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mt-4 md:mt-6 mb-4 md:mb-6">
          {tabs.map((t, i) => (
            <button
              key={t}
              className={`px-3 md:px-4 py-2 rounded-full text-sm font-medium transition-all ${
                tab === i 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                  : 'text-gray-600 hover:bg-purple-50'
              }`}
              onClick={() => setTab(i)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="relative">
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="absolute top-0 right-0 bg-purple-100 text-purple-600 hover:bg-purple-200 p-2 rounded-lg disabled:opacity-50 flex items-center gap-2 font-semibold text-sm"
            disabled={saving}
          >
            {saving ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : isEditing ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Save
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </>
            )}
          </button>
          
          {tab === 0 && (
            <div>
              <div className="font-semibold mb-4 text-lg">Basic Details</div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">First name</label>
                  <input 
                    name="firstName"
                    className="w-full border-2 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" 
                    placeholder="e.g. John"
                    value={formData.firstName || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Last name</label>
                  <input 
                    name="lastName"
                    className="w-full border-2 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" 
                    placeholder="e.g. Doe"
                    value={formData.lastName || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Email ID</label>
                  <input 
                    className="w-full border-2 rounded-xl p-3 bg-gray-50" 
                    value={user.email}
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Year of birth</label>
                  <select 
                    name="yearOfBirth"
                    className="w-full border-2 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    value={formData.yearOfBirth || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  >
                    <option value="">YYYY</option>
                    {Array.from({length: 80}, (_, i) => 2010 - i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Gender</label>
                  <select 
                    name="gender"
                    className="w-full border-2 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    value={formData.gender || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  >
                    <option value="">Select an option</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Phone number</label>
                  <div className="flex gap-2">
                    <select 
                      className="border-2 rounded-xl p-3 w-28 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      disabled={!isEditing}
                    >
                      {countryCodes.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.flag} {country.code}
                        </option>
                      ))}
                    </select>
                    <input 
                      className="flex-1 border-2 rounded-xl p-3 bg-gray-50" 
                      value={user.contact.replace(/^\+\d+\s*/, '')}
                      disabled
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Alternate Phone no</label>
                  <input 
                    name="alternatePhone"
                    className="w-full border-2 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" 
                    placeholder="e.g. 9876543210"
                    value={formData.alternatePhone || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">Address</label>
                  <input 
                    name="address"
                    className="w-full border-2 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" 
                    placeholder="Enter here"
                    value={formData.address || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Pincode</label>
                  <input 
                    name="pincode"
                    className="w-full border-2 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" 
                    placeholder="Enter here"
                    value={formData.pincode || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Domicile state</label>
                  <input 
                    name="state"
                    className="w-full border-2 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" 
                    placeholder="Enter state"
                    value={formData.state || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Domicile country</label>
                  <input 
                    name="country"
                    className="w-full border-2 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" 
                    placeholder="Enter country"
                    value={formData.country || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
          )}

          {tab === 1 && (
            <div>
              <div className="font-semibold mb-4 text-lg">Education Details</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">School / College</label>
                  <input 
                    name="school"
                    className="w-full border-2 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" 
                    placeholder="e.g. Lincoln College"
                    value={formData.school || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Highest degree or equivalent</label>
                  <input 
                    name="degree"
                    className="w-full border-2 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" 
                    placeholder="e.g. Bachelors in Technology"
                    value={formData.degree || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Course</label>
                  <input 
                    name="course"
                    className="w-full border-2 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" 
                    placeholder="e.g. Computer science engineering"
                    value={formData.course || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Year of completion</label>
                    <select 
                      name="yearCompletion"
                      className="w-full border-2 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      value={formData.yearCompletion || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    >
                      <option value="">YYYY</option>
                      {Array.from({length: 30}, (_, i) => 2030 - i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Grade</label>
                    <input 
                      name="grade"
                      className="w-full border-2 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" 
                      placeholder="Enter here"
                      value={formData.grade || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
              
              <div className="font-semibold mb-4 text-lg">Skills & Projects</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Skills</label>
                  <textarea 
                    name="skills"
                    className="w-full border-2 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" 
                    rows="4" 
                    placeholder="Enter here"
                    value={formData.skills || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Projects</label>
                  <textarea 
                    name="projects"
                    className="w-full border-2 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" 
                    rows="4" 
                    placeholder="Enter here"
                    value={formData.projects || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {tab === 2 && (
            <div>
              <div className="font-semibold mb-4 text-lg">Work Experience</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Domain</label>
                  <input 
                    name="domain"
                    className="w-full border-2 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" 
                    placeholder="e.g. Technology"
                    value={formData.domain || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Sub-domain</label>
                  <input 
                    name="subDomain"
                    className="w-full border-2 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" 
                    placeholder="e.g. MERN Stack"
                    value={formData.subDomain || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Experience</label>
                  <select 
                    name="experience"
                    className="w-full border-2 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    value={formData.experience || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  >
                    <option value="">Select an option</option>
                    <option value="0-1">0-1 years</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5+">5+ years</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="font-semibold mb-4 text-lg">LinkedIn</div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Profile URL</label>
                    <input 
                      name="linkedin"
                      className="w-full border-2 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" 
                      placeholder="linkedin.com/in/username"
                      value={formData.linkedin || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div>
                  <div className="font-semibold mb-4 text-lg">Resume</div>
                  {resumeFile ? (
                    <div className="border-2 border-purple-200 rounded-xl p-4 bg-purple-50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 flex-1 overflow-hidden">
                          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-sm truncate font-medium">{resumeFile.name}</span>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={handleViewResume}
                            className="bg-white border-2 border-purple-600 text-purple-600 px-3 py-1 rounded-lg text-sm hover:bg-purple-600 hover:text-white transition-all font-semibold"
                          >
                            View
                          </button>
                          {isEditing && (
                            <button
                              onClick={() => {
                                setResumeFile(null);
                                setFormData(prev => ({ ...prev, resumeFile: null }));
                              }}
                              className="text-red-500 hover:bg-red-50 px-2 rounded-lg transition-all"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div className="text-sm text-gray-500">No file uploaded</div>
                    </div>
                  )}
                  {isEditing && (
                    <label className="mt-3 w-full block">
                      <input 
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={handleResumeUpload}
                      />
                      <div className="w-full border-2 border-purple-600 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 rounded-xl text-center cursor-pointer hover:from-purple-700 hover:to-pink-700 font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        {resumeFile ? 'Change Resume' : 'Upload Resume'}
                      </div>
                    </label>
                  )}
                  <p className="text-xs text-gray-500 mt-2">Supported formats: PDF, DOC, DOCX (Max 10MB)</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileDetails;
