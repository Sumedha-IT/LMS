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

const API_URL = import.meta.env.VITE_API_URL;

// Update mainMenu array
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
    ],
  },
  { id: 'education', label: 'Education', icon: <MdSchool /> },
  { id: 'projects', label: 'Projects', icon: <MdBuild /> },
  { id: 'certifications', label: 'Certifications', icon: <MdStar /> },
  { id: 'achievements', label: 'Achievements', icon: <MdStar /> },
  { id: 'social', label: 'Social Links', icon: <MdLink /> },
];

// Update styles
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

  // Add error and success states
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState(null);
  // Add these two state variables at the top level
  const [degreeTypes, setDegreeTypes] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [showOtherSpecialization, setShowOtherSpecialization] = useState(false);
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

  // Update your useEffect to use loading state
  useEffect(() => {
    setLoading(true);
    const userInfo = getCookie("user_info");
    let userData;

      try {
        userData = userInfo ? JSON.parse(userInfo) : null;
        if (!userData?.token) {
          toast.error('Authentication required');
          setLoading(false);
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
          
          // Use education data directly if available, otherwise map from qualification
          const educationData = response.data.user.education || [];
          
          setFormData((prev) => ({
            ...prev,
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
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  const toggleMenu = (id) => {
    // Only change the active menu, don't trigger success messages
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
        console.log('Updated tempFormData:', newData);
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

      // Preview for image files
      if ((name === 'avatar_url' || name === 'passport_photo') && file.type.startsWith('image/')) {
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
        key === 'education'
          ? [...prev[key], {
              degree_type_id: '',
              specialization_id: '',
              other_specialization: '',
              percentage_cgpa: '',
              institute_name: '',
              location: '',
              duration_from: '',
              duration_to: ''
            }]
          : key === 'qualification'
            ? [...prev[key], { qualification_id: '', year: '', institute_name: '', percentage: '' }]
            : key === 'work_experience'
            ? [...prev[key], { company: '', role: '', start_date: '', end_date: '', description: '' }]
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
    try {
      if (!formData[key] || !Array.isArray(formData[key])) {
        console.error(`Invalid key or array: ${key}`);
        return;
      }
      
      const updatedItems = [...formData[key]];
      if (!updatedItems[index]) {
        console.error(`Invalid index: ${index}`);
        return;
      }
      
      updatedItems[index][field] = value;
      setFormData((prev) => ({ ...prev, [key]: updatedItems }));
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('Failed to update field');
    }
  };

   

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const userInfo = getCookie("user_info");
      const userData = userInfo ? JSON.parse(userInfo) : null;
      
      if (!userData?.token) {
        toast.error('User authentication required');
        return;
      }

      // Create FormData object
      const formDataToSend = new FormData();
      
      // Handle file uploads first with proper error handling
      const fileFields = ['avatar_url', 'upload_resume', 'upload_aadhar', 'passport_photo'];
      fileFields.forEach(field => {
        if (formData[field] instanceof File) {
          formDataToSend.append(field, formData[field]);
        }
      });

      // Clean and validate data before sending
      const jsonData = {
        name: formData.name?.trim(),
        email: formData.email?.trim().toLowerCase(),
        gender: formData.gender,
        birthday: formData.birthday,
        address: formData.address?.trim(),
        city: formData.city?.trim(),
        state_id: formData.state_id,
        pincode: formData.pincode?.trim(),
        aadhaar_number: formData.aadhaar_number?.trim(),
        linkedin_profile: formData.linkedin_profile?.trim(),
        parent_name: formData.parent_name?.trim(),
        parent_email: formData.parent_email?.trim()?.toLowerCase(),
        parent_aadhar: formData.parent_aadhar?.trim(),
        parent_occupation: formData.parent_occupation?.trim(),
        residential_address: formData.residential_address?.trim(),
        receive_email_notification: Boolean(formData.receive_email_notification),
        receive_sms_notification: Boolean(formData.receive_sms_notification),
        qualification: Array.isArray(formData.qualification) ? formData.qualification : [],
        work_experience: Array.isArray(formData.work_experience) ? formData.work_experience : [],
        education: Array.isArray(formData.education) ? formData.education : [],
        projects: Array.isArray(formData.projects) ? formData.projects : [],
        certifications: Array.isArray(formData.certifications) ? formData.certifications : [],
        achievements: Array.isArray(formData.achievements) ? formData.achievements : []
      };

      // Log data before sending
      console.log('Sending data:', { jsonData, files: Object.fromEntries(formDataToSend.entries()) });

      formDataToSend.append('data', JSON.stringify(jsonData));

      const response = await axios.post(`${API_URL}/api/profile`, formDataToSend, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${userData.token}`,
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      if (response.data.success) {
        setSuccess('Profile updated successfully!');
        toast.success('Profile updated successfully!');
        if (response.data.user) {
          // If the passport photo was saved successfully, update it in the state
          if (formData.passport_photo instanceof File && response.data.user.passport_photo_path) {
            const updatedUser = {
              ...response.data.user,
              passport_photo: null // Clear the File object since we now have the path
            };
            setFormData(prev => ({
              ...prev,
              ...updatedUser
            }));
          } else {
            const updatedUser = { ...response.data.user };
            // Handle avatar
            if (formData.avatar_url instanceof File && response.data.user.avatar_url) {
              // Update the photoPreview with the new avatar URL
              setPhotoPreview(getDocumentUrl(response.data.user.avatar_url));
              updatedUser.avatar_url = null; // Clear the File object since we now have the URL
            }
            setFormData(prev => ({
              ...prev,
              ...updatedUser
            }));
          }
        }
      } else {
        throw new Error(response.data.message || 'Update failed');
      }

    } catch (error) {
      console.error('Profile update error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setError(error.response?.data?.message || 'Failed to update profile');
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Add a helper function to standardize date format
  const formatDateForServer = (dateString) => {
    if (!dateString) return '';
    
    // If already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    
    // If in DD/MM/YYYY format, convert to YYYY-MM-DD
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
      const [day, month, year] = dateString.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    
    // Try to create a Date object and format it
    try {
      const dateObj = new Date(dateString);
      if (isNaN(dateObj.getTime())) {
        console.warn('Invalid date:', dateString);
        return ''; // Invalid date
      }
      
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error('Error formatting date:', error, dateString);
      return '';
    }
  };

  const handleSaveCertification = async (cert, index) => {
    try {
      // Validate required fields
      if (!cert.certification_name || !cert.authority || !cert.certification_date || !cert.certificate_number) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Validate score
      const score = parseFloat(cert.score);
      if (isNaN(score) || score < 0 || score > 100) {
        toast.error('Score must be a number between 0 and 100');
        return;
      }

      setLoading(true);
      const userInfo = getCookie("user_info");
      const userData = userInfo ? JSON.parse(userInfo) : null;
      
      if (!userData?.token) {
        toast.error('Authentication required');
        return;
      }

      const formData = new FormData();
      formData.append('certification_name', cert.certification_name);
      formData.append('authority', cert.authority);
      
      // Format the date correctly to YYYY-MM-DD before sending to the server
      const formattedDate = formatDateForServer(cert.certification_date);
      console.log('Original date:', cert.certification_date);
      console.log('Formatted date for server:', formattedDate);
      
      formData.append('certification_date', formattedDate);
      
      formData.append('score', score.toString());
      formData.append('certificate_number', cert.certificate_number);
      
      if (cert.certificate_file) {
        formData.append('certificate_file', cert.certificate_file);
      }

      const url = cert.id 
        ? `${API_URL}/api/certifications/${cert.id}`
        : `${API_URL}/api/certifications`;
      
      const method = cert.id ? 'put' : 'post';

      // Debug: Log all data being sent to the server
      console.log('=== Certification Save Debug ===');
      console.log('URL:', url);
      console.log('Method:', method);
      console.log('Certification ID:', cert.id);
      console.log('Data being sent:');
      console.log('- certification_name:', cert.certification_name);
      console.log('- authority:', cert.authority);
      console.log('- certification_date:', formattedDate);
      console.log('- score:', score.toString());
      console.log('- certificate_number:', cert.certificate_number);
      console.log('- has certificate_file:', !!cert.certificate_file);
      console.log('================================');

      // For PUT requests, we need to use the _method parameter for Laravel
      if (method === 'put') {
        formData.append('_method', 'PUT');
      }

      // Log FormData contents for debugging
      console.log('Form data entries:');
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await axios({
        method: method === 'put' ? 'post' : method, // Always use POST for file uploads with _method
        url,
        data: formData,
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${userData.token}`,
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response.data) {
        toast.success(cert.id ? 'Certification updated successfully' : 'Certification added successfully');
        
        // Update the certifications list with the response data
        setFormData(prev => {
          const updatedCertifications = [...prev.certifications];
          updatedCertifications[index] = response.data.data;
          return {
            ...prev,
            certifications: updatedCertifications
          };
        });
        
        // Keep the certifications tab open
        // Do not modify activeMenu state
      }
    } catch (error) {
      console.error('Error saving certification:', error);
      
      // Log more detailed error information
      if (error.response) {
        console.error('Server error response:', error.response.data);
        console.error('Status code:', error.response.status);
        
        // Check if there are validation errors
        if (error.response.data && error.response.data.errors) {
          console.error('Validation errors:', error.response.data.errors);
          
          // Display the first validation error message
          const firstError = Object.values(error.response.data.errors)[0];
          toast.error(firstError[0] || 'Failed to save certification');
        } else {
          toast.error(error.response.data.message || 'Failed to save certification');
        }
      } else {
        toast.error('Failed to save certification');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderSubTabContent = () => {
    console.log('Rendering sub tab content for:', activeSubTab);
    console.log('Current form data:', formData);

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
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
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
    
    // Show errors/success but continue showing the form instead of returning early
    const showSuccessMessage = success && (
      <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
        {success}
      </div>
    );
    
    const showErrorMessage = error && (
      <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
        {error}
      </div>
    );

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
            </div>
          </div>
        );
      case 'education':
        return (
          <div>
            {formData.education.map((edu, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Degree Type</label>
                  <select 
                    value={edu.degree_type_id || ''} 
                    onChange={(e) => {
                      console.log('Selected degree type:', e.target.value);
                      handleItemChange('education', index, 'degree_type_id', e.target.value);
                      fetchSpecializations(e.target.value);
                    }} 
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select Degree Type</option>
                    {degreeTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>
                
                {/* Rest of the education form remains unchanged */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                  <select 
                    value={edu.specialization_id || ''} 
                    onChange={(e) => handleItemChange('education', index, 'specialization_id', e.target.value)} 
                    className="w-full p-2 border rounded"
                    disabled={!edu.degree_type_id}
                  >
                    <option value="">Select Specialization</option>
                    {specializations.map(spec => (
                      <option key={spec.id} value={spec.id}>{spec.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Other Specialization</label>
                  <input 
                    type="text" 
                    value={edu.other_specialization || ''} 
                    onChange={(e) => handleItemChange('education', index, 'other_specialization', e.target.value)} 
                    className="w-full p-2 border rounded" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Institute Name</label>
                  <input 
                    type="text" 
                    value={edu.institute_name || ''} 
                    onChange={(e) => handleItemChange('education', index, 'institute_name', e.target.value)} 
                    className="w-full p-2 border rounded" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input 
                    type="text" 
                    value={edu.location || ''} 
                    onChange={(e) => handleItemChange('education', index, 'location', e.target.value)} 
                    className="w-full p-2 border rounded" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration From</label>
                  <input 
                    type="date" 
                    value={edu.duration_from || ''} 
                    onChange={(e) => handleItemChange('education', index, 'duration_from', e.target.value)} 
                    className="w-full p-2 border rounded" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration To</label>
                  <input 
                    type="date" 
                    value={edu.duration_to || ''} 
                    onChange={(e) => handleItemChange('education', index, 'duration_to', e.target.value)} 
                    className="w-full p-2 border rounded" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Percentage/CGPA</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    max="100" 
                    value={edu.percentage_cgpa || ''} 
                    onChange={(e) => handleItemChange('education', index, 'percentage_cgpa', e.target.value)} 
                    className="w-full p-2 border rounded" 
                  />
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
          <div className="space-y-6">
            {showSuccessMessage}
            {showErrorMessage}
            
            <div className="bg-white rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <MdBuild className="text-orange-500" />
                  Projects
                </h2>
                {!showProjectForm && (
                  <button
                    onClick={() => setShowProjectForm(true)}
                    className="flex items-center gap-2 px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    <FiPlus className="w-5 h-5" />
                    Add Project
                  </button>
                )}
              </div>

              {/* Project Form */}
              {showProjectForm && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4">
                    {editingProject ? 'Edit Project' : 'Add New Project'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={projectForm.title}
                        onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
                        className="w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Enter project title"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={projectForm.role}
                        onChange={(e) => setProjectForm({...projectForm, role: e.target.value})}
                        className="w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Your role in the project"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Technologies<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={projectForm.technologies}
                        onChange={(e) => setProjectForm({...projectForm, technologies: e.target.value})}
                        className="w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
                        placeholder="e.g., React, Node.js, MongoDB"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Type<span className="text-red-500">*</span>
                      </label>
                      <select
                        value={projectForm.project_type}
                        onChange={(e) => setProjectForm({...projectForm, project_type: e.target.value})}
                        className="w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
                        required
                      >
                        <option value="">Select Type</option>
                        <option value="Academic">Academic</option>
                        <option value="Personal">Personal</option>
                        <option value="Professional">Professional</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={projectForm.start_date}
                        onChange={(e) => setProjectForm({...projectForm, start_date: e.target.value})}
                        className="w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date
                      </label>
                      <div className="space-y-2">
                        <input
                          type="date"
                          value={projectForm.end_date}
                          onChange={(e) => setProjectForm({...projectForm, end_date: e.target.value})}
                          className="w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
                          disabled={projectForm.is_ongoing}
                        />
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            checked={projectForm.is_ongoing}
                            onChange={(e) => setProjectForm({...projectForm, is_ongoing: e.target.checked})}
                            className="form-checkbox h-4 w-4 text-orange-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">This is an ongoing project</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Team Size
                      </label>
                      <input
                        type="number"
                        value={projectForm.team_size}
                        onChange={(e) => setProjectForm({...projectForm, team_size: e.target.value})}
                        className="w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Number of team members"
                        min="1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Organization
                      </label>
                      <input
                        type="text"
                        value={projectForm.organization}
                        onChange={(e) => setProjectForm({...projectForm, organization: e.target.value})}
                        className="w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Organization name"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description<span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={projectForm.description}
                        onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                        className="w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
                        rows={4}
                        placeholder="Project description"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Key Achievements
                      </label>
                      <textarea
                        value={projectForm.key_achievements}
                        onChange={(e) => setProjectForm({...projectForm, key_achievements: e.target.value})}
                        className="w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
                        rows={3}
                        placeholder="List your key achievements in this project"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project URL
                      </label>
                      <input
                        type="url"
                        value={projectForm.project_url}
                        onChange={(e) => setProjectForm({...projectForm, project_url: e.target.value})}
                        className="w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
                        placeholder="https://"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        GitHub URL
                      </label>
                      <input
                        type="url"
                        value={projectForm.github_url}
                        onChange={(e) => setProjectForm({...projectForm, github_url: e.target.value})}
                        className="w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
                        placeholder="https://github.com/"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setShowProjectForm(false);
                        resetProjectForm();
                      }}
                      className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleProjectSubmit}
                      className="px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      {editingProject ? 'Update Project' : 'Add Project'}
                    </button>
                  </div>
                </div>
              )}

              {/* List of Projects */}
              <div className="space-y-6">
                {projects.map((project) => (
                  <div key={project.id} className="bg-gray-50 rounded-lg p-6 shadow-sm border border-gray-200">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                        <div className="flex items-center gap-2">
                          {deleteConfirmations[project.id] ? (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">Delete this project?</span>
                              <button
                                onClick={() => {
                                  handleDeleteProject(project.id);
                                  hideDeleteConfirmation(project.id);
                                }}
                                className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600 text-sm"
                              >
                                Yes
                              </button>
                              <button
                                onClick={() => hideDeleteConfirmation(project.id)}
                                className="px-3 py-1 text-gray-600 bg-gray-100 rounded hover:bg-gray-200 text-sm"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  setEditingProject(project);
                                  setProjectForm(project);
                                  setShowProjectForm(true);
                                }}
                                className="p-1.5 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                title="Edit Project"
                              >
                                <FiEdit2 size={18} />
                              </button>
                              <button
                                onClick={() => showDeleteConfirmation(project.id)}
                                className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                title="Delete Project"
                              >
                                <FiTrash2 size={18} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Role</p>
                          <p className="text-gray-900">{project.role}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Project Type</p>
                          <p className="text-gray-900">{project.project_type}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Technologies</p>
                          <p className="text-gray-900">{project.technologies}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Team Size</p>
                          <p className="text-gray-900">{project.team_size || 'Not specified'}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-500">Duration</p>
                        <p className="text-gray-900">
                          {project.start_date} - {project.is_ongoing ? 'Present' : project.end_date}
                        </p>
                      </div>

                      {project.organization && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Organization</p>
                          <p className="text-gray-900">{project.organization}</p>
                        </div>
                      )}

                      <div>
                        <p className="text-sm font-medium text-gray-500">Description</p>
                        <p className="text-gray-900 whitespace-pre-wrap">{project.description}</p>
                      </div>

                      {project.key_achievements && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Key Achievements</p>
                          <p className="text-gray-900 whitespace-pre-wrap">{project.key_achievements}</p>
                        </div>
                      )}

                      <div className="flex gap-4">
                        {project.project_url && (
                          <a
                            href={project.project_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-500 hover:text-orange-600 flex items-center gap-1"
                          >
                            <FiExternalLink /> Project Link
                          </a>
                        )}
                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-500 hover:text-orange-600 flex items-center gap-1"
                          >
                            <FiExternalLink /> GitHub
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
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
      <div className="profile-header">
        <div
          className="profile-header-bg"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80')`
          }}
        >
          <button className="profile-edit-button">
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

          {/* Add ResumeModal */}
          <ResumeModal
            show={showResumeModal}
            onClose={() => setShowResumeModal(false)}
            onSelect={setSelectedTemplate}
            selectedTemplate={selectedTemplate}
          />

          
          
          
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {mainMenu.filter(menu => menu.id !== 'resume').map((menu) => (
              <button
                key={menu.id}
                onClick={() => toggleMenu(menu.id)}
                className={`main-menu-item ${
                  activeMenu === menu.id 
                    ? 'main-menu-item-active' 
                    : 'main-menu-item-inactive'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`main-menu-icon ${
                    activeMenu === menu.id ? 'text-white' : ''
                  }`}>
                    {menu.icon}
                  </span>
                  <span className="font-medium text-gray-700">{menu.label}</span>
                </div>
                <span className={`main-menu-arrow ${
                  activeMenu === menu.id ? 'opacity-100' : ''
                }`}>
                  {activeMenu === menu.id ? '↓' : '→'}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      
      {activeMenu && (
        <div className="form-container mx-4 md:mx-auto md:max-w-4xl">
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
