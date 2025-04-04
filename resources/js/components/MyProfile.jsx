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
import './MyProfile.css';

// Update API_URL constant
const API_URL = 'http://localhost:8000';

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
    passport_photo: null,
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
  const [deleteConfirmations, setDeleteConfirmations] = useState({});
  const [tempFormData, setTempFormData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
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

        // Fetch certifications if certifications tab is active
        if (activeMenu === 'certifications') {
          const certificationsResponse = await axios.get(`${API_URL}/api/certifications`, {
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${userData.token}`,
            }
          });

          if (certificationsResponse.data) {
            console.log('Fetched certifications:', certificationsResponse.data);
            setFormData(prev => ({
              ...prev,
              certifications: certificationsResponse.data.data || []
            }));
          }
        }

        // Fetch profile data for other tabs
        if (activeMenu !== 'certifications') {
          const profileResponse = await axios.get(`${API_URL}/api/profile`, {
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${userData.token}`,
            },
            withCredentials: true,
          });

          setFormData(prev => ({
            ...prev,
            ...profileResponse.data.user,
          }));
        }

        // If on education tab, fetch education data and degree types
        if (activeMenu === 'education') {
          const [educationResponse, degreeResponse] = await Promise.all([
            axios.get(`${API_URL}/api/get/education`, {
              headers: {
                'Accept': 'application/json',
                'Authorization': userData.token,
              },
              withCredentials: true,
            }),
            axios.get(`${API_URL}/api/get/degrees`, {
              headers: {
                'Accept': 'application/json',
                'Authorization': userData.token,
              },
            })
          ]);

          setDegreeTypes(degreeResponse.data.data || []);
          
          // For each education entry, fetch its specializations if it's not school education
          const educationData = educationResponse.data.data || [];
          for (const edu of educationData) {
            const degreeTypeId = edu.degree_type_id || (edu.degree_type && edu.degree_type.id);
            const isSchoolEducation = ['1', '2', 1, 2].includes(Number(degreeTypeId));
            
            if (degreeTypeId && !isSchoolEducation) {
              const specResponse = await axios.get(`${API_URL}/api/get/specialization/${degreeTypeId}`, {
                headers: {
                  'Accept': 'application/json',
                  'Authorization': userData.token,
                },
              });
              setSpecializations(prev => {
                const newSpecs = specResponse.data.data || [];
                // Remove duplicates by id
                const uniqueSpecs = [...prev];
                newSpecs.forEach(spec => {
                  if (!uniqueSpecs.find(s => s.id === spec.id)) {
                    uniqueSpecs.push(spec);
                  }
                });
                return uniqueSpecs;
              });
            }
          }

          setFormData(prev => ({
            ...prev,
            education: educationData,
          }));
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error(error.response?.data?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeMenu]);

  // Update the fetchSpecializations function to use the same token handling:
  const fetchSpecializations = async (degreeTypeId) => {
    if (!degreeTypeId) return;
    
    try {
      const userInfo = getCookie("user_info");
      const userData = userInfo ? JSON.parse(userInfo) : null;
      
      if (!userData?.token) {
        console.error('No auth token available');
        toast.error('Authentication required');
        return;
      }
      
      const response = await axios.get(`${API_URL}/api/get/specialization/${degreeTypeId}`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': userData.token,
        },
        withCredentials: true,
      });
      
      setSpecializations(response.data.data || []);
    } catch (error) {
      console.error('Error fetching specializations:', error);
      toast.error('Failed to load specializations');
    }
  };

  const fetchEducationData = async () => {
    try {
      const userInfo = getCookie("user_info");
      const userData = userInfo ? JSON.parse(userInfo) : null;

      if (!userData?.token) {
        console.error('No auth token available');
        toast.error('Authentication required. Please log in again.');
        return;
      }

      const response = await axios.get(`${API_URL}/api/get/education`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${userData.token}`, // Ensure Bearer prefix is added
        },
        withCredentials: true,
      });

      console.log('Fetched education data:', response.data);

      setFormData((prev) => ({
        ...prev,
        education: response.data.data || [],
      }));
    } catch (error) {
      console.error('Error fetching education data:', error);
      toast.error(error.response?.data?.message || 'Failed to load education data');
    }
  };

  const validateEducationData = (data) => {
    const errors = [];
    if (!data.degree_type_id) errors.push('Degree type is required');
    if (!data.institute_name) errors.push('Institute name is required');
    if (!data.duration_from) errors.push('Start date is required');
    if (!data.duration_to) errors.push('End date is required');
    if (!data.percentage_cgpa) errors.push('Percentage/CGPA is required');
    if (data.percentage_cgpa && (isNaN(data.percentage_cgpa) || data.percentage_cgpa < 0 || data.percentage_cgpa > 100)) {
      errors.push('Percentage/CGPA must be a number between 0 and 100');
    }
    return errors;
  };

  const handleItemChange = (field, index, key, value) => {
    try {
      console.log('handleItemChange called with:', { field, index, key, value });
      
      setFormData(prev => {
        const updatedData = { ...prev };
        if (!updatedData[field]) {
          updatedData[field] = [];
        }
        if (!updatedData[field][index]) {
          updatedData[field][index] = {};
        }

        // Validate and transform input based on field type
        let transformedValue = value;
        
        if (field === 'certifications') {
          console.log('Processing certification field change:', { key, value });
          switch(key) {
            case 'score':
              const numValue = parseFloat(value);
              if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
                transformedValue = numValue.toString();
              } else {
                toast.error('Score must be between 0 and 100');
                return updatedData;
              }
              break;
            case 'certification_date':
              // Convert YYYY-MM-DD to DD/MM/YYYY when the date is selected
              if (value) {
                const [year, month, day] = value.split('-');
                if (year && month && day) {
                  transformedValue = `${day}/${month}/${year}`;
                } else {
                  transformedValue = value;
                }
              }
              break;
            default:
              transformedValue = value.trim();
          }
        }

        updatedData[field][index][key] = transformedValue;
        console.log('Updated certification data:', updatedData[field][index]);
        return updatedData;
      });
    } catch (error) {
      console.error('Error in handleItemChange:', error);
      toast.error('Failed to update field');
    }
  };

  const handleSaveEducation = (edu, index) => {
    console.log('Saving education data:', edu);
    
    // Check if all required fields are present
    const requiredFields = {
      degree_type_id: edu.degree_type_id || edu.degree_type?.id,
      institute_name: edu.institute_name,
      duration_from: edu.duration_from,
      duration_to: edu.duration_to,
      percentage_cgpa: edu.percentage_cgpa,
      location: edu.location
    };

    console.log('Checking required fields:', requiredFields);

    // Check if all required fields have values
    const hasAllRequired = Object.values(requiredFields).every(val => val !== undefined && val !== null && val !== '');
    
    if (hasAllRequired) {
      console.log('All required fields present, preparing data');
      const educationData = {
        id: edu.id, // This will be undefined for new records
        degree_type_id: edu.degree_type_id || edu.degree_type?.id,
        specialization_id: edu.specialization_id || edu.specialization?.id || null,
        other_specialization: edu.other_specialization || null,
        percentage_cgpa: parseFloat(edu.percentage_cgpa),
        institute_name: edu.institute_name.trim(),
        location: edu.location.trim(),
        duration_from: edu.duration_from,
        duration_to: edu.duration_to
      };
      
      console.log('Triggering save with data:', educationData);
      if (edu.id) {
        // If we have an ID, it's an update
        updateEducation(educationData);
      } else {
        // If no ID, it's a new record
        createEducation(educationData);
      }
    } else {
      const missingFields = Object.entries(requiredFields)
        .filter(([_, value]) => !value)
        .map(([key]) => key);
      console.log('Missing required fields:', missingFields);
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
    }
  };

  const createEducation = async (educationData) => {
    try {
      console.log('Creating new education record:', educationData);
      
      const userInfo = getCookie("user_info");
      const userData = userInfo ? JSON.parse(userInfo) : null;
      
      if (!userData?.token) {
        console.error('No auth token found');
        toast.error('Authentication required');
        return;
      }

      setLoading(true);
      
      const response = await axios({
        method: 'post',
        url: `${API_URL}/api/education`,
        data: educationData,
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${userData.token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      console.log('API Response:', response.data);

      if (response.data) {
        toast.success('Education added successfully');
        
        // Fetch fresh data to ensure we have the latest state
        console.log('Fetching fresh education data...');
        await fetchEducationData();
        console.log('Fresh education data fetched');
      }
    } catch (error) {
      console.error('Error creating education:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add education';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateEducation = async (educationData) => {
    try {
      console.log('Updating education record:', educationData);
      
      const userInfo = getCookie("user_info");
      const userData = userInfo ? JSON.parse(userInfo) : null;
      
      if (!userData?.token) {
        console.error('No auth token found');
        toast.error('Authentication required');
        return;
      }

      setLoading(true);
      
      const response = await axios({
        method: 'put',
        url: `${API_URL}/api/update/education`,
        data: educationData,
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${userData.token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      console.log('API Response:', response.data);

      if (response.data) {
        toast.success('Education updated successfully');
        
        // Fetch fresh data to ensure we have the latest state
        console.log('Fetching fresh education data...');
        await fetchEducationData();
        console.log('Fresh education data fetched');
      }
    } catch (error) {
      console.error('Error updating education:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update education';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleMenu = (id) => {
    setActiveMenu(activeMenu === id ? null : id);
    // Set basic as default sub-tab when personal details is clicked
    if (id === 'personal') {
      setActiveSubTab('basic');
    } else {
      setActiveSubTab(null);
    }
  };

  const toggleSubTab = (id) => {
    console.log('Toggling sub tab:', id);
    setActiveSubTab(activeSubTab === id ? null : id);
    setSuccess(null);
    setError(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log(`Field changed: ${name} = ${value}`);

    setTempFormData((prev) => {
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
      
      // Add file size validation for passport photo
      if (name === 'passport_photo' && file.size > 1024 * 1024) { // 1MB limit
        toast.error('Passport photo must be less than 1MB');
        return;
      }

      setFormData(prev => ({
        ...prev,
        [name]: file
      }));

      // Preview for image files
      if ((name === 'avatar_url' || name === 'passport_photo') && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (name === 'avatar_url') {
            setPhotoPreview(e.target.result);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleRemoveFile = (fieldName) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: null
    }));
  };

  const handleAddItem = (section) => {
    setFormData(prev => {
      switch (section) {
        case 'certifications':
          return {
            ...prev,
            certifications: [
              ...prev.certifications,
              {
                certification_name: '',
                authority: '',
                certification_date: '',
                score: '',
                certificate_number: '',
                certificate_file: null,
                path: null
              }
            ]
          };
        // ... other cases ...
      }
    });
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
      const fileFields = ['avatar_url', 'upload_resume', 'upload_aadhar'];
      fileFields.forEach(field => {
        if (formData[field] instanceof File) {
          formDataToSend.append(field, formData[field]);
        }
      });
  
      // Clean and validate data before sending
      const jsonData = {
        name: formData.name?.trim(),
        email: formData.email?.trim().toLowerCase(),
        gender: formData.gender || null,
        birthday: formData.birthday || null,
        address: formData.address?.trim() || null,
        city: formData.city?.trim() || null,
        state_id: formData.state_id || null,
        pincode: formData.pincode?.trim() || null,
        aadhaar_number: formData.aadhaar_number?.trim() || null,
        linkedin_profile: formData.linkedin_profile?.trim() || null,
        parent_name: formData.parent_name?.trim() || null,
        parent_email: formData.parent_email?.trim()?.toLowerCase() || null,
        parent_aadhar: formData.parent_aadhar?.trim() || null,
        parent_occupation: formData.parent_occupation?.trim() || null,
        residential_address: formData.residential_address?.trim() || null,
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
          'Authorization': `Bearer ${userData.token}`, // Added Bearer prefix
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
  
      if (response.data.success) {
        toast.success('Profile updated successfully!');
        if (response.data.user) {
          setFormData(prev => ({
            ...prev,
            ...response.data.user
          }));
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
      toast.error(error.response?.data?.message || 'Failed to update profile');
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
              <input
                type="text"
                name="name"
                value={tempFormData.name || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={tempFormData.email || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
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
          <div>
            {/* Browser-like tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px space-x-8">
                {mainMenu.find((menu) => menu.id === 'personal').subMenu.map((subTab) => (
                  <button
                    key={subTab.id}
                    onClick={() => toggleSubTab(subTab.id)}
                    className={`
                      py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2
                      ${activeSubTab === subTab.id 
                        ? 'border-orange-500 text-orange-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                    `}
                  >
                    <span className={activeSubTab === subTab.id ? 'text-orange-500' : 'text-gray-500'}>
                      {subTab.icon}
                    </span>
                    {subTab.label}
                  </button>
                ))}
              </nav>
            </div>
            
            {/* Show sub-tab content below the tabs */}
            <div className="mt-6">
              {renderSubTabContent()}
              <div className="mt-6 flex justify-end">
                <button 
                  type="submit" 
                  className="form-submit-button"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        );
      case 'work':
        return <div className="grid grid-cols-1 gap-4"><p>No work experience data available in API</p></div>;
      case 'education':
        return (
          <div className="space-y-6">
            {formData.education.map((edu, index) => {
              // Check for both string and number types since API might return either
              const degreeTypeId = edu.degree_type_id || (edu.degree_type && edu.degree_type.id);
              const isSchoolEducation = ['1', '2', 1, 2].includes(degreeTypeId);
              
              return (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-white">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Degree Type</label>
                    <select 
                      value={degreeTypeId || ''} 
                      onChange={(e) => {
                        handleItemChange('education', index, 'degree_type_id', e.target.value);
                        // Only fetch specializations for higher education
                        const newDegreeId = e.target.value;
                        const isNewSchoolEducation = ['1', '2', 1, 2].includes(Number(newDegreeId));
                        if (!isNewSchoolEducation) {
                          fetchSpecializations(newDegreeId);
                        } else {
                          // Clear specialization fields for school education
                          handleItemChange('education', index, 'specialization_id', '');
                          handleItemChange('education', index, 'other_specialization', '');
                        }
                      }} 
                      className="w-full p-2 border rounded"
                      required
                    >
                      <option value="">Select Degree Type</option>
                      {degreeTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Only show specialization fields for non-school education */}
                  {!isSchoolEducation && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                        <select 
                          value={edu.specialization_id || (edu.specialization && edu.specialization.id) || ''} 
                          onChange={(e) => {
                            handleItemChange('education', index, 'specialization_id', e.target.value);
                            // Show other specialization input if "Other" (ID: 75 or 76) is selected
                            setShowOtherSpecialization(e.target.value === '75' || e.target.value === '76');
                          }} 
                          className="w-full p-2 border rounded"
                        >
                          <option value="">Select Specialization</option>
                          {specializations.map(spec => (
                            <option key={spec.id} value={spec.id}>{spec.name}</option>
                          ))}
                        </select>
                      </div>

                      {showOtherSpecialization && (
                        <div className="mt-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Other Specialization</label>
                          <input 
                            type="text" 
                            value={edu.other_specialization || ''} 
                            onChange={(e) => handleItemChange('education', index, 'other_specialization', e.target.value)} 
                            className="w-full p-2 border rounded"
                            placeholder="Enter your specialization"
                          />
                        </div>
                      )}
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Institute Name</label>
                    <input 
                      type="text" 
                      value={edu.institute_name || ''} 
                      onChange={(e) => handleItemChange('education', index, 'institute_name', e.target.value)} 
                      className="w-full p-2 border rounded"
                      required 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input 
                      type="text" 
                      value={edu.location || ''} 
                      onChange={(e) => handleItemChange('education', index, 'location', e.target.value)} 
                      className="w-full p-2 border rounded"
                      required 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration From</label>
                    <input 
                      type="date" 
                      value={edu.duration_from || ''} 
                      onChange={(e) => handleItemChange('education', index, 'duration_from', e.target.value)} 
                      className="w-full p-2 border rounded"
                      required 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration To</label>
                    <input 
                      type="date" 
                      value={edu.duration_to || ''} 
                      onChange={(e) => handleItemChange('education', index, 'duration_to', e.target.value)} 
                      className="w-full p-2 border rounded"
                      required 
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
                      required 
                    />
                  </div>

                  <div className="md:col-span-2 flex justify-end mt-4">
                    <button 
                      type="button"
                      onClick={() => handleSaveEducation(edu, index)}
                      className="form-submit-button"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Education'}
                    </button>
                  </div>
                </div>
              );
            })}
            
            <div className="flex justify-between items-center mt-4">
              <button 
                type="button" 
                onClick={() => handleAddItem('education')} 
                className="flex items-center gap-1 text-orange-500"
              >
                <FiEdit className="w-4 h-4" />
                <span>Add Education</span>
              </button>
            </div>
          </div>
        );
      case 'projects':
        return <div className="grid grid-cols-1 gap-4"><p>No projects data available in API</p></div>;
      case 'certifications':
        return (
          <div className="space-y-6">
            {formData.certifications.map((cert, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Row */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Certification Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="certification_name"
                      value={cert.certification_name || ''}
                      onChange={(e) => handleItemChange('certifications', index, 'certification_name', e.target.value)}
                      className="w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Enter certification name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Certificate Issue Authority<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="authority"
                      value={cert.authority || ''}
                      onChange={(e) => handleItemChange('certifications', index, 'authority', e.target.value)}
                      className="w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Enter issuing authority"
                      required
                    />
                  </div>

                  {/* Second Row */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Certificate/Registration Number<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="certificate_number"
                      value={cert.certificate_number || ''}
                      onChange={(e) => handleItemChange('certifications', index, 'certificate_number', e.target.value)}
                      className="w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Enter certificate number"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Score/Percentage/CGPA<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      name="score"
                      value={cert.score || ''}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (!isNaN(value) && value >= 0 && value <= 100) {
                          handleItemChange('certifications', index, 'score', value.toString());
                        }
                      }}
                      className="w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Enter score (0-100)"
                      required
                    />
                  </div>

                  {/* Third Row */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Certification Date<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="certification_date"
                      value={cert.certification_date || ''}
                      onChange={(e) => handleItemChange('certifications', index, 'certification_date', e.target.value)}
                      className="w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Certificate
                    </label>
                    <div className="flex items-center space-x-4">
                      <label className="cursor-pointer bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                        <input
                          type="file"
                          onChange={(e) => handleCertificateUpload(index, e)}
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                        Choose File
                      </label>
                      {cert.path && (
                        <a
                          href={cert.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-500 hover:text-orange-600"
                        >
                          View Certificate
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 mt-6">
                  {deleteConfirmations[index] ? (
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-700">Are you sure you want to delete this certification?</span>
                      <button
                        type="button"
                        onClick={() => {
                          handleDeleteCertification(index);
                          hideDeleteConfirmation(index);
                        }}
                        className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        onClick={() => hideDeleteConfirmation(index)}
                        className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => showDeleteConfirmation(index)}
                        className="px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveCertification(cert, index)}
                        className="px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
                      >
                        Save
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}

            {/* Add New Button */}
            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={() => handleAddItem('certifications')}
                className="flex items-center gap-2 px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Certification
              </button>
            </div>
          </div>
        );
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
              className="form-submit-button"
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

  const handleCertificateUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => {
        const updatedCertifications = [...prev.certifications];
        updatedCertifications[index] = {
          ...updatedCertifications[index],
          certificate_file: file,
          path: URL.createObjectURL(file)
        };
        return {
          ...prev,
          certifications: updatedCertifications
        };
      });
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
      formData.append('certification_date', cert.certification_date); // Use the date as is since it's already formatted
      formData.append('score', score.toString());
      formData.append('certificate_number', cert.certificate_number);
      
      if (cert.certificate_file) {
        formData.append('certificate_file', cert.certificate_file);
      }

      const url = cert.id 
        ? `${API_URL}/api/certifications/${cert.id}`
        : `${API_URL}/api/certifications`;
      
      const method = cert.id ? 'put' : 'post';

      const response = await axios({
        method,
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
      }
    } catch (error) {
      console.error('Error saving certification:', error);
      toast.error(error.response?.data?.message || 'Failed to save certification');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCertification = async (index) => {
    try {
      const cert = formData.certifications[index];
      if (!cert.id) {
        // If it's a new unsaved certification, just remove it from the state
        setFormData(prev => {
          const updatedCertifications = prev.certifications.filter((_, i) => i !== index);
          return {
            ...prev,
            certifications: updatedCertifications
          };
        });
        return;
      }

      const userInfo = getCookie("user_info");
      const userData = userInfo ? JSON.parse(userInfo) : null;
      
      if (!userData?.token) {
        toast.error('Authentication required');
        return;
      }

      await axios.delete(`${API_URL}/api/certifications/${cert.id}`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${userData.token}`,
        }
      });

      toast.success('Certification deleted successfully');
      
      // Remove the certification from the state
      setFormData(prev => {
        const updatedCertifications = prev.certifications.filter((_, i) => i !== index);
        return {
          ...prev,
          certifications: updatedCertifications
        };
      });
    } catch (error) {
      console.error('Error deleting certification:', error);
      toast.error(error.response?.data?.message || 'Failed to delete certification');
    }
  };

  const showDeleteConfirmation = (index) => {
    setDeleteConfirmations(prev => ({
      ...prev,
      [index]: true
    }));
  };

  const hideDeleteConfirmation = (index) => {
    setDeleteConfirmations(prev => ({
      ...prev,
      [index]: false
    }));
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
                  className="profile-image"
                />
              ) : (
                <div className="profile-image-placeholder">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
              <label className="profile-image-edit">
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
                <div className="contact-info-item">
                  <div className="contact-icon-container-phone">
                    <MdPhone className="contact-icon-phone" />
                  </div>
                  <span className="text-sm">{formData.country_code || '+91'} {formData.phone || ''}</span>
                </div>
                <div className="contact-info-item">
                  <div className="contact-icon-container-email">
                    <MdEmail className="contact-icon-email" />
                  </div>
                  <span className="text-sm">{formData.email || ''}</span>
                </div>
                <div className="contact-info-item">
                  <div className="contact-icon-container-location">
                    <MdLocationOn className="contact-icon-location" />
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
          {activeMenu === 'education' ? (
            renderMainTabContent(activeMenu)
          ) : (
            <form onSubmit={handleSubmit}>
              {renderMainTabContent(activeMenu)}
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default MyProfile;
