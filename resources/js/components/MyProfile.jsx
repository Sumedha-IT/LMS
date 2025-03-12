import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { BsPersonLinesFill } from 'react-icons/bs';
import { MdDescription, MdWork, MdSchool, MdBuild, MdStar, MdLink } from 'react-icons/md';
import { FiEdit } from 'react-icons/fi';
import { useParams, useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:8000/api';

const mainMenu = [
  {
    id: 'personal',
    label: 'Personal Details',
    icon: <BsPersonLinesFill />,
    subMenu: [
      { id: 'basic', label: 'Basic Details', icon: <BsPersonLinesFill /> },
      { id: 'additional', label: 'Additional Details', icon: <MdDescription /> },
      { id: 'docs', label: 'Docs', icon: <MdDescription /> },
      { id: 'parent', label: 'Parent Details', icon: <BsPersonLinesFill /> },
      { id: 'qualification', label: 'Qualification', icon: <MdDescription /> },
    ],
  },
  { id: 'work', label: 'Work Experience', icon: <MdWork /> },
  { id: 'education', label: 'Education', icon: <MdSchool /> },
  { id: 'projects', label: 'Projects', icon: <MdBuild /> },
  { id: 'certifications', label: 'Certifications', icon: <MdStar /> },
  { id: 'achievements', label: 'Achievements', icon: <MdStar /> },
  { id: 'social', label: 'Social Links', icon: <MdLink /> },
];

const styles = `
  @keyframes slowBlink {
    0% { border-color: #f97316; }
    50% { border-color: transparent; }
    100% { border-color: #f97316; }
  }
  .slow-blink {
    animation: slowBlink 2s infinite;
    border-width: 2px;
    border-style: solid;
  }
  .active-menu {
    background-color: #f97316;
    color: white;
  }
  .active-menu .text-orange-500 {
    color: white;
  }
`;

const MyProfile = () => {
  const { user } = useParams();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    receive_email_notification: 0,
    receive_sms_notification: 0,
    registration_number: '',
    phone: '',
    gender: '',
    birthday: '',
    address: '',
    pincode: '',
    city: '',
    qualification: [],
    state_id: '',
    country_code: '',
    state: { id: '', name: '' },
    aadhaar_number: '',
    linkedin_profile: '',
    upload_resume: '',
    upload_aadhar: '',
    avatar_url: '',
    branch: [],
    domain: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchProfile(token);
  }, [user, navigate]);

  const fetchProfile = (token) => {
    setLoading(true);
    console.log('Fetching profile with token:', token);
    axios.get(`${API_URL}/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Cache-Control': 'no-cache', // Prevent caching
      },
      withCredentials: true,
    })
    .then((response) => {
      const userData = response.data.data?.user || response.data.user || response.data;
      console.log('Fetched profile data:', userData);
      setFormData({
        ...userData,
        qualification: Array.isArray(userData.qualification) ? userData.qualification : [],
      });
      if (userData.avatar_url) {
        setPhotoPreview(`${API_URL}${userData.avatar_url}`);
      }
      setLoading(false);
    })
    .catch((error) => {
      setError('Failed to load profile data');
      setLoading(false);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    });
  };

  const toggleMenu = (id) => {
    setActiveMenu(activeMenu === id ? null : id);
    setActiveSubTab(null);
    setSuccess(null);
    setError(null);
  };

  const toggleSubTab = (id) => {
    setActiveSubTab(activeSubTab === id ? null : id);
    setSuccess(null);
    setError(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleQualificationChange = (index, field, value) => {
    setFormData((prev) => {
      const newQualifications = [...prev.qualification];
      newQualifications[index] = {
        ...newQualifications[index],
        [field]: value,
      };
      return { ...prev, qualification: newQualifications };
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files[0],
    }));
    if (name === 'avatar_url') {
      setPhotoPreview(URL.createObjectURL(files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const token = localStorage.getItem('token');
    const formDataToSend = new FormData();
    
    Object.keys(formData).forEach(key => {
      if (key === 'qualification') {
        formDataToSend.append(key, JSON.stringify(formData[key]));
      } else if (key === 'state') {
        formDataToSend.append('state_id', formData.state.id);
      } else if (formData[key] instanceof File) {
        formDataToSend.append(key, formData[key]);
      } else if (formData[key] !== null && formData[key] !== undefined) {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      console.log('Data being sent to server:', Object.fromEntries(formDataToSend));
      const response = await axios.put(`${API_URL}/profile`, formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
        withCredentials: true,
      });
      const updatedData = response.data.data?.user || response.data.user || response.data;
      console.log('Server response after update:', updatedData);
      // Update state with server response
      setFormData({
        ...formData, // Keep local changes until confirmed
        ...updatedData, // Merge server response
        qualification: Array.isArray(updatedData.qualification) ? updatedData.qualification : formData.qualification,
      });
      setSuccess('Profile updated successfully!');
      // Refetch profile after a delay to confirm server state
      setTimeout(() => {
        setSuccess(null);
        fetchProfile(token);
      }, 3000);
    } catch (error) {
      console.error('Update error:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Failed to update profile');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const renderSubTabContent = () => {
    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (success) return <p className="text-green-500">{success}</p>;

    switch (activeSubTab) {
      case 'basic':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" name="name" value={formData.name || ''} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" name="email" value={formData.email || ''} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
              <input type="text" name="registration_number" value={formData.registration_number || ''} onChange={handleChange} className="w-full p-2 border rounded" disabled />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <div className="flex">
                <input type="text" name="country_code" value={formData.country_code || ''} onChange={handleChange} className="w-1/4 p-2 border rounded-l" />
                <input type="tel" name="phone" value={formData.phone || ''} onChange={handleChange} className="w-3/4 p-2 border rounded-r" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select name="gender" value={formData.gender || ''} onChange={handleChange} className="w-full p-2 border rounded">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Birthday</label>
              <input type="date" name="birthday" value={formData.birthday || ''} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
          </div>
        );
      case 'additional':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea name="address" value={formData.address || ''} onChange={handleChange} className="w-full p-2 border rounded" rows={4} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input type="text" name="city" value={formData.city || ''} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input type="text" value={formData.state?.name || ''} className="w-full p-2 border rounded" disabled />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
              <input type="text" name="pincode" value={formData.pincode || ''} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
          </div>
        );
      case 'docs':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number</label>
              <input type="text" name="aadhaar_number" value={formData.aadhaar_number || ''} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn Profile</label>
              <input type="url" name="linkedin_profile" value={formData.linkedin_profile || ''} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Resume</label>
              <input type="file" name="upload_resume" onChange={handleFileChange} className="w-full p-2" />
              {formData.upload_resume && typeof formData.upload_resume === 'string' && (
                <a href={formData.upload_resume} target="_blank" rel="noopener noreferrer" className="text-orange-500">View Current Resume</a>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Document</label>
              <input type="file" name="upload_aadhar" onChange={handleFileChange} className="w-full p-2" />
              {formData.upload_aadhar && typeof formData.upload_aadhar === 'string' && (
                <a href={formData.upload_aadhar} target="_blank" rel="noopener noreferrer" className="text-orange-500">View Current Aadhaar</a>
              )}
            </div>
          </div>
        );
      case 'parent':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parent Name</label>
              <input type="text" name="parent_name" value={formData.parent_name || ''} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parent Email</label>
              <input type="email" name="parent_email" value={formData.parent_email || ''} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parent Aadhaar</label>
              <input type="text" name="parent_aadhar" value={formData.parent_aadhar || ''} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
          </div>
        );
      case 'qualification':
        return (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications</label>
            {formData.qualification.length > 0 ? (
              formData.qualification.map((qual, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                    <input
                      type="text"
                      value={qual.year ?? ''}
                      onChange={(e) => handleQualificationChange(index, 'year', e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Institute</label>
                    <input
                      type="text"
                      value={qual.institute_name ?? ''}
                      onChange={(e) => handleQualificationChange(index, 'institute_name', e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Percentage</label>
                    <input
                      type="text"
                      value={qual.percentage ?? ''}
                      onChange={(e) => handleQualificationChange(index, 'percentage', e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                    <input
                      type="text"
                      value={qual.qualification_name ?? ''}
                      onChange={(e) => handleQualificationChange(index, 'qualification_name', e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
              ))
            ) : (
              <p>No qualifications available</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const renderMainTabContent = (menuId) => {
    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (success) return <p className="text-green-500">{success}</p>;

    switch (menuId) {
      case 'personal':
        return (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mainMenu.find((menu) => menu.id === 'personal').subMenu.map((subTab) => (
                <div
                  key={subTab.id}
                  className={`flex items-center justify-between p-4 bg-white rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow ${
                    activeSubTab === subTab.id ? 'slow-blink' : 'border-transparent'
                  }`}
                  onClick={() => toggleSubTab(subTab.id)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-orange-500">{subTab.icon}</span>
                    <span>{subTab.label}</span>
                  </div>
                  {activeSubTab === subTab.id ? <FaChevronUp className="w-4 h-4" /> : <FaChevronDown className="w-4 h-4" />}
                </div>
              ))}
            </div>
            {activeSubTab && activeMenu === 'personal' && (
              <div className="mt-4">
                {renderSubTabContent()}
                <button
                  type="submit"
                  className="mt-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:bg-gray-400"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </form>
        );
      case 'work':
        return <div className="grid grid-cols-1 gap-4"><p>No work experience data available in API</p></div>;
      case 'education':
        return <div className="grid grid-cols-1 gap-4"><p>No education data available in API</p></div>;
      case 'projects':
        return <div className="grid grid-cols-1 gap-4"><p>No projects data available in API</p></div>;
      case 'certifications':
        return <div className="grid grid-cols-1 gap-4"><p>No certifications data available in API</p></div>;
      case 'achievements':
        return <div className="grid grid-cols-1 gap-4"><p>No achievements data available in API</p></div>;
      case 'social':
        return (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                <input type="url" name="linkedin_profile" value={formData.linkedin_profile || ''} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <style>{styles}</style>
      <div className="relative w-full h-32 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3')` }}>
        <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow">
          <FiEdit className="text-gray-600 w-4 h-4" />
        </button>
      </div>
      <div className="relative bg-white shadow-lg rounded-lg p-6 mx-4 md:mx-auto md:max-w-4xl -mt-16">
        <div className="flex flex-col md:flex-row items-center md:items-start">
          <div className="absolute -top-12 left-1/2 md:left-6 transform -translate-x-1/2 md:translate-x-0">
            <img
              src={photoPreview || formData.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white shadow-md"
            />
          </div>
          <div className="md:ml-32 mt-12 md:mt-0 text-center md:text-left">
            <h2 className="text-2xl font-bold">{formData.name || 'Loading...'}</h2>
            <div className="mt-2">
              <input type="file" name="avatar_url" onChange={handleFileChange} className="mt-2" />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 mx-4 md:mx-auto md:max-w-4xl">
        {mainMenu.map((menu) => (
          <div
            key={menu.id}
            className={`flex items-center justify-between p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-all ${
              activeMenu === menu.id ? 'active-menu' : 'bg-white'
            }`}
            onClick={() => toggleMenu(menu.id)}
          >
            <div className="flex items-center gap-2">
              <span className={activeMenu === menu.id ? 'text-white' : 'text-orange-500'}>{menu.icon}</span>
              <span className={activeMenu === menu.id ? 'text-white' : 'text-gray-700'}>{menu.label}</span>
            </div>
            {activeMenu === menu.id ? <FaChevronUp className="w-4 h-4 text-white" /> : <FaChevronDown className="w-4 h-4 text-gray-700" />}
          </div>
        ))}
      </div>
      {activeMenu && (
        <div className="mt-4 p-6 mx-4 md:mx-auto md:max-w-4xl bg-white rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <span className="text-orange-500">{mainMenu.find((m) => m.id === activeMenu)?.icon}</span>
              {mainMenu.find((m) => m.id === activeMenu)?.label}
            </h3>
          </div>
          {renderMainTabContent(activeMenu)}
        </div>
      )}
    </div>
  );
};

export default MyProfile;