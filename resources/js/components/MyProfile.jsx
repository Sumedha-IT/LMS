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
import { FiExternalLink, FiFile, FiEye } from 'react-icons/fi';
import './MyProfile.css';
import { FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { AiOutlineFilePdf } from 'react-icons/ai';

// Make sure we're using the correct API URL
const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:8000';
// const API_URL = import.meta.env.REACT_APP_API_URL

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
  { id: 'resume', label: 'Export as Resume', icon: <AiOutlineFilePdf /> },
];

// Add this after the mainMenu constant
const calculateCompletionPercentage = (formData, menuId, projects) => {
  switch (menuId) {
    case 'personal':
      const basicFields = ['name', 'email', 'gender', 'birthday'];
      const additionalFields = ['address', 'city', 'state_id', 'pincode'];
      const docsFields = ['aadhaar_number', 'upload_aadhar', 'linkedin_profile', 'passport_photo', 'upload_resume'];
      const parentFields = ['parent_name', 'parent_email', 'parent_aadhar', 'parent_occupation', 'residential_address'];

      const basicComplete = basicFields.filter(field => formData[field]).length;
      const additionalComplete = additionalFields.filter(field => formData[field]).length;
      const docsComplete = docsFields.filter(field => formData[field]).length;
      const parentComplete = parentFields.filter(field => formData[field]).length;

      const totalFields = basicFields.length + additionalFields.length + docsFields.length + parentFields.length;
      const completedFields = basicComplete + additionalComplete + docsComplete + parentComplete;

      return Math.round((completedFields / totalFields) * 100);

    case 'education':
      if (!formData.education || formData.education.length === 0) return 0;

      const requiredEduFields = ['degree_type_id', 'institute_name', 'duration_from', 'duration_to', 'percentage_cgpa', 'location'];
      let totalEduFields = 0;
      let completedEduFields = 0;

      formData.education.forEach(edu => {
        totalEduFields += requiredEduFields.length;
        completedEduFields += requiredEduFields.filter(field => edu[field]).length;
      });

      return Math.round((completedEduFields / totalEduFields) * 100);

    case 'projects':
      // Get projects from the projects state instead of formData
      if (!projects || projects.length === 0) return 0;

      const requiredProjFields = ['title', 'description', 'start_date', 'technologies', 'project_type'];
      let totalProjFields = 0;
      let completedProjFields = 0;

      formData.projects.forEach(proj => {
        totalProjFields += requiredProjFields.length;
        completedProjFields += requiredProjFields.filter(field => proj[field]).length;
      });

      return Math.round((completedProjFields / totalProjFields) * 100);

    case 'certifications':
      if (!formData.certifications || formData.certifications.length === 0) return 0;

      const requiredCertFields = ['certification_name', 'authority', 'certification_date', 'certificate_number'];
      let totalCertFields = 0;
      let completedCertFields = 0;

      formData.certifications.forEach(cert => {
        totalCertFields += requiredCertFields.length;
        completedCertFields += requiredCertFields.filter(field => cert[field]).length;
      });

      return Math.round((completedCertFields / totalCertFields) * 100);

    default:
      return 0;
  }
};

// Add this function after calculateCompletionPercentage
const calculateOverallProgress = (formData, projects) => {
  const sections = ['personal', 'education', 'projects', 'certifications'];
  const weights = {
    personal: 0.4,    // 40% weight for personal details
    education: 0.25,  // 25% weight for education
    projects: 0.2,    // 20% weight for projects
    certifications: 0.15  // 15% weight for certifications
  };

  let weightedSum = 0;
  sections.forEach(section => {
    const sectionPercentage = calculateCompletionPercentage(formData, section, projects);
    weightedSum += (sectionPercentage * weights[section]);
  });

  return Math.round(weightedSum);
};

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
    passport_photo_path: null,
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
  const [projects, setProjects] = useState([]);
  // const [showProjectModal, setShowProjectModal] = useState(false); // Unused, replaced by showProjectForm
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    technologies: '',
    project_url: '',
    start_date: '',
    end_date: '',
    is_ongoing: false,
    key_achievements: '',
    project_type: '',
    client_name: '',
    organization: '',
    project_files: []  // Add new field for project files
  });
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [pdfViewerModal, setPdfViewerModal] = useState({
    isOpen: false,
    fileUrl: '',
    fileName: ''
  });

  useEffect(() => {
    // Fetch basic profile data on component mount
    const fetchBasicProfileData = async () => {
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

        // Fetch basic profile data and projects in parallel
        // Make sure we're using absolute URLs with the correct base
        const [profileResponse, projectsResponse] = await Promise.all([
          axios.get(`${API_ENDPOINT}/profile`, {
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${userData.token}`,
            },
            withCredentials: true,
            baseURL: API_URL, // Ensure the base URL is set correctly
          }),
          axios.get(`${API_ENDPOINT}/projects`, {
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${userData.token}`,
            },
            baseURL: API_URL, // Ensure the base URL is set correctly
          })
        ]);

        setFormData(prev => ({
          ...prev,
          ...profileResponse.data.user,
        }));

        if (projectsResponse.data.success) {
          setProjects(projectsResponse.data.projects);
          setFormData(prev => ({
            ...prev,
            projects: projectsResponse.data.projects
          }));
        }
      } catch (error) {
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchBasicProfileData();
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    const fetchMenuData = async () => {
      if (!activeMenu) return; // Don't fetch if no active menu

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

        // Fetch tab-specific data
        if (activeMenu === 'certifications') {
          const certificationsResponse = await axios.get(`${API_ENDPOINT}/certifications`, {
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${userData.token}`,
            },
            baseURL: API_URL // Ensure the base URL is set correctly
          });

          if (certificationsResponse.data) {
            setFormData(prev => ({
              ...prev,
              certifications: certificationsResponse.data.data.map(cert => ({
                ...cert,
                certification_date: cert.certification_date ? formatDateForServer(cert.certification_date) : ''
              }))
            }));
          }
        }

        if (activeMenu === 'projects') {
          const projectsResponse = await axios.get(`${API_ENDPOINT}/projects`, {
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${userData.token}`,
            },
            baseURL: API_URL // Ensure the base URL is set correctly
          });

          if (projectsResponse.data.success) {
            setProjects(projectsResponse.data.projects);
          }
        }

        if (activeMenu === 'education') {
          // Fetch degree types first
          const degreeResponse = await axios.get(`${API_ENDPOINT}/get/degrees`, {
            headers: {
              'Accept': 'application/json',
              'Authorization': userData.token,
            },
            baseURL: API_URL // Ensure the base URL is set correctly
          });
          setDegreeTypes(degreeResponse.data.data || []);

          // Fetch education data
          const educationResponse = await axios.get(`${API_ENDPOINT}/get/education`, {
            headers: {
              'Accept': 'application/json',
              'Authorization': userData.token,
            },
            withCredentials: true,
            baseURL: API_URL // Ensure the base URL is set correctly
          });

          const educationData = educationResponse.data.data || [];

          // Get unique degree type IDs that need specializations
          const uniqueDegreeTypeIds = [...new Set(
            educationData
              .map(edu => edu.degree_type_id || (edu.degree_type && edu.degree_type.id))
              .filter(id => id && ![1, 2, '1', '2'].includes(Number(id)))
          )];

          // Fetch all specializations in parallel
          const specializationPromises = uniqueDegreeTypeIds.map(degreeTypeId =>
            axios.get(`${API_ENDPOINT}/get/specialization/${degreeTypeId}`, {
              headers: {
                'Accept': 'application/json',
                'Authorization': userData.token,
              },
              baseURL: API_URL // Ensure the base URL is set correctly
            })
          );

          const specializationResponses = await Promise.all(specializationPromises);

          // Combine all specializations
          const allSpecializations = specializationResponses.reduce((acc, response) => {
            const newSpecs = response.data.data || [];
            return [...acc, ...newSpecs];
          }, []);

          // Remove duplicates
          const uniqueSpecializations = Array.from(
            new Map(allSpecializations.map(spec => [spec.id, spec])).values()
          );

          setSpecializations(uniqueSpecializations);
          setFormData(prev => ({
            ...prev,
            education: educationData,
          }));
        }
      } catch (error) {
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, [activeMenu]); // This effect runs when activeMenu changes

  useEffect(() => {
    if (formData.avatar_url) {
      setPhotoPreview(getDocumentUrl(formData.avatar_url));
    }
  }, [formData.avatar_url]);

  // Update the fetchSpecializations function to use the same token handling:
  const fetchSpecializations = async (degreeTypeId) => {
    if (!degreeTypeId) return;

    try {
      const userInfo = getCookie("user_info");
      const userData = userInfo ? JSON.parse(userInfo) : null;

      if (!userData?.token) {
        toast.error('Authentication required');
        return;
      }

      const response = await axios.get(`${API_ENDPOINT}/get/specialization/${degreeTypeId}`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': userData.token,
        },
        withCredentials: true,
        baseURL: API_URL // Ensure the base URL is set correctly
      });

      setSpecializations(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load specializations');
    }
  };

  const fetchEducationData = async () => {
    try {
      const userInfo = getCookie("user_info");
      const userData = userInfo ? JSON.parse(userInfo) : null;

      if (!userData?.token) {
        toast.error('Authentication required. Please log in again.');
        return;
      }

      const response = await axios.get(`${API_ENDPOINT}/get/education`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${userData.token}`, // Ensure Bearer prefix is added
        },
        withCredentials: true,
        baseURL: API_URL // Ensure the base URL is set correctly
      });

      setFormData((prev) => ({
        ...prev,
        education: response.data.data || [],
      }));
    } catch (error) {
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

        if (field === 'education') {
          switch(key) {
            case 'percentage_cgpa':
              const numValue = parseFloat(value);
              if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
                transformedValue = numValue.toString();
              } else if (value === '') {
                transformedValue = '';
              } else {
                toast.error('Percentage/CGPA must be between 0 and 100');
                return updatedData;
              }
              break;
            case 'duration_from':
            case 'duration_to':
              // Directly use the date from the date input which should be in YYYY-MM-DD format
              transformedValue = value;
              break;
            default:
              transformedValue = value.toString().trim();
          }
        } else if (field === 'certifications') {
          // Keep existing certification handling
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
              transformedValue = value;
              break;
            default:
              transformedValue = value.trim();
          }
        }

        updatedData[field][index][key] = transformedValue;
        return updatedData;
      });
    } catch (error) {
      toast.error('Failed to update field');
    }
  };

  const handleSaveEducation = (edu, index) => {
    // Check if all required fields are present
    const requiredFields = {
      degree_type_id: edu.degree_type_id || edu.degree_type?.id,
      institute_name: edu.institute_name,
      duration_from: edu.duration_from,
      duration_to: edu.duration_to,
      percentage_cgpa: edu.percentage_cgpa,
      location: edu.location
    };

    // Check if all required fields have values
    const hasAllRequired = Object.values(requiredFields).every(val => val !== undefined && val !== null && val !== '');

    if (hasAllRequired) {
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
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
    }
  };

  const createEducation = async (educationData) => {
    try {
      const userInfo = getCookie("user_info");
      const userData = userInfo ? JSON.parse(userInfo) : null;

      if (!userData?.token) {
        toast.error('Authentication required');
        return;
      }

      setLoading(true);

      const response = await axios({
        method: 'post',
        url: `${API_ENDPOINT}/education`,
        data: educationData,
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${userData.token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true,
        baseURL: API_URL // Ensure the base URL is set correctly
      });

      if (response.data) {
        toast.success('Education added successfully');

        // Fetch fresh data to ensure we have the latest state
        await fetchEducationData();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add education';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateEducation = async (educationData) => {
    try {
      const userInfo = getCookie("user_info");
      const userData = userInfo ? JSON.parse(userInfo) : null;

      if (!userData?.token) {
        toast.error('Authentication required');
        return;
      }

      setLoading(true);

      const response = await axios({
        method: 'put',
        url: `${API_ENDPOINT}/update/education`,
        data: educationData,
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${userData.token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true,
        baseURL: API_URL // Ensure the base URL is set correctly
      });

      if (response.data) {
        toast.success('Education updated successfully');

        // Fetch fresh data to ensure we have the latest state
        await fetchEducationData();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update education';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleMenu = (id) => {
    // Only change the active menu, don't trigger success messages
    setActiveMenu(activeMenu === id ? null : id);

    // Don't show success message when switching tabs
    setSuccess(null);

    // Set basic as default sub-tab when personal details is clicked
    if (id === 'personal') {
      setActiveSubTab('basic');
    } else {
      setActiveSubTab(null);
    }
  };

  // Add these validation functions before the renderSubTabContent function
  const validateBasicDetails = (data) => {
    const errors = [];
    if (!data.name?.trim()) errors.push('Name is required');
    if (!data.email?.trim()) errors.push('Email is required');
    if (!data.gender) errors.push('Gender is required');
    if (!data.birthday) errors.push('Birthday is required');
    return errors;
  };

  const validateAdditionalDetails = (data) => {
    const errors = [];
    if (!data.address?.trim()) errors.push('Address is required');
    if (!data.city?.trim()) errors.push('City is required');
    if (!data.state_id) errors.push('State is required');
    if (!data.pincode?.trim()) errors.push('Pincode is required');
    return errors;
  };

  const validateDocs = (data) => {
    const errors = [];
    if (!data.aadhaar_number?.trim()) errors.push('Aadhaar number is required');
    if (!data.upload_aadhar && !data.aadhar_path) errors.push('Aadhaar document is required');
    if (!data.linkedin_profile?.trim()) errors.push('LinkedIn profile is required');
    if (!data.passport_photo && !data.passport_photo_path) errors.push('Passport size photo is required');
    if (!data.upload_resume && !data.resume_path) errors.push('Resume is required');
    return errors;
  };

  const validateParentDetails = (data) => {
    const errors = [];
    if (!data.parent_name?.trim()) errors.push('Parent name is required');
    if (!data.parent_email?.trim()) errors.push('Parent email is required');
    if (!data.parent_aadhar?.trim()) errors.push('Parent Aadhaar is required');
    if (!data.parent_occupation?.trim()) errors.push('Parent occupation is required');
    if (!data.residential_address?.trim()) errors.push('Residential address is required');
    return errors;
  };

  // Modify the toggleSubTab function to include validation
  const toggleSubTab = (id) => {
    let errors = [];

    switch (activeSubTab) {
      case 'basic':
        errors = validateBasicDetails(formData);
        break;
      case 'additional':
        errors = validateAdditionalDetails(formData);
        break;
      case 'docs':
        errors = validateDocs(formData);
        break;
      case 'parent':
        errors = validateParentDetails(formData);
        break;
    }

    if (errors.length > 0) {
      errors.forEach(error => {
        toast.error(error);
      });
      return;
    }

    setActiveSubTab(id);
    setSuccess(null);
    setError(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Add validation for Aadhaar number and PIN code
    if (name === 'aadhaar_number') {
      // Only allow numbers and limit to 12 digits
      if (value.length <= 12 && /^\d*$/.test(value)) {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    } else if (name === 'pincode') {
      // Only allow numbers and limit to 6 digits
      if (value.length <= 6 && /^\d*$/.test(value)) {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    } else if (name === 'parent_aadhar') {
      if (value.length <= 12 && /^\d*$/.test(value)) {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];

      // Add file size validation for passport photo
      if (name === 'passport_photo' && file.size > 20 * 1024 * 1024) { // 20MB limit
        toast.error('Passport photo must be less than 20MB');
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
          // Set preview for whichever field is being updated
          if (name === 'avatar_url') {
            setPhotoPreview(e.target.result);
            // Auto-save avatar when uploaded
            handleAvatarUpload(file);
          }
          // The preview for passport_photo is handled directly in the render function
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleAvatarUpload = async (avatarFile) => {
    try {
      setLoading(true);

      const userInfo = getCookie("user_info");
      const userData = userInfo ? JSON.parse(userInfo) : null;

      if (!userData?.token) {
        toast.error('User authentication required');
        return;
      }

      // Create FormData object
      const formDataToSend = new FormData();

      // Only send the avatar data
      const jsonData = { avatar_update: true };
      formDataToSend.append('data', JSON.stringify(jsonData));

      formDataToSend.append('avatar_url', avatarFile);

      const response = await axios.post(`${API_URL}/api/profile`, formDataToSend, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${userData.token}`,
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      if (response.data.success) {
        toast.success('Profile picture updated successfully!');
        if (response.data.user && response.data.user.avatar_url) {
          // Keep the photoPreview from the FileReader for immediate display
          // but update the formData with the response from the server
          setFormData(prev => ({
            ...prev,
            avatar_url: null // Clear the File object since we now have the URL
          }));
        }
      } else {
        throw new Error(response.data.message || 'Update failed');
      }
    } catch (error) {
      console.error('Avatar update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile picture');
      // Revert the preview if upload failed
      setPhotoPreview(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFile = (fieldName) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: null
    }));
  };

  const handleAddItem = (field) => {
    setFormData(prev => {
      const newData = { ...prev };

      if (field === 'education') {
        // Check if there's already an empty education form
        const hasEmptyForm = newData.education?.some(edu =>
          !edu.degree_type_id &&
          !edu.institute_name &&
          !edu.duration_from &&
          !edu.duration_to &&
          !edu.percentage_cgpa
        );

        // Only add a new form if there isn't an empty one
        if (!hasEmptyForm) {
          if (!newData.education) {
            newData.education = [];
          }
          newData.education.push({
            degree_type_id: '',
            specialization_id: '',
            other_specialization: '',
            institute_name: '',
            location: '',
            duration_from: '',
            duration_to: '',
            percentage_cgpa: ''
          });
        } else {
          toast.info('Please fill out the existing education form first');
        }
      } else if (field === 'certifications') {
        if (!newData.certifications) {
          newData.certifications = [];
        }
        // Check if there's already an empty certification form
        const hasEmptyForm = newData.certifications.some(cert =>
          !cert.certification_name &&
          !cert.authority &&
          !cert.certification_date &&
          !cert.certificate_number
        );

        // Only add a new form if there isn't an empty one
        if (!hasEmptyForm) {
          newData.certifications.push({
            certification_name: '',
            authority: '',
            certification_date: '',
            score: '',
            certificate_number: '',
            certificate_file: null,
            path: null
          });
        } else {
          toast.info('Please fill out the existing certification form first');
        }
      } else if (field === 'projects') {
        if (!newData.projects) {
          newData.projects = [];
        }
        newData.projects.push({
          title: '',
          description: '',
          role: '',
          technologies: '',
          project_url: '',
          github_url: '',
          start_date: '',
          end_date: '',
          is_ongoing: false,
          team_size: '',
          key_achievements: '',
          project_type: '',
          client_name: '',
          organization: ''
        });
      }

      return newData;
    });
  };

  // Add this validation function before handleSubmit
  const validatePersonalDetails = (data) => {
    const errors = [];

    // Basic Details
    if (!data.name?.trim()) errors.push('Name is required');
    if (!data.email?.trim()) errors.push('Email is required');
    if (!data.gender) errors.push('Gender is required');
    if (!data.birthday) errors.push('Birthday is required');

    // Additional Details
    if (!data.address?.trim()) errors.push('Address is required');
    if (!data.city?.trim()) errors.push('City is required');
    if (!data.state_id) errors.push('State is required');
    if (!data.pincode?.trim()) errors.push('Pincode is required');

    // Documents
    if (!data.aadhaar_number?.trim()) errors.push('Aadhaar number is required');
    if (!data.upload_aadhar && !data.aadhar_path) errors.push('Aadhaar document is required');
    if (!data.linkedin_profile?.trim()) errors.push('LinkedIn profile is required');
    if (!data.passport_photo && !data.passport_photo_path) errors.push('Passport size photo is required');
    if (!data.upload_resume && !data.resume_path) errors.push('Resume is required');

    // Parent Details
    if (!data.parent_name?.trim()) errors.push('Parent name is required');
    if (!data.parent_aadhar?.trim()) errors.push('Parent Aadhaar is required');
    if (!data.parent_occupation?.trim()) errors.push('Parent occupation is required');
    if (!data.residential_address?.trim()) errors.push('Residential address is required');

    return errors;
  };

  // Update the handleSubmit function
  const handleSubmit = async () => {
    try {
      // Validate all required fields first
      const validationErrors = validatePersonalDetails(formData);
      if (validationErrors.length > 0) {
        // Show all validation errors in a toast
        validationErrors.forEach(error => {
          toast.error(error);
        });
        return;
      }

      setLoading(true);

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

      // For PUT requests, we need to use the _method parameter for Laravel
      if (method === 'put') {
        formData.append('_method', 'PUT');
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
    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (success) return <p className="text-green-500">{success}</p>;

    switch (activeSubTab) {
      case 'basic':
        return (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Number
                </label>
                <input
                  type="text"
                  name="registration_number"
                  value={formData.registration_number || ''}
                  onChange={handleChange}
                  disabled
                  className="w-full p-2 border rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Domain
                </label>
                <input
                  type="text"
                  value={formData.domain_id || ''}
                  disabled
                  className="w-full p-2 border rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country Code
                </label>
                <select
                  name="country_code"
                  value={formData.country_code || ''}
                  onChange={handleChange}
                  disabled
                  className="w-full p-2 border rounded-lg bg-gray-50"
                >
                  <option value="+91">+91</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  disabled
                  className="w-full p-2 border rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender<span className="text-red-500">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Birthday<span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="birthday"
                  value={formData.birthday || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => toggleSubTab('additional')}
                className={`px-4 py-2 text-white rounded-lg transition-colors ${
                  !formData.name?.trim() || !formData.email?.trim() || !formData.gender || !formData.birthday
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-orange-500 hover:bg-orange-600'
                }`}
                disabled={!formData.name?.trim() || !formData.email?.trim() || !formData.gender || !formData.birthday}
              >
                Next
              </button>
            </div>
          </div>
        );
      case 'additional':
        return (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address<span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  rows={4}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State<span className="text-red-500">*</span>
                </label>
                <select
                  name="state_id"
                  value={formData.state_id || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  required
                >
                  <option value="">Select State</option>
                  <option value="1">State 1</option>
                  <option value="2">State 2</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pincode<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  required
                  pattern="\d{6}"
                  title="PIN code must be exactly 6 digits"
                  maxLength={6}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => toggleSubTab('docs')}
                className={`px-4 py-2 text-white rounded-lg transition-colors ${
                  !formData.address?.trim() || !formData.city?.trim() || !formData.state_id || !formData.pincode?.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-orange-500 hover:bg-orange-600'
                }`}
                disabled={!formData.address?.trim() || !formData.city?.trim() || !formData.state_id || !formData.pincode?.trim()}
              >
                Next
              </button>
            </div>
          </div>
        );
      case 'docs':
        return (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col h-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aadhaar Number<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="aadhaar_number"
                  value={formData.aadhaar_number || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  required
                  pattern="\d{12}"
                  title="Aadhaar number must be exactly 12 digits"
                  maxLength={12}
                />

                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aadhaar Document<span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="cursor-pointer bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                      <input
                        type="file"
                        name="upload_aadhar"
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        required={!formData.upload_aadhar}
                      />
                      Choose Aadhaar
                    </label>
                    {(formData.upload_aadhar) && (
                      <div className="flex items-center gap-2">
                        <a href={getDocumentUrl(formData.upload_aadhar)}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="text-orange-500 hover:text-orange-600"
                        >
                          View Aadhaar
                        </a>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile('upload_aadhar')}
                          className="text-red-500 hover:text-red-600"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col h-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn Profile<span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  name="linkedin_profile"
                  value={formData.linkedin_profile || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  placeholder="https://linkedin.com/in/yourprofile"
                  required
                />
                {formData.linkedin_profile && (
                  <div className="mt-2">
                    <a
                      href={formData.linkedin_profile.startsWith('http') ? formData.linkedin_profile : `https://${formData.linkedin_profile}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-500 hover:text-orange-600 flex items-center gap-1"
                    >
                      <FiExternalLink className="w-4 h-4" />
                      <span>View Profile</span>
                    </a>
                  </div>
                )}
                <p className="mt-1 text-xs text-gray-500">Enter your full LinkedIn profile URL</p>
              </div>

              <div className="flex flex-col h-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Passport Size Photo<span className="text-red-500">*</span>
                </label>
                <div className="flex items-center space-x-4">
                  <label className="cursor-pointer bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                    <input
                      type="file"
                      name="passport_photo"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                      required={!formData.passport_photo && !formData.passport_photo_path}
                    />
                    Choose Photo
                  </label>
                  {(formData.passport_photo || formData.passport_photo_path) && (
                    <div className="relative">
                      <img
                        src={
                          formData.passport_photo instanceof File
                            ? URL.createObjectURL(formData.passport_photo)
                            : getDocumentUrl(formData.passport_photo_path)
                        }
                        alt="Passport Size"
                        className="h-20 w-16 object-cover rounded"
                        onError={(e) => {
                          console.error("Image failed to load:", e);
                          console.log("Image source:", e.target.src);
                          console.log("Passport photo path:", formData.passport_photo_path);
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFile('passport_photo')}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">Upload a passport size photo (max 20MB)</p>
              </div>

              <div className="flex flex-col h-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resume<span className="text-red-500">*</span>
                </label>
                <div className="flex items-center space-x-4">
                  <label className="cursor-pointer bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                    <input
                      type="file"
                      name="upload_resume"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      required={!formData.upload_resume}
                    />
                    Choose Resume
                  </label>
                  {formData.upload_resume && (
                    <div className="flex items-center gap-2">
                      <a
                        href={getDocumentUrl(formData.upload_resume)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-500 hover:text-orange-600"
                      >
                        View Resume
                      </a>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile('upload_resume')}
                        className="text-red-500 hover:text-red-600"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => toggleSubTab('parent')}
                className={`px-4 py-2 text-white rounded-lg transition-colors ${
                  !formData.aadhaar_number?.trim() ||
                  (!formData.upload_aadhar && !formData.aadhar_path) ||
                  !formData.linkedin_profile?.trim() ||
                  (!formData.passport_photo && !formData.passport_photo_path) ||
                  (!formData.upload_resume && !formData.resume_path)
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-orange-500 hover:bg-orange-600'
                }`}
                disabled={
                  !formData.aadhaar_number?.trim() ||
                  (!formData.upload_aadhar && !formData.aadhar_path) ||
                  !formData.linkedin_profile?.trim() ||
                  (!formData.passport_photo && !formData.passport_photo_path) ||
                  (!formData.upload_resume && !formData.resume_path)
                }
              >
                Next
              </button>
            </div>
          </div>
        );
      case 'parent':
        return (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="parent_name"
                  value={formData.parent_name || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent Email<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="parent_email"
                  value={formData.parent_email || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent Aadhaar<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="parent_aadhar"
                  value={formData.parent_aadhar || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  required
                  pattern="\d{12}"
                  title="Parent Aadhaar must be exactly 12 digits"
                  maxLength={12}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent Occupation<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="parent_occupation"
                  value={formData.parent_occupation || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Residential Address<span className="text-red-500">*</span>
                </label>
                <textarea
                  name="residential_address"
                  value={formData.residential_address || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  rows={4}
                  required
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleSubmit}
                className="px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Save Changes
              </button>
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
          <div>
            {/* Show messages if they exist */}
            {showSuccessMessage}
            {showErrorMessage}

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
            </div>
          </div>
        );
      case 'education':
        return (
          <div className="space-y-6">
            {formData.education.map((edu, index) => {
              // Check for both string and number types since API might return either
              const degreeTypeId = edu.degree_type_id || (edu.degree_type && edu.degree_type.id);
              const isSchoolEducation = ['1', '2', 1, 2].includes(degreeTypeId);

              return (
                <div key={index} className="bg-white rounded-lg shadow p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First Row */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Degree Type<span className="text-red-500">*</span>
                      </label>
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
                        className="w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
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
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Specialization<span className="text-red-500">*</span>
                          </label>
                          <select
                            value={edu.specialization_id || (edu.specialization && edu.specialization.id) || ''}
                            onChange={(e) => {
                              const value = e.target.value;
                              handleItemChange('education', index, 'specialization_id', value);
                              // Show other specialization input only when "Others" is selected
                              handleItemChange('education', index, 'other_specialization', ''); // Clear previous value
                              setShowOtherSpecialization(value === '0');
                            }}
                            className="w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
                            required={!isSchoolEducation}
                          >
                            <option value="">Select Specialization</option>
                            {/* Filter out any existing "Other" options from the API */}
                            {specializations
                              .filter(spec => !spec.name.toLowerCase().includes('other'))
                              .map(spec => (
                                <option key={spec.id} value={spec.id}>{spec.name}</option>
                              ))
                            }
                            {/* Add single Others option at the end */}
                            <option value="0">Others</option>
                          </select>
                        </div>

                        {/* Show other specialization input only when Others (0) is selected */}
                        {edu.specialization_id === '0' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Other Specialization<span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={edu.other_specialization || ''}
                              onChange={(e) => handleItemChange('education', index, 'other_specialization', e.target.value)}
                              className="w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
                              placeholder="Enter your specialization"
                              required={true}
                            />
                          </div>
                        )}
                      </>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Institute/University Name<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={edu.institute_name || ''}
                        onChange={(e) => handleItemChange('education', index, 'institute_name', e.target.value)}
                        className="w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Enter institute name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={edu.location || ''}
                        onChange={(e) => handleItemChange('education', index, 'location', e.target.value)}
                        className="w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Enter location"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration From<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={edu.duration_from || ''}
                        onChange={(e) => handleItemChange('education', index, 'duration_from', e.target.value)}
                        className="w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration To<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={edu.duration_to || ''}
                        onChange={(e) => handleItemChange('education', index, 'duration_to', e.target.value)}
                        className="w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Percentage/CGPA<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={edu.percentage_cgpa || ''}
                        onChange={(e) => handleItemChange('education', index, 'percentage_cgpa', e.target.value)}
                        className="w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Enter percentage (0-100)"
                        required
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-4 mt-6">
                    {deleteConfirmations[`education_${index}`] ? (
                      <div className="flex items-center space-x-4">
                        <span className="text-gray-700">Are you sure you want to delete this education record?</span>
                        <button
                          type="button"
                          onClick={() => {
                            deleteEducation(edu.id);
                            hideDeleteConfirmation(`education_${index}`);
                          }}
                          className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Delete
                        </button>
                        <button
                          type="button"
                          onClick={() => hideDeleteConfirmation(`education_${index}`)}
                          className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => showDeleteConfirmation(`education_${index}`)}
                          className="px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          Delete
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveEducation(edu, index)}
                          className="px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
                        >
                          Save
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Add New Button */}
            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={() => handleAddItem('education')}
                className="flex items-center gap-2 px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Education
              </button>
            </div>
          </div>
        );
      case 'projects':
        return (
          <div className="space-y-6">
            {showSuccessMessage}
            {showErrorMessage}

            <div className="bg-white rounded-lg p-6">
              <div className="flex justify-end mb-6">
                {!showProjectForm && projects.length > 0 && (
                  <button
                    onClick={() => setShowProjectForm(true)}
                    className="add-project-btn"
                  >
                    <FiPlus className="add-project-btn-icon" />
                    Add Project
                  </button>
                )}
              </div>

              {/* Project List */}
              {!showProjectForm && projects.length > 0 && (
                <div className="space-y-6">
                  {projects.map((project, index) => (
                    <div key={project.id} className="project-card">
                      <div className="project-card-header">
                        <h3 className="project-card-title">
                          <span className="project-card-title-icon">
                            <MdBuild />
                          </span>
                          {project.title}
                        </h3>
                        <div className="project-card-actions">
                          <button
                            onClick={() => {
                              setEditingProject(project);
                              setProjectForm({
                                title: project.title,
                                description: project.description,
                                technologies: project.technologies,
                                project_url: project.project_url,
                                start_date: project.start_date,
                                end_date: project.end_date,
                                is_ongoing: project.is_ongoing,
                                key_achievements: project.key_achievements,
                                project_type: project.project_type,
                                client_name: project.client_name,
                                organization: project.organization,
                                project_files: []
                              });
                              setShowProjectForm(true);
                            }}
                            className="project-card-action-btn project-card-edit-btn"
                            title="Edit project"
                          >
                            <FiEdit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="project-card-action-btn project-card-delete-btn"
                            title="Delete project"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      <div className="project-card-body">
                        <div className="project-card-section">
                          <h4 className="project-card-section-title">Description</h4>
                          <p className="project-card-section-content">{project.description}</p>
                        </div>

                        <div className="project-card-section">
                          <h4 className="project-card-section-title">Technologies</h4>
                          <div className="project-card-technologies">
                            {project.technologies && project.technologies.split(',').map((tech, i) => (
                              <span key={i} className="project-card-tag">
                                {tech.trim()}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="project-card-section">
                            <h4 className="project-card-section-title">Project Type</h4>
                            <div>
                              {project.project_type && (
                                <span className={`project-card-tag project-card-tag-${project.project_type.toLowerCase()}`}>
                                  {project.project_type}
                                </span>
                              )}
                              {project.is_ongoing && (
                                <span className="project-card-tag project-card-tag-ongoing">
                                  Ongoing
                                </span>
                              )}
                            </div>
                          </div>

                          {project.organization && (
                            <div className="project-card-section">
                              <h4 className="project-card-section-title">Organization</h4>
                              <p className="project-card-section-content">{project.organization}</p>
                            </div>
                          )}

                          {project.key_achievements && (
                            <div className="project-card-section">
                              <h4 className="project-card-section-title">Key Achievements</h4>
                              <p className="project-card-section-content">{project.key_achievements}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Project Files Section */}
                      {project.project_files && (
                        <div className="project-card-section">
                          <h4 className="project-card-section-title" style={{ fontFamily: '"Poppins", "Poppins-SemiBold", sans-serif' }}>
                            Project Files
                          </h4>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {JSON.parse(project.project_files || '[]').map((file, fileIndex) => (
                              <button
                                key={fileIndex}
                                onClick={() => {
                                  const fileUrl = getDocumentUrl(file.path);
                                  openPdfViewer(fileUrl, file.name);
                                }}
                                className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-sm transition-colors"
                                style={{ fontFamily: '"Poppins", "Poppins-Medium", sans-serif' }}
                              >
                                <FiEye className="w-4 h-4 text-orange-500" />
                                <span className="truncate max-w-[150px]">{file.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="project-card-footer">
                        <div className="project-card-date">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(project.start_date).toLocaleDateString()} -
                          {project.is_ongoing ? ' Present' : ` ${new Date(project.end_date).toLocaleDateString()}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty state when no projects */}
              {!showProjectForm && projects.length === 0 && (
                <div className="project-empty-state">
                  <div className="project-empty-state-icon">
                    <MdBuild />
                  </div>
                  <h3 className="project-empty-state-title" style={{ fontFamily: '"Poppins", "Poppins-SemiBold", sans-serif' }}>No projects yet</h3>
                  <p className="project-empty-state-text" style={{ fontFamily: '"Poppins", "Poppins-Regular", sans-serif' }}>
                    Showcase your skills and experience by adding projects you've worked on.
                  </p>
                  <button
                    onClick={() => setShowProjectForm(true)}
                    className="add-project-btn"
                    style={{ fontFamily: '"Poppins", "Poppins-Medium", sans-serif' }}
                  >
                    <FiPlus className="add-project-btn-icon" />
                    Add Your First Project
                  </button>
                </div>
              )}

              {/* Project Form */}
              {showProjectForm && (
                <div className="project-form">
                  <div className="project-form-header">
                    <h3 className="project-form-title" style={{ fontFamily: '"Poppins", "Poppins-SemiBold", sans-serif' }}>
                      <span className="project-form-title-icon">
                        <MdBuild />
                      </span>
                      {editingProject ? 'Edit Project' : 'Add New Project'}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="project-form-group">
                      <label className="project-form-label">
                        Title<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={projectForm.title}
                        onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
                        className="project-form-input"
                        placeholder="Enter project title"
                        required
                      />
                    </div>

                    <div className="project-form-group">
                      <label className="project-form-label">
                        Project Type
                      </label>
                      <select
                        value={projectForm.project_type}
                        onChange={(e) => setProjectForm({...projectForm, project_type: e.target.value})}
                        className="project-form-input"
                      >
                        <option value="">Select Project Type</option>
                        <option value="Personal">Personal</option>
                        <option value="Academic">Academic</option>
                        <option value="Professional">Professional</option>
                      </select>
                    </div>

                    <div className="project-form-group md:col-span-2">
                      <label className="project-form-label">
                        Description<span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={projectForm.description}
                        onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                        className="project-form-input project-form-textarea"
                        rows={4}
                        placeholder="Describe your project"
                        required
                      />
                    </div>

                    <div className="project-form-group">
                      <label className="project-form-label">
                        Technologies
                      </label>
                      <input
                        type="text"
                        value={projectForm.technologies}
                        onChange={(e) => setProjectForm({...projectForm, technologies: e.target.value})}
                        className="project-form-input"
                        placeholder="e.g. React, Node.js, MongoDB (comma separated)"
                      />
                    </div>

                    <div className="project-form-group">
                      <label className="project-form-label">
                        Project URL
                      </label>
                      <input
                        type="url"
                        value={projectForm.project_url}
                        onChange={(e) => setProjectForm({...projectForm, project_url: e.target.value})}
                        className="project-form-input"
                        placeholder="https://example.com"
                      />
                    </div>

                    <div className="project-form-group">
                      <label className="project-form-label">
                        Start Date<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={projectForm.start_date}
                        onChange={(e) => setProjectForm({...projectForm, start_date: e.target.value})}
                        className="project-form-input"
                        required
                      />
                    </div>

                    <div className="project-form-group">
                      <label className="project-form-label">
                        End Date
                      </label>
                      <div className="space-y-2">
                        <div className="project-form-checkbox-group">
                          <input
                            type="checkbox"
                            id="is_ongoing"
                            checked={projectForm.is_ongoing}
                            onChange={(e) => setProjectForm({...projectForm, is_ongoing: e.target.checked})}
                            className="project-form-checkbox"
                          />
                          <label htmlFor="is_ongoing" className="text-sm text-gray-700">
                            This is an ongoing project
                          </label>
                        </div>
                        {!projectForm.is_ongoing && (
                          <input
                            type="date"
                            value={projectForm.end_date}
                            onChange={(e) => setProjectForm({...projectForm, end_date: e.target.value})}
                            className="project-form-input"
                          />
                        )}
                      </div>
                    </div>

                    <div className="project-form-group">
                      <label className="project-form-label">
                        Organization
                      </label>
                      <input
                        type="text"
                        value={projectForm.organization}
                        onChange={(e) => setProjectForm({...projectForm, organization: e.target.value})}
                        className="project-form-input"
                        placeholder="Organization name"
                      />
                    </div>

                    <div className="project-form-group">
                      <label className="project-form-label">
                        Client Name (if applicable)
                      </label>
                      <input
                        type="text"
                        value={projectForm.client_name}
                        onChange={(e) => setProjectForm({...projectForm, client_name: e.target.value})}
                        className="project-form-input"
                        placeholder="Client or company name"
                      />
                    </div>

                    <div className="project-form-group md:col-span-2">
                      <label className="project-form-label">
                        Key Achievements
                      </label>
                      <textarea
                        value={projectForm.key_achievements}
                        onChange={(e) => setProjectForm({...projectForm, key_achievements: e.target.value})}
                        className="project-form-input project-form-textarea"
                        rows={3}
                        placeholder="List your key achievements in this project"
                      />
                    </div>

                    <div className="project-form-group md:col-span-2">
                      <label className="project-form-label">
                        Project Files
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                        <div className="space-y-1 text-center">
                          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <div className="flex text-sm text-gray-600">
                            <label className="relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500">
                              <span>Upload files</span>
                              <input
                                type="file"
                                multiple
                                onChange={handleProjectFileChange}
                                className="sr-only"
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">Any file up to 10MB</p>
                        </div>
                      </div>

                      {/* Display uploaded files */}
                      {projectForm.project_files.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-700">Selected files:</h4>
                          <ul className="mt-2 divide-y divide-gray-200">
                            {projectForm.project_files.map((file, index) => (
                              <li key={index} className="py-2 flex justify-between items-center">
                                <span className="text-sm text-gray-500">{file.name}</span>
                                <button
                                  type="button"
                                  onClick={() => removeProjectFile(index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  Remove
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="project-form-actions">
                    <button
                      type="button"
                      onClick={resetProjectForm}
                      className="project-form-cancel-btn"
                      style={{ fontFamily: '"Poppins", "Poppins-Medium", sans-serif' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleProjectSubmit}
                      className="project-form-submit-btn"
                      style={{ fontFamily: '"Poppins", "Poppins-Medium", sans-serif' }}
                    >
                      {editingProject ? 'Update Project' : 'Save'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case 'certifications':
        return (
          <div className="space-y-6">
            {/* Certifications Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <MdStar className="text-orange-500" />
                Certifications
              </h2>
              <button
                onClick={() => handleAddItem('certifications')}
                className="flex items-center gap-2 px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
              >
                <FiPlus className="w-5 h-5" />
                Add Certification
              </button>
            </div>

            {/* Certifications Cards */}
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
                      value={cert.certification_date ? formatDateForServer(cert.certification_date) : ''}
                      onChange={(e) => {
                        // Ensure the date is in YYYY-MM-DD format
                        handleItemChange('certifications', index, 'certification_date', e.target.value);
                      }}
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
                        <>
                          <a
                            href={getDocumentUrl(cert.path)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-500 hover:text-orange-600"

                          >
                            View Certificate
                          </a>
                          <span className="ml-2 text-xs text-gray-500" title={cert.path}>
                            {cert.path && typeof cert.path === 'string' && cert.path.length > 20
                              ? `${cert.path.slice(0, 20)}...`
                              : cert.path}
                          </span>
                        </>
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
          </div>
        );
      case 'resume':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-8">
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800">Generate Your Professional Resume</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Create a well-formatted resume that includes all your personal details, education, projects, and certifications in a professional layout.
                </p>
                <div className="flex flex-col items-center gap-6 mt-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
                    {resumeTemplates.map((template) => (
                      <div
                        key={template.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          selectedTemplate === template.id
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-orange-300'
                        }`}
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <img
                          src={template.preview}
                          alt={template.name}
                          className="w-full h-48 object-cover rounded mb-4"
                        />
                        <h3 className="font-semibold mb-2">{template.name}</h3>
                        <p className="text-sm text-gray-600">{template.description}</p>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowResumeModal(true)}
                    className="flex items-center gap-2 px-6 py-3 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors shadow-md"
                  >
                    <AiOutlineFilePdf className="w-6 h-6" />
                    Generate Resume
                  </button>
                </div>
              </div>
            </div>
          </div>
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
          // Store local blob URL temporarily for preview
          path: URL.createObjectURL(file)
        };
        return {
          ...prev,
          certifications: updatedCertifications
        };
      });
    }
  };

  // Add helper function to get the proper document URL
  const getDocumentUrl = (path) => {
    if (!path) return null;

    // For File objects (newly uploaded files)
    if (path instanceof File) {
      return URL.createObjectURL(path);
    }

    // For string paths
    if (typeof path === 'string') {
      // For blob URLs (temporary previews)
      if (path.startsWith('blob:')) {
        return path;
      }

      // For full URLs that already include the domain
      if (path.startsWith('http')) {
        // Fix double storage issue
        if (path.includes('/storage//storage/')) {
          return path.replace('/storage//storage/', '/storage/');
        }
        return path;
      }

      // For relative paths stored in the database
      // If path contains "certificates/" without a leading slash
      if (path.includes('certificates/') && !path.startsWith('/')) {
        return `${API_URL}/storage/${path}`;
      }

      // If path starts with "/storage/"
      if (path.startsWith('/storage/')) {
        return `${API_URL}${path}`;
      }

      // For paths stored in the database that start with "storage/"
      if (path.startsWith('storage/')) {
        return `${API_URL}/${path}`;
      }

      // Default case - assume it's a relative path that needs /storage/ prefix
      return `${API_URL}/storage/${path}`;
    }

    return null;
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

  const deleteEducation = async (educationId) => {
    try {
      const userInfo = getCookie("user_info");
      const userData = userInfo ? JSON.parse(userInfo) : null;

      if (!userData?.token) {
        toast.error('Authentication required');
        return;
      }

      setLoading(true);

      const response = await axios({
        method: 'delete',
        url: `${API_URL}/api/delete/education`,
        data: { id: educationId },
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${userData.token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      if (response.data) {
        toast.success('Education deleted successfully');

        // Fetch fresh data to ensure we have the latest state
        await fetchEducationData();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete education';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const userInfo = getCookie("user_info");
      const userData = userInfo ? JSON.parse(userInfo) : null;

      if (!userData?.token) {
        toast.error('Authentication required');
        return;
      }

      const response = await axios.get(`${API_ENDPOINT}/projects`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${userData.token}`
        }
      });
      if (response.data.success) {
        setProjects(response.data.projects);
        // Also update formData with the projects
        setFormData(prev => ({
          ...prev,
          projects: response.data.projects
        }));
      }
    } catch (error) {
      toast.error('Failed to fetch projects');
    }
  };

  const handleProjectSubmit = async () => {
    try {
      const userInfo = getCookie("user_info");
      const userData = userInfo ? JSON.parse(userInfo) : null;

      if (!userData?.token) {
        toast.error('Authentication required');
        return;
      }

      // Validate only title as required
      if (!projectForm.title) {
        toast.error('Project title is required');
        return;
      }

      // Prepare the data in the format expected by the server
      const projectData = {
        title: projectForm.title,
        description: projectForm.description || '',
        technologies: projectForm.technologies || '',
        project_url: projectForm.project_url || '',
        start_date: projectForm.start_date ? formatDateForServer(projectForm.start_date) : null,
        end_date: projectForm.is_ongoing ? null : (projectForm.end_date ? formatDateForServer(projectForm.end_date) : null),
        is_ongoing: projectForm.is_ongoing ? 1 : 0,
        key_achievements: projectForm.key_achievements || '',
        project_type: projectForm.project_type || '',
        client_name: projectForm.client_name || '',
        organization: projectForm.organization || ''
      };

      let url = `${API_URL}/api/projects`;
      let method = 'post';
      let requestData = projectData;

      if (editingProject) {
        url = `${API_URL}/api/projects/${editingProject.id}`;
        method = 'post'; // Using POST instead of PUT
        requestData = {
          ...projectData,
          _method: 'PUT' // Add this for Laravel to treat it as PUT request
        };
      }

      // Create form data
      const formData = new FormData();

      // Append all project data
      Object.entries(requestData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      // Append project files if any
      if (projectForm.project_files && projectForm.project_files.length > 0) {
        projectForm.project_files.forEach(file => {
          formData.append('project_files[]', file);
        });
      }

      const response = await axios({
        method: method,
        url: url,
        data: formData,
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${userData.token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        toast.success(editingProject ? 'Project updated successfully' : 'Project added successfully');
        setEditingProject(null);
        setShowProjectForm(false);
        resetProjectForm();
        // Fetch updated projects list
        await fetchProjects();
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 422) {
          // Validation errors
          const errors = error.response.data.errors;
          if (errors) {
            Object.entries(errors).forEach(([field, messages]) => {
              messages.forEach(message => {
                toast.error(`${field}: ${message}`);
              });
            });
          } else {
            toast.error('Validation error occurred. Please check your input.');
          }
        } else {
          toast.error(error.response.data.message || 'Failed to save project');
        }
      } else {
        toast.error('Failed to save project. Please try again.');
      }
    }
  };

  const handleProjectFileChange = (e) => {
    const files = Array.from(e.target.files);
    setProjectForm(prev => ({
      ...prev,
      project_files: [...prev.project_files, ...files]
    }));
  };

  const removeProjectFile = (index) => {
    setProjectForm(prev => ({
      ...prev,
      project_files: prev.project_files.filter((_, i) => i !== index)
    }));
  };

  const [projectToDelete, setProjectToDelete] = useState(null);

  const handleDeleteProject = (projectId) => {
    // Set the project ID to delete, which will trigger the confirmation UI
    setProjectToDelete(projectId);
  };

  const confirmDeleteProject = async () => {
    if (!projectToDelete) return;

    try {
      const userInfo = getCookie("user_info");
      const userData = userInfo ? JSON.parse(userInfo) : null;

      if (!userData?.token) {
        toast.error('Authentication required');
        return;
      }

      const response = await axios.delete(`${API_URL}/api/projects/${projectToDelete}`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${userData.token}`
        }
      });

      if (response.data.success) {
        toast.success('Project deleted successfully');
        // Fetch updated projects list
        fetchProjects();
      }
    } catch (error) {
      toast.error('Failed to delete project');
    } finally {
      // Reset the project to delete
      setProjectToDelete(null);
    }
  };

  const cancelDeleteProject = () => {
    // Reset the project to delete
    setProjectToDelete(null);
  };

  const resetProjectForm = () => {
    setProjectForm({
      title: '',
      description: '',
      technologies: '',
      project_url: '',
      start_date: '',
      end_date: '',
      is_ongoing: false,
      key_achievements: '',
      project_type: '',
      client_name: '',
      organization: '',
      project_files: []
    });
    setShowProjectForm(false);
  };

  // This function is used in StudentProfile.jsx but kept here for reference
  // const handleAddProject = () => {
  //   setEditingProject(null);
  //   setProjectForm({
  //     title: '',
  //     description: '',
  //     technologies: '',
  //     project_url: '',
  //     start_date: '',
  //     end_date: '',
  //     is_ongoing: false,
  //     key_achievements: '',
  //     project_type: '',
  //     client_name: '',
  //     organization: '',
  //     project_files: []
  //   });
  //   setShowProjectModal(true);
  // };

  // Add the resume templates
  const resumeTemplates = [
    {
      id: 'modern',
      name: 'Modern',
      preview: '/templates/modern.png',
      description: 'Clean and modern design with a professional layout'
    },
    {
      id: 'classic',
      name: 'Classic',
      preview: '/templates/classic.png',
      description: 'Traditional resume format, perfect for formal applications'
    },
    {
      id: 'creative',
      name: 'Creative',
      preview: '/templates/creative.png',
      description: 'Unique design that stands out while maintaining professionalism'
    }
  ];

  // Add the PDF styles
  const styles = StyleSheet.create({
    page: {
      padding: 30,
      fontFamily: 'Helvetica',
      fontSize: 12
    },
    header: {
      marginBottom: 20,
      borderBottom: 1,
      borderBottomColor: '#999',
      paddingBottom: 10
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 5,
      color: '#333'
    },
    contact: {
      fontSize: 11,
      marginBottom: 3,
      color: '#666'
    },
    section: {
      marginTop: 20,
      marginBottom: 10
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#333',
      borderBottom: 1,
      borderBottomColor: '#999',
      paddingBottom: 3
    },
    itemTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 3,
      color: '#444'
    },
    itemDetails: {
      fontSize: 11,
      marginBottom: 3,
      color: '#555',
      lineHeight: 1.4
    }
  });

  // Add the Resume component
  const Resume = ({ data }) => {
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    return (
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.name}>{data.name || 'Name Not Available'}</Text>
            <Text style={styles.contact}>
              {data.email || ''} {data.phone ? `| ${data.country_code || '+91'} ${data.phone}` : ''}
            </Text>
            <Text style={styles.contact}>
              {[data.address, data.city, 'India'].filter(Boolean).join(', ')}
            </Text>
            {data.linkedin_profile && (
              <Text style={styles.contact}>LinkedIn: {data.linkedin_profile}</Text>
            )}
          </View>

          {/* Education Section */}
          {data.education && data.education.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Education</Text>
              {data.education.map((edu, index) => (
                <View key={index} style={{ marginBottom: 10 }}>
                  <Text style={styles.itemTitle}>{edu.institute_name}</Text>
                  <Text style={styles.itemDetails}>
                    {edu.degree_type?.name} {edu.specialization?.name ? `in ${edu.specialization.name}` : ''}
                  </Text>
                  <Text style={styles.itemDetails}>
                    {formatDate(edu.duration_from)} - {formatDate(edu.duration_to)} | CGPA/Percentage: {edu.percentage_cgpa}%
                  </Text>
                  <Text style={styles.itemDetails}>Location: {edu.location}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Projects Section */}
          {data.projects && data.projects.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Projects</Text>
              {data.projects.map((project, index) => (
                <View key={index} style={{ marginBottom: 10 }}>
                  <Text style={styles.itemTitle}>{project.title}</Text>
                  <Text style={styles.itemDetails}>
                    Role: {project.role} | Technologies: {project.technologies}
                  </Text>
                  <Text style={styles.itemDetails}>
                    {formatDate(project.start_date)} - {project.is_ongoing ? 'Present' : formatDate(project.end_date)}
                  </Text>
                  <Text style={styles.itemDetails}>{project.description}</Text>
                  {project.key_achievements && (
                    <Text style={styles.itemDetails}>Key Achievements: {project.key_achievements}</Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Certifications Section */}
          {data.certifications && data.certifications.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Certifications</Text>
              {data.certifications.map((cert, index) => (
                <View key={index} style={{ marginBottom: 10 }}>
                  <Text style={styles.itemTitle}>{cert.certification_name}</Text>
                  <Text style={styles.itemDetails}>
                    Issued by {cert.authority} | Score: {cert.score}%
                  </Text>
                  <Text style={styles.itemDetails}>
                    Certificate Number: {cert.certificate_number}
                  </Text>
                  <Text style={styles.itemDetails}>
                    Date: {formatDate(cert.certification_date)}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </Page>
      </Document>
    );
  };

  // Add the ResumeModal component
  const ResumeModal = ({ show, onClose, onSelect, selectedTemplate }) => {
    const [pdfData, setPdfData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      const loadData = async () => {
        if (show) {
          setIsLoading(true);
          try {
            const userInfo = getCookie("user_info");
            const userData = userInfo ? JSON.parse(userInfo) : null;

            if (!userData?.token) {
              toast.error('Authentication required');
              return;
            }

            const [profileResponse, educationResponse, projectsResponse, certificationsResponse] = await Promise.all([
              axios.get(`${API_ENDPOINT}/profile`, {
                headers: {
                  'Accept': 'application/json',
                  'Authorization': `Bearer ${userData.token}`,
                }
              }),
              axios.get(`${API_ENDPOINT}/get/education`, {
                headers: {
                  'Accept': 'application/json',
                  'Authorization': `Bearer ${userData.token}`,
                }
              }),
              axios.get(`${API_ENDPOINT}/projects`, {
                headers: {
                  'Accept': 'application/json',
                  'Authorization': `Bearer ${userData.token}`,
                }
              }),
              axios.get(`${API_ENDPOINT}/certifications`, {
                headers: {
                  'Accept': 'application/json',
                  'Authorization': `Bearer ${userData.token}`,
                }
              })
            ]);

            const freshData = {
              ...profileResponse.data.user,
              education: educationResponse.data.data || [],
              projects: projectsResponse.data.projects || [],
              certifications: certificationsResponse.data.data || []
            };
            setPdfData(freshData);
          } catch (error) {
            toast.error('Failed to fetch data for PDF');
          } finally {
            setIsLoading(false);
          }
        }
      };
      loadData();
    }, [show]);

    if (!show) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Choose Resume Template</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {resumeTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedTemplate === template.id
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                  onClick={() => onSelect(template.id)}
                >
                  <img
                    src={template.preview}
                    alt={template.name}
                    className="w-full h-48 object-cover rounded mb-4"
                  />
                  <h3 className="font-semibold mb-2">{template.name}</h3>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors mr-4"
              >
                Cancel
              </button>
              {isLoading ? (
                <button className="px-4 py-2 text-white bg-orange-500 rounded-lg opacity-50 cursor-not-allowed flex items-center gap-2">
                  Loading...
                </button>
              ) : pdfData ? (
                <PDFDownloadLink
                  document={<Resume data={pdfData} template={selectedTemplate} />}
                  fileName={`${pdfData.name?.replace(/\s+/g, '_')}_Resume.pdf`}
                  className="px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                >
                  {({ loading }) =>
                    loading ? (
                      'Generating...'
                    ) : (
                      <>
                        <AiOutlineFilePdf />
                        Download Resume
                      </>
                    )
                  }
                </PDFDownloadLink>
              ) : (
                <button className="px-4 py-2 text-white bg-red-500 rounded-lg opacity-50 cursor-not-allowed">
                  Failed to load data
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Confirmation Dialog Component
  const DeleteConfirmationDialog = ({ isOpen, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
          <p className="mb-6">Are you sure you want to delete this project? This action cannot be undone.</p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Function to open PDF viewer modal
  const openPdfViewer = (fileUrl, fileName) => {
    setPdfViewerModal({
      isOpen: true,
      fileUrl,
      fileName
    });
  };

  // Function to close PDF viewer modal
  const closePdfViewer = () => {
    setPdfViewerModal({
      isOpen: false,
      fileUrl: '',
      fileName: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={projectToDelete !== null}
        onConfirm={confirmDeleteProject}
        onCancel={cancelDeleteProject}
      />

      {/* PDF Viewer Modal */}
      {pdfViewerModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-white rounded-lg w-11/12 h-5/6 max-w-6xl flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold" style={{ fontFamily: '"Poppins", "Poppins-SemiBold", sans-serif' }}>
                {pdfViewerModal.fileName}
              </h3>
              <button
                onClick={closePdfViewer}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 p-4">
              <iframe
                src={pdfViewerModal.fileUrl}
                className="w-full h-full border-0"
                title={pdfViewerModal.fileName}
              />
            </div>
          </div>
        </div>
      )}

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
          <div className="flex justify-between items-start w-full">
            <div className="flex flex-col items-start gap-4">
              <div className="relative">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Profile"
                    className="profile-image"
                  />
                ) : formData.avatar_url ? (
                  <img
                    src={getDocumentUrl(formData.avatar_url)}
                    alt="Profile"
                    className="profile-image"
                    onError={(e) => {
                      e.target.src = '/images/avatar-placeholder.png';
                    }}
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
                  <div className="contact-info-item">
                    <div className="contact-icon-container-resume">
                      <AiOutlineFilePdf className="contact-icon-resume" />
                    </div>
                    <span
                      className="text-sm cursor-pointer text-orange-500 hover:text-orange-700"
                      onClick={() => setShowResumeModal(true)}
                    >
                      Export Resume
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Add Overall Progress Bar */}
          <div className="mt-8 bg-white rounded-lg p-6 shadow-sm progress-container">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-800">Profile Completion</h3>
              <span className="text-2xl font-bold text-orange-500">
                {calculateOverallProgress(formData, projects)}%
              </span>
            </div>
            <div className="relative group">
              <div className="w-full bg-gray-200 rounded-full h-2.5 cursor-pointer">
                <div
                  className="bg-orange-500 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${calculateOverallProgress(formData, projects)}%` }}
                />
              </div>
              {/* Tooltip */}
              <div className="opacity-0 group-hover:opacity-100 progress-tooltip progress-tooltip-transition absolute -top-28 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white p-3 rounded-lg shadow-lg z-50">
                <div className="text-sm font-medium mb-2 border-b border-gray-700 pb-1">Section Contributions</div>
                <div className="space-y-1.5">
                  {mainMenu.filter(menu => menu.id !== 'resume').map((menu) => {
                    const percentage = calculateCompletionPercentage(formData, menu.id, projects);
                    return (
                      <div key={menu.id} className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 min-w-[150px]">
                          <span className="text-orange-500">{menu.icon}</span>
                          <span className="whitespace-nowrap">{menu.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-700 rounded-full h-1.5">
                            <div
                              className="bg-orange-500 h-1.5 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="font-medium min-w-[40px] text-right">
                            {percentage}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* Arrow */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                  <div className="border-8 border-transparent border-t-gray-900"></div>
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

          {/* Existing menu grid */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {mainMenu.filter(menu => menu.id !== 'resume').map((menu) => (
              <button
                key={menu.id}
                onClick={() => toggleMenu(menu.id)}
                className={`main-menu-item relative ${
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
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-gray-700">{menu.label}</span>
                  </div>
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
          {/* Use a regular div instead of a form to prevent automatic form submission */}
          <div>
            {renderMainTabContent(activeMenu)}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
