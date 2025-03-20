import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { BsPersonLinesFill } from 'react-icons/bs';
import { MdDescription, MdWork, MdSchool, MdBuild, MdStar, MdLink } from 'react-icons/md';
import { FiEdit } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BsPersonFill, BsBriefcaseFill, BsBookFill, BsAwardFill } from 'react-icons/bs';
import { MdLocationOn, MdEmail, MdPhone } from 'react-icons/md';
import { FiExternalLink } from 'react-icons/fi';

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
  @keyframes textBlink {
    0% { color: #f97316; opacity: 1; }
    50% { color: #f97316; opacity: 0.4; }
    100% { color: #f97316; opacity: 1; }
  }
  .slow-blink {
    animation: slowBlink 2s infinite;
    border-width: 2px;
    border-style: solid;
  }
  .text-blink {
    animation: textBlink 1.5s infinite;
  }
  .active-menu {
    background-color: #f97316;
    color: white;
  }
  .active-menu .text-orange-500 {
    color: white;
  }
  .sub-menu-active {
    border-color: #f97316;
    background-color: #fff7ed;
  }
`;

function getCookie(name) {
  let cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    let [key, value] = cookie.split("=");
    if (key === name) {
      return decodeURIComponent(value);
    }
  }
  return null;
}

const MyProfile = () => {
  const { user, id } = useParams();

  const [activeMenu, setActiveMenu] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar_url: null,
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
    upload_resume: null,
    upload_aadhar: null,
    parent_name: '',
    parent_email: '',
    parent_aadhar: '',
    parent_occupation: '',
    residential_address: '',
    receive_email_notification: false,
    receive_sms_notification: false,
    work_experience: [],
    education: [],
    projects: [],
    certifications: [],
    achievements: [],
    social_links: { linkedin: '', github: '' }
  });
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    const userInfo = getCookie("user_info");
    let userData;
  
    try {
      userData = userInfo ? JSON.parse(userInfo) : null;
      console.log("Parsed user data:", userData);
    } catch (error) {
      console.error("Error parsing user info cookie:", error);
      return;
    }
  
    if (userData && userData.token) {
      const token = userData.token;
  
      axios.get(`${API_URL}/api/profile`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        withCredentials: true,
      })
        .then((response) => {
          console.log("Profile response:", response.data);
          
          // Map qualification data to education format if education is not provided
          const educationData = response.data.user.education || 
            (response.data.user.qualification ? 
              response.data.user.qualification.map(qual => ({
                degree: qual.qualification_name || '',
                institute: qual.institute_name || '',
                start_year: '',
                end_year: qual.year || '',
                percentage: qual.percentage || ''
              })) : []);
          
          setFormData((prev) => ({
            ...prev,
            ...response.data.user,
            qualification: response.data.user.qualification || [],
            work_experience: response.data.user.work_experience || [],
            education: educationData,
            projects: response.data.user.projects || [],
            certifications: response.data.user.certifications || [],
            achievements: response.data.user.achievements || [],
            social_links: response.data.user.social_links || { linkedin: '', github: '' }
          }));
          
          // Fix the image URL handling
          if (response.data.user.avatar_url) {
            // Remove any duplicate URL prefixes
            const avatarPath = response.data.user.avatar_url;
            const fixedPath = avatarPath.startsWith('http') 
              ? avatarPath 
              : `${API_URL}/storage/${avatarPath}`;
            setPhotoPreview(fixedPath);
          } else {
            setPhotoPreview(null);
          }
        })
        .catch((error) => {
          console.error('Error fetching profile:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
          });
        });
    }
  }, []);

  const toggleMenu = (id) => {
    setActiveMenu(activeMenu === id ? null : id);
    setActiveSubTab(null);
  };

  const toggleSubTab = (id) => {
    setActiveSubTab(activeSubTab === id ? null : id);
    setSuccess(null);
    setError(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log(`Field changed: ${name} = ${value}`);
    setFormData((prev) => {
        const newData = {
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        };
        console.log('Updated formData:', newData);
        return newData;
    });
};

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      setFormData(prev => ({
        ...prev,
        [name]: file
      }));
      if (name === 'avatar_url' && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPhotoPreview(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const addItem = (key) => {
    setFormData((prev) => ({
      ...prev,
      [key]:
        key === 'qualification'
          ? [...prev[key], { qualification_id: '', year: '', institute_name: '', percentage: '' }]
          : key === 'work_experience'
          ? [...prev[key], { company: '', role: '', start_date: '', end_date: '', description: '' }]
          : key === 'education'
          ? [...prev[key], { degree: '', institute: '', start_year: '', end_year: '', percentage: '' }]
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
    const userInfo = getCookie("user_info");
    let userData;
  
    try {
      userData = userInfo ? JSON.parse(userInfo) : null;
      if (!userData || !userData.token) {
        toast.error('User authentication required');
        return;
      }
  
      // Create a complete data object for sending
      const dataToSend = {
        name: formData.name,
        email: formData.email,
        gender: formData.gender,
        birthday: formData.birthday,
        address: formData.address,
        city: formData.city,
        state_id: formData.state_id,
        pincode: formData.pincode,
        aadhaar_number: formData.aadhaar_number,
        linkedin_profile: formData.linkedin_profile,
        parent_name: formData.parent_name,
        parent_email: formData.parent_email,
        parent_aadhar: formData.parent_aadhar,
        parent_occupation: formData.parent_occupation,
        residential_address: formData.residential_address,
        receive_email_notification: formData.receive_email_notification,
        receive_sms_notification: formData.receive_sms_notification,
        qualification: formData.qualification,
        work_experience: formData.work_experience,
        education: formData.education,
        projects: formData.projects,
        certifications: formData.certifications,
        achievements: formData.achievements,
        social_links: formData.social_links
      };
  
      console.log('Complete data being sent to backend:', dataToSend);
  
      // Verify the FormData is structured correctly
      const formDataToSend = new FormData();
      const jsonData = {
        // Convert empty strings to null for numeric fields
        state_id: dataToSend.state_id || null,
        pincode: dataToSend.pincode || null,
        aadhaar_number: dataToSend.aadhaar_number || null,
        // Keep other fields as-is
        ...dataToSend
      };
  
      formDataToSend.append('data', JSON.stringify(jsonData));
      // File append calls should use same field names backend expects
      if (formData.avatar_url instanceof File) {
        formDataToSend.append('avatar_url', formData.avatar_url); // Must match backend's hasFile('avatar_url')
      }
      if (formData.upload_resume instanceof File) {
        formDataToSend.append('upload_resume', formData.upload_resume);
      }
      if (formData.upload_aadhar instanceof File) {
        formDataToSend.append('upload_aadhar', formData.upload_aadhar);
      }
  
      // Before sending request
      console.log('FormData entries:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }
      const response = await axios.post(`${API_URL}/api/profile`, formDataToSend, {
        headers: {
          Accept: 'application/json',
          Authorization: userData.token,
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
        withCredentials: true,
      });
  
      console.log('Backend response:', response.data);
  
      if (response.data.message === 'Profile Updated SuccessFully') {
        // Verify the data was actually updated
        const verifyResponse = await axios.get(`${API_URL}/api/profile`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': userData.token,
          },
          withCredentials: true,
        });
  
        console.log('Verification response:', verifyResponse.data);
  
        if (verifyResponse.data.user.name !== dataToSend.name) {
          console.error('Data mismatch after save:', {
            sent: dataToSend.name,
            received: verifyResponse.data.user.name
          });
          toast.warning('Data may not have been saved correctly');
        } else {
          toast.success('Profile updated successfully!');
        }
  
        // Update local state with verified data
        setFormData(prev => ({
          ...prev,
          ...verifyResponse.data.user
        }));
      }
    } catch (error) {
      console.error('Profile update error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      toast.error(error.response?.data?.message || 'Failed to update profile');
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
              <input 
                type="text" 
                name="name" 
                value={formData.name || ''} 
                onChange={handleChange} 
                className="w-full p-2 border rounded" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email || ''} 
                onChange={handleChange} 
                className="w-full p-2 border rounded" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
              <input type="text" name="registration_number" value={formData.registration_number || ''} onChange={handleChange} disabled className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
              <input type="text" value={formData.domain_id || ''} disabled className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country Code</label>
              <select name="country_code" value={formData.country_code || ''} onChange={handleChange} disabled className="w-full p-2 border rounded">
                <option value="+91">+91</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
              <input type="tel" name="phone" value={formData.phone || ''} onChange={handleChange} disabled className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select name="gender" value={formData.gender || ''} onChange={handleChange} className="w-full p-2 border rounded">
              <select name="gender" value={formData.gender || ''} onChange={handleChange} className="w-full p-2 border rounded">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Birthday</label>
              <input type="date" name="birthday" value={formData.birthday || ''} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications</label>
              {formData.qualification.map((qual, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                    <select
                      value={qual.qualification_id || ''}
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
                      value={qual.year || ''}
                      onChange={(e) => handleItemChange('qualification', index, 'year', e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Institute</label>
                    <input
                      type="text"
                      value={qual.institute_name || ''}
                      onChange={(e) => handleItemChange('qualification', index, 'institute_name', e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Percentage</label>
                    <input
                      type="text"
                      value={qual.percentage || ''}
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
              <textarea name="address" value={formData.address || ''} onChange={handleChange} className="w-full p-2 border rounded" rows={4} />
              <textarea name="address" value={formData.address || ''} onChange={handleChange} className="w-full p-2 border rounded" rows={4} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input type="text" name="city" value={formData.city || ''} onChange={handleChange} className="w-full p-2 border rounded" />
              <input type="text" name="city" value={formData.city || ''} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <select name="state_id" value={formData.state_id || ''} onChange={handleChange} className="w-full p-2 border rounded">
                <option value="">Select State</option>
                <option value="1">State 1</option>
                <option value="2">State 2</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
              <input type="text" name="pincode" value={formData.pincode || ''} onChange={handleChange} className="w-full p-2 border rounded" />
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
              <input type="text" name="aadhaar_number" value={formData.aadhaar_number || ''} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn Profile</label>
              <input type="url" name="linkedin_profile" value={formData.linkedin_profile || ''} onChange={handleChange} className="w-full p-2 border rounded" />
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
              <input type="text" name="parent_name" value={formData.parent_name || ''} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parent Email</label>
              <input type="email" name="parent_email" value={formData.parent_email || ''} onChange={handleChange} className="w-full p-2 border rounded" />
              <input type="email" name="parent_email" value={formData.parent_email || ''} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parent Aadhaar</label>
              <input type="text" name="parent_aadhar" value={formData.parent_aadhar || ''} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parent Occupation</label>
              <input type="text" name="parent_occupation" value={formData.parent_occupation || ''} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Residential Address</label>
              <textarea name="residential_address" value={formData.residential_address || ''} onChange={handleChange} className="w-full p-2 border rounded" rows={4} />
            </div>
          </div>
        );
      case 'qualification':
        return (
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center">
              <input type="checkbox" name="receive_email_notification" checked={formData.receive_email_notification || false} onChange={handleChange} className="mr-2" />
              <label className="text-sm font-medium text-gray-700">Receive Email Notification</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" name="receive_sms_notification" checked={formData.receive_sms_notification || false} onChange={handleChange} className="mr-2" />
              <label className="text-sm font-medium text-gray-700">Receive SMS Notification</label>
            </div>
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
                  <span className={`${activeSubTab === subTab.id ? 'text-[#f97316] text-blink' : 'text-orange-500'}`}>{subTab.icon}</span>
                  <span className={activeSubTab === subTab.id ? 'text-[#f97316] text-blink' : ''}>{subTab.label}</span>
                </div>
                {activeSubTab === subTab.id ? <FaChevronUp className="w-4 h-4 text-[#f97316] text-blink" /> : <FaChevronDown className="w-4 h-4" />}
              </div>
            ))}
          </div>
        );
      case 'work':
        return <div className="grid grid-cols-1 gap-4"><p>No work experience data available in API</p></div>;
      case 'education':
        return (
          <div>
            {formData.education.map((edu, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Degree/Qualification</label>
                  <input type="text" value={edu.degree || ''} onChange={(e) => handleItemChange('education', index, 'degree', e.target.value)} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Institute</label>
                  <input type="text" value={edu.institute || ''} onChange={(e) => handleItemChange('education', index, 'institute', e.target.value)} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Year</label>
                  <input type="text" value={edu.start_year || ''} onChange={(e) => handleItemChange('education', index, 'start_year', e.target.value)} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Year/Year of Completion</label>
                  <input type="text" value={edu.end_year || ''} onChange={(e) => handleItemChange('education', index, 'end_year', e.target.value)} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Percentage/CGPA</label>
                  <input type="text" value={edu.percentage || ''} onChange={(e) => handleItemChange('education', index, 'percentage', e.target.value)} className="w-full p-2 border rounded" />
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
    <div className="min-h-screen bg-gray-50">
      <style>{styles}</style>
      <div className="relative h-48">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <button className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
            <FiEdit className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Rest of your profile content remains unchanged */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="relative -mt-24">
          {/* Profile Image and Basic Info */}
          <div className="flex flex-col items-start gap-4">
            <div className="relative">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
              <label className="absolute bottom-0 right-0 bg-orange-500 p-2 rounded-full shadow-lg hover:bg-orange-600 transition-colors cursor-pointer">
                <input 
                  type="file" 
                  name="avatar_url" 
                  onChange={handleFileChange} 
                  className="hidden"
                  accept="image/*"
                />
                <FiEdit className="w-4 h-4 text-white" />
              </label>
            </div>

            <div>
              <h1 className="text-2xl font-bold">{formData.name || 'User Name'}</h1>
              <span className="inline-block mt-1 px-3 py-1 bg-pink-50 text-gray-700 rounded-full text-sm">
                {formData.designation || 'Software Engineer'}
              </span>

              {/* Contact Info */}
              <div className="mt-4 flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="bg-red-100 p-2 rounded-full">
                    <MdPhone className="w-4 h-4 text-red-500" />
                  </div>
                  <span className="text-sm">{formData.country_code || '+91'} {formData.phone || ''}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="bg-orange-100 p-2 rounded-full">
                    <MdEmail className="w-4 h-4 text-orange-500" />
                  </div>
                  <span className="text-sm">{formData.email || ''}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <MdLocationOn className="w-4 h-4 text-blue-500" />
                  </div>
                  <span className="text-sm">{formData.city && formData.state_id ? `${formData.city}, India` : (formData.city || '')}</span>
                </div>
              </div>
            </div>
          </div>

          
          
          
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {mainMenu.map((menu) => (
              <button
                key={menu.id}
                onClick={() => toggleMenu(menu.id)}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  activeMenu === menu.id 
                    ? 'bg-[#f97316] text-white shadow-md' 
                    : 'bg-white border-gray-200 hover:border-orange-500'
                } transition-all`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-orange-500 ${
                    activeMenu === menu.id ? 'text-white' : ''
                  } text-xl group-hover:scale-110 transition-transform`}>
                    {menu.icon}
                  </span>
                  <span className="font-medium text-gray-700">{menu.label}</span>
                </div>
                <span className={`text-orange-500 ${
                  activeMenu === menu.id ? 'opacity-100' : 'opacity-0'
                } group-hover:opacity-100 transition-opacity`}>
                  {activeMenu === menu.id ? '↓' : '→'}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      
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
          {activeSubTab && activeMenu === 'personal' && (
            <div className="mt-4">
              <form onSubmit={handleSubmit}>
                {renderSubTabContent(activeSubTab)}
                
                <button 
                  type="submit" 
                  className="mt-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors"
                >
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