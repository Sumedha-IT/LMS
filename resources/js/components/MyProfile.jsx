import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { BsPersonLinesFill } from 'react-icons/bs';
import { MdDescription, MdWork, MdSchool, MdBuild, MdStar, MdLink } from 'react-icons/md';
import { FiEdit } from 'react-icons/fi';
import { useParams } from 'react-router-dom'; // To get user ID from URL

const API_URL = 'http://localhost:8000';

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
      { id: 'notification', label: 'Notification', icon: <MdDescription /> },
    ],
  },
  { id: 'work', label: 'Work Experience', icon: <MdWork /> },
  { id: 'education', label: 'Education', icon: <MdSchool /> },
  { id: 'projects', label: 'Projects', icon: <MdBuild /> },
  { id: 'certifications', label: 'Certifications', icon: <MdStar /> },
  { id: 'achievements', label: 'Achievements', icon: <MdStar /> },
  { id: 'social', label: 'Social Links', icon: <MdLink /> },
];

// Custom CSS for slow blinking animation and active menu styling
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
  const { user } = useParams(); // Get user ID from URL (e.g., /1/administrator/my-profile)
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState(null);
  const [formData, setFormData] = useState({
    registration_number: '',
    domain_id: '',
    phone: '',
    country_code: '',
    gender: '',
    birthday: '',
    qualification: [],
    address: '',
    city: '',
    state_id: '',
    pincode: '',
    aadhaar_number: '',
    linkedin_profile: '',
    upload_resume: null,
    upload_aadhar: null,
    parent_name: '',
    parent_email: '',
    parent_aadhar: '',
    parent_occupation: '',
    residential_address: '',
    receive_email_notification: false,
    receive_sms_notification: false,
    photo: null,
    work_experience: [],
    education: [],
    projects: [],
    certifications: [],
    achievements: [],
    social_links: { linkedin: '', github: '' },
  });
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    if (user) {
      axios
        .get(`${API_URL}/profile/${user}`, { withCredentials: true })
        .then((response) => {
          setFormData(response.data);
          if (response.data.photo_url) {
            setPhotoPreview(`${API_URL}${response.data.photo_url}`);
          }
        })
        .catch((error) => console.error('Error fetching profile:', error));

      // Fetch certificates separately if not included in /profile/{user}
      axios
        .get(`${API_URL}/${user}/documents`, { withCredentials: true })
        .then((response) => {
          setFormData((prev) => ({ ...prev, certifications: response.data }));
        })
        .catch((error) => console.error('Error fetching documents:', error));
    }
  }, [user]);

  const toggleMenu = (id) => {
    setActiveMenu(activeMenu === id ? null : id);
    setActiveSubTab(null); // Reset subtab when switching main menu
  };

  const toggleSubTab = (id) => {
    setActiveSubTab(activeSubTab === id ? null : id);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files[0],
    }));
    if (name === 'photo') {
      setPhotoPreview(URL.createObjectURL(files[0]));
    }
  };

  const addItem = (key) => {
    setFormData((prev) => ({
      ...prev,
      [key]:
        key === 'qualification'
          ? [...prev[key], { qualification_id: '', year: '', institute_name: '', percentage: '' }]
          : key === 'work_experience'
          ? [...prev[key], { company: '', role: '' }]
          : key === 'education'
          ? [...prev[key], { degree: '', institute: '' }]
          : key === 'projects'
          ? [...prev[key], { name: '', description: '' }]
          : key === 'certifications'
          ? [...prev[key], { name: '', issuer: '' }]
          : key === 'achievements'
          ? [...prev[key], { title: '', description: '' }]
          : prev[key],
    }));
  };

  const handleItemChange = (key, index, field, value) => {
    const updatedItems = [...formData[key]];
    updatedItems[index][field] = value;
    setFormData((prev) => ({ ...prev, [key]: updatedItems }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Fetch token
  
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (Array.isArray(formData[key])) {
        data.append(key, JSON.stringify(formData[key]));
      } else if (formData[key] instanceof File) {
        data.append(key, formData[key]);
      } else {
        data.append(key, formData[key]);
      }
    });
  
    try {
      const response = await axios.put(`${API_URL}/profile`, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
  
      setFormData(response.data);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };
  

  const renderSubTabContent = (tabId) => {
    switch (tabId) {
      case 'basic':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
              <input type="text" name="registration_number" value={formData.registration_number} onChange={handleChange} disabled className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
              <input type="text" value={formData.domain_id} disabled className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country Code</label>
              <select name="country_code" value={formData.country_code} onChange={handleChange} disabled className="w-full p-2 border rounded">
                <option value="+91">+91</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} disabled className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-2 border rounded">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Birthday</label>
              <input type="date" name="birthday" value={formData.birthday} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications</label>
              {formData.qualification.map((qual, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                    <select
                      value={qual.qualification_id}
                      onChange={(e) => handleItemChange('qualification', index, 'qualification_id', e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Select</option>
                      <option value="1">B.Tech</option>
                      <option value="2">M.Tech</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                    <input
                      type="text"
                      value={qual.year}
                      onChange={(e) => handleItemChange('qualification', index, 'year', e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Institute</label>
                    <input
                      type="text"
                      value={qual.institute_name}
                      onChange={(e) => handleItemChange('qualification', index, 'institute_name', e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Percentage</label>
                    <input
                      type="text"
                      value={qual.percentage}
                      onChange={(e) => handleItemChange('qualification', index, 'percentage', e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => addItem('qualification')} className="flex items-center gap-1 text-orange-500">
                <FiEdit className="w-4 h-4" />
                <span>Add Qualification</span>
              </button>
            </div>
          </div>
        );
      case 'additional':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea name="address" value={formData.address} onChange={handleChange} className="w-full p-2 border rounded" rows={4} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <select name="state_id" value={formData.state_id} onChange={handleChange} className="w-full p-2 border rounded">
                <option value="">Select State</option>
                <option value="1">State 1</option>
                <option value="2">State 2</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
              <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
          </div>
        );
      case 'docs':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number</label>
              <input type="text" name="aadhaar_number" value={formData.aadhaar_number} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn Profile</label>
              <input type="url" name="linkedin_profile" value={formData.linkedin_profile} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Resume</label>
              <input type="file" name="upload_resume" onChange={handleFileChange} className="w-full p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Document</label>
              <input type="file" name="upload_aadhar" onChange={handleFileChange} className="w-full p-2" />
            </div>
          </div>
        );
      case 'parent':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parent Name</label>
              <input type="text" name="parent_name" value={formData.parent_name} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parent Email</label>
              <input type="email" name="parent_email" value={formData.parent_email} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parent Aadhaar</label>
              <input type="text" name="parent_aadhar" value={formData.parent_aadhar} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parent Occupation</label>
              <input type="text" name="parent_occupation" value={formData.parent_occupation} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Residential Address</label>
              <textarea name="residential_address" value={formData.residential_address} onChange={handleChange} className="w-full p-2 border rounded" rows={4} />
            </div>
          </div>
        );
      case 'notification':
        return (
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center">
              <input type="checkbox" name="receive_email_notification" checked={formData.receive_email_notification} onChange={handleChange} className="mr-2" />
              <label className="text-sm font-medium text-gray-700">Receive Email Notification</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" name="receive_sms_notification" checked={formData.receive_sms_notification} onChange={handleChange} className="mr-2" />
              <label className="text-sm font-medium text-gray-700">Receive SMS Notification</label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderMainTabContent = (menuId) => {
    switch (menuId) {
      case 'personal':
        return (
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
        );
      case 'work':
        return (
          <div>
            {formData.work_experience.map((work, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input type="text" value={work.company || ''} onChange={(e) => handleItemChange('work_experience', index, 'company', e.target.value)} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <input type="text" value={work.role || ''} onChange={(e) => handleItemChange('work_experience', index, 'role', e.target.value)} className="w-full p-2 border rounded" />
                </div>
              </div>
            ))}
            <button type="button" onClick={() => addItem('work_experience')} className="flex items-center gap-1 text-orange-500">
              <FiEdit className="w-4 h-4" />
              <span>Add Work Experience</span>
            </button>
          </div>
        );
      case 'education':
        return (
          <div>
            {formData.education.map((edu, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                  <input type="text" value={edu.degree || ''} onChange={(e) => handleItemChange('education', index, 'degree', e.target.value)} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Institute</label>
                  <input type="text" value={edu.institute || ''} onChange={(e) => handleItemChange('education', index, 'institute', e.target.value)} className="w-full p-2 border rounded" />
                </div>
              </div>
            ))}
            <button type="button" onClick={() => addItem('education')} className="flex items-center gap-1 text-orange-500">
              <FiEdit className="w-4 h-4" />
              <span>Add Education</span>
            </button>
          </div>
        );
      case 'projects':
        return (
          <div>
            {formData.projects.map((project, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                  <input type="text" value={project.name || ''} onChange={(e) => handleItemChange('projects', index, 'name', e.target.value)} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input type="text" value={project.description || ''} onChange={(e) => handleItemChange('projects', index, 'description', e.target.value)} className="w-full p-2 border rounded" />
                </div>
              </div>
            ))}
            <button type="button" onClick={() => addItem('projects')} className="flex items-center gap-1 text-orange-500">
              <FiEdit className="w-4 h-4" />
              <span>Add Project</span>
            </button>
          </div>
        );
      case 'certifications':
        return (
          <div>
            {formData.certifications.map((cert, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Certification Name</label>
                  <input type="text" value={cert.name || ''} onChange={(e) => handleItemChange('certifications', index, 'name', e.target.value)} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Issuer</label>
                  <input type="text" value={cert.issuer || ''} onChange={(e) => handleItemChange('certifications', index, 'issuer', e.target.value)} className="w-full p-2 border rounded" />
                </div>
              </div>
            ))}
            <button type="button" onClick={() => addItem('certifications')} className="flex items-center gap-1 text-orange-500">
              <FiEdit className="w-4 h-4" />
              <span>Add Certification</span>
            </button>
          </div>
        );
      case 'achievements':
        return (
          <div>
            {formData.achievements.map((ach, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Achievement Title</label>
                  <input type="text" value={ach.title || ''} onChange={(e) => handleItemChange('achievements', index, 'title', e.target.value)} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input type="text" value={ach.description || ''} onChange={(e) => handleItemChange('achievements', index, 'description', e.target.value)} className="w-full p-2 border rounded" />
                </div>
              </div>
            ))}
            <button type="button" onClick={() => addItem('achievements')} className="flex items-center gap-1 text-orange-500">
              <FiEdit className="w-4 h-4" />
              <span>Add Achievement</span>
            </button>
          </div>
        );
      case 'social':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
              <input
                type="url"
                name="linkedin"
                value={formData.social_links.linkedin || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, social_links: { ...prev.social_links, linkedin: e.target.value } }))}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
              <input
                type="url"
                name="github"
                value={formData.social_links.github || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, social_links: { ...prev.social_links, github: e.target.value } }))}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <style>{styles}</style>
      <div
        className="relative w-full h-32 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
        }}
      >
        <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow">
          <FiEdit className="text-gray-600 w-4 h-4" />
        </button>
      </div>
      <div className="relative bg-white shadow-lg rounded-lg p-6 mx-4 md:mx-auto md:max-w-4xl -mt-16">
        <div className="flex flex-col md:flex-row items-center md:items-start">
          <div className="absolute -top-12 left-1/2 md:left-6 transform -translate-x-1/2 md:translate-x-0">
            <img
              src={photoPreview || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80'}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white shadow-md"
            />
          </div>
          <div className="md:ml-32 mt-12 md:mt-0 text-center md:text-left">
            <h2 className="text-2xl font-bold">User Name</h2>
            <div className="mt-2">
              <input type="file" name="photo" onChange={handleFileChange} className="mt-2" />
            </div>
          </div>
        </div>
      </div>
      {/* Main Menu */}
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
      {/* Main Menu Content */}
      {activeMenu && (
        <div className="mt-4 p-6 mx-4 md:mx-auto md:max-w-4xl bg-white rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <span className="text-orange-500">{mainMenu.find((m) => m.id === activeMenu)?.icon}</span>
              {mainMenu.find((m) => m.id === activeMenu)?.label}
            </h3>
          </div>
          {activeMenu === 'personal' && renderMainTabContent(activeMenu)}
          {activeMenu !== 'personal' && (
            <form onSubmit={handleSubmit}>
              {renderMainTabContent(activeMenu)}
              <button type="submit" className="mt-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
                Save
              </button>
            </form>
          )}
          {/* SubTab Content */}
          {activeSubTab && activeMenu === 'personal' && (
            <div className="mt-4">
              <form onSubmit={handleSubmit}>
                {renderSubTabContent(activeSubTab)}
                <button type="submit" className="mt-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
                  Save
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyProfile;