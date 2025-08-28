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
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, parseISO } from 'date-fns';
import LoadingFallback from './DashBoard/LoadingFallback';

// Make sure we're using the correct API URL
const API_URL = import.meta.env.VITE_APP_API_URL;
const API_ENDPOINT = `${API_URL}`;

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
  { id: 'certifications', label: 'Certifications/Achievements', icon: <MdStar /> },
  { id: 'resume-upload', label: 'Resume Upload', icon: <AiOutlineFilePdf /> },
];

// Add this after the mainMenu constant
const calculateCompletionPercentage = (formData, menuId, projects) => {
  // Safety check to prevent errors
  if (!formData || typeof formData !== 'object') {
    console.error('Invalid formData in calculateCompletionPercentage:', formData);
    return 0;
  }

  try {
    switch (menuId) {
      case 'personal':
        const basicFields = ['name', 'email', 'gender', 'birthday'];
        const additionalFields = ['address', 'city', 'state_id', 'pincode'];
        const docsFields = ['aadhaar_number', 'upload_aadhar', 'linkedin_profile', 'passport_photo'];
        const parentFields = ['parent_name', 'parent_email', 'parent_aadhar', 'parent_occupation', 'residential_address'];

        const basicComplete = basicFields.filter(field => formData[field]).length;
        const additionalComplete = additionalFields.filter(field => formData[field]).length;
        const docsComplete = docsFields.filter(field => formData[field]).length;
        const parentComplete = parentFields.filter(field => formData[field]).length;

        const totalFields = basicFields.length + additionalFields.length + docsFields.length + parentFields.length;
        const completedFields = basicComplete + additionalComplete + docsComplete + parentComplete;

        // Prevent division by zero
        return totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;

      case 'education':
        if (!formData.education || !Array.isArray(formData.education) || formData.education.length === 0) return 0;

        const requiredEduFields = ['degree_type_id', 'institute_name', 'duration_from', 'duration_to', 'percentage_cgpa', 'location'];
        let totalEduFields = 0;
        let completedEduFields = 0;

        formData.education.forEach(edu => {
          if (edu && typeof edu === 'object') {
            totalEduFields += requiredEduFields.length;
            completedEduFields += requiredEduFields.filter(field => edu[field]).length;
          }
        });

        // Prevent division by zero
        return totalEduFields > 0 ? Math.round((completedEduFields / totalEduFields) * 100) : 0;

      case 'projects':
        // Get projects from the projects state instead of formData
        if (!projects || !Array.isArray(projects) || projects.length === 0) {
          // Fallback to formData.projects if projects parameter is not available
          if (!formData.projects || !Array.isArray(formData.projects) || formData.projects.length === 0) return 0;

          const requiredProjFields = ['title', 'description', 'start_date', 'technologies', 'project_type'];
          let totalProjFields = 0;
          let completedProjFields = 0;

          formData.projects.forEach(proj => {
            if (proj && typeof proj === 'object') {
              totalProjFields += requiredProjFields.length;
              completedProjFields += requiredProjFields.filter(field => proj[field]).length;
            }
          });

          // Prevent division by zero
          return totalProjFields > 0 ? Math.round((completedProjFields / totalProjFields) * 100) : 0;
        } else {
          const requiredProjFields = ['title', 'description', 'start_date', 'technologies', 'project_type'];
          let totalProjFields = 0;
          let completedProjFields = 0;

          projects.forEach(proj => {
            if (proj && typeof proj === 'object') {
              totalProjFields += requiredProjFields.length;
              completedProjFields += requiredProjFields.filter(field => proj[field]).length;
            }
          });

          // Prevent division by zero
          return totalProjFields > 0 ? Math.round((completedProjFields / totalProjFields) * 100) : 0;
        }

      case 'certifications':
        if (!formData.certifications || !Array.isArray(formData.certifications) || formData.certifications.length === 0) return 0;

        const requiredCertFields = ['certification_name', 'authority', 'certification_date', 'certificate_number'];
        let totalCertFields = 0;
        let completedCertFields = 0;

        formData.certifications.forEach(cert => {
          if (cert && typeof cert === 'object') {
            totalCertFields += requiredCertFields.length;
            completedCertFields += requiredCertFields.filter(field => cert[field]).length;
          }
        });

        // Prevent division by zero
        return totalCertFields > 0 ? Math.round((completedCertFields / totalCertFields) * 100) : 0;

      case 'resume-upload':
        // Check if resume is uploaded
        return (formData.upload_resume || formData.resume_path) ? 100 : 0;

    default:
      return 0;
    }
  } catch (error) {
    console.error('Error in calculateCompletionPercentage:', error);
    return 0;
  }
};

// Add this function after calculateCompletionPercentage
  const calculateOverallProgress = (formData, projects) => {
    // Check if formData is valid to prevent NaN
    if (!formData || typeof formData !== 'object') {
      console.error('Invalid formData in calculateOverallProgress:', formData);
      return 0;
    }

    const sections = ['personal', 'education', 'projects', 'certifications', 'resume-upload'];
    const weights = {
      personal: 0.35,     // 35% weight for personal details
      education: 0.25,    // 25% weight for education
      projects: 0.2,      // 20% weight for projects
      certifications: 0.15, // 15% weight for certifications
      'resume-upload': 0.05 // 5% weight for resume upload
    };

  let weightedSum = 0;
  sections.forEach(section => {
    try {
      const sectionPercentage = calculateCompletionPercentage(formData, section, projects);
      // Ensure sectionPercentage is a valid number
      if (!isNaN(sectionPercentage)) {
        weightedSum += (sectionPercentage * weights[section]);
      } else {
        console.warn(`Invalid percentage for section ${section}:`, sectionPercentage);
      }
    } catch (error) {
      console.error(`Error calculating percentage for section ${section}:`, error);
    }
  });

  // Ensure we return a valid number, not NaN
  return isNaN(weightedSum) ? 0 : Math.round(weightedSum);
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
  const [states, setStates] = useState([]); // Add states state
  const [linkedinError, setLinkedinError] = useState(''); // Add LinkedIn validation error state
  const [educationErrors, setEducationErrors] = useState({}); // Add education validation errors state
  const [hasValidatedEducation, setHasValidatedEducation] = useState(false); // Track if education has been validated
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
    resume_path: null,
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
    social_links: { linkedin: '', github: '' },
    batch: { name: '' }
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
  const [resumeViewerModal, setResumeViewerModal] = useState({
    isOpen: false,
    fileUrl: '',
    fileName: ''
  });
  const [profileCompletionData, setProfileCompletionData] = useState(null);
  const [showProfileDetails, setShowProfileDetails] = useState(false);

  // Function to fetch profile completion data
  const fetchProfileCompletion = async () => {
    try {
      const userInfo = getCookie("user_info");
      let userData;

      if (userInfo) {
        userData = JSON.parse(userInfo);
      } else {
        console.error("No user info found in cookies");
        return;
      }

      const response = await axios.get('/api/profile-completion', {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${userData.token}`,
        }
      });

      if (response.data.success) {
        setProfileCompletionData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching profile completion:', error);
    }
  };

  useEffect(() => {
    // Fetch basic profile data on component mount
    const fetchBasicProfileData = async () => {
      setLoading(true);
      const userInfo = getCookie("user_info");
      let userData;

      try {
        if (userInfo) {
          userData = JSON.parse(userInfo);
        } else {
          console.error("No user info found in cookies");
          return;
        }

        // Fetch states
        const statesResponse = await axios.get(`${API_ENDPOINT}/states`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${userData.token}`,
          },
          baseURL: API_URL
        });
        setStates(statesResponse.data.data || []);

        // Fetch profile completion data
        await fetchProfileCompletion();

        console.log('Fetching profile with token:', userData.token);

        // Fetch basic profile data and projects in parallel
        const [profileResponse, projectsResponse] = await Promise.all([
          axios.get(`${API_ENDPOINT}/profile`, {
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${userData.token}`,
            },
            withCredentials: true,
          }),
          axios.get(`${API_ENDPOINT}/projects`, {
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${userData.token}`,
            },
          })
        ]);

        if (profileResponse.data && profileResponse.data.user) {
          console.log('Profile data received:', profileResponse.data);
          setFormData(prev => ({
            ...prev,
            ...profileResponse.data.user
          }));
        } else {
          console.error('Profile data format unexpected:', profileResponse.data);
        }

        if (projectsResponse.data) {
          setProjects(projectsResponse.data);
        }

      } catch (error) {
        console.error('Error fetching profile data:', error);
        toast.error(error.response?.data?.message || 'Failed to fetch profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchBasicProfileData();
  }, []);

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
              'Authorization': `Bearer ${userData.token}`,
            },
            baseURL: API_URL // Ensure the base URL is set correctly
          });
          setDegreeTypes(degreeResponse.data.data || []);

          // Fetch education data
          const educationResponse = await axios.get(`${API_ENDPOINT}/get/education`, {
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${userData.token}`,
            },
            withCredentials: true,
            baseURL: API_URL // Ensure the base URL is set correctly
          });

          // Process education data to ensure percentage_cgpa is a number and add year_of_passout for school education
          const rawEducationData = educationResponse.data.data || [];
          console.log('Raw education data from API:', rawEducationData);

          const educationData = rawEducationData.map(edu => {
            const degreeTypeId = edu.degree_type_id || (edu.degree_type && edu.degree_type.id);
            const isSchoolEducation = ['1', '2', 1, 2].includes(Number(degreeTypeId));
            
            // Debug logging for year_of_passout
            console.log(`Education ID ${edu.id} - year_of_passout from API:`, edu.year_of_passout);
            
            return {
            ...edu,
              percentage_cgpa: typeof edu.percentage_cgpa === 'string' ? parseFloat(edu.percentage_cgpa) : edu.percentage_cgpa,
              // Use the year_of_passout from database if it exists, otherwise keep it as is
              year_of_passout: edu.year_of_passout || null
            };
          });

          console.log('Processed education data:', educationData);

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
                'Authorization': `Bearer ${userData.token}`,
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

  // Validate all education entries when education tab is opened
  useEffect(() => {
    if (activeMenu === 'education' && formData.education.length > 0 && !hasValidatedEducation) {
      // Clear existing errors first
      setEducationErrors({});
      
      // Validate each education entry
      formData.education.forEach((edu, index) => {
        const degreeTypeId = edu.degree_type_id || (edu.degree_type && edu.degree_type.id);
        const isSchoolEducation = ['1', '2', 1, 2].includes(Number(degreeTypeId));
        
        if (isSchoolEducation && edu.year_of_passout) {
          // Validate school education
          validateEducationSequence(index, degreeTypeId, edu.year_of_passout);
        } else if (!isSchoolEducation && edu.duration_from) {
          // Validate higher education using start year
          const startYear = new Date(edu.duration_from).getFullYear();
          validateEducationSequence(index, degreeTypeId, startYear);
        }
      });
      
      setHasValidatedEducation(true);
    }
  }, [activeMenu, formData.education, hasValidatedEducation]);

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
          'Authorization': `Bearer ${userData.token}`,
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

      // Log the education data to see what we're getting from the API
      // console.log('Education data from API:', response.data.data);

                // Process the education data to ensure percentage_cgpa is a number and handle year_of_passout
          const processedEducation = (response.data.data || []).map(edu => {
            // Debug logging for year_of_passout
            console.log(`fetchEducationData - Education ID ${edu.id} - year_of_passout from API:`, edu.year_of_passout);
            
            return {
              ...edu,
              percentage_cgpa: typeof edu.percentage_cgpa === 'string' ? parseFloat(edu.percentage_cgpa) : edu.percentage_cgpa,
              year_of_passout: edu.year_of_passout || null
            };
          });

      // console.log('Processed education data:', processedEducation);

      setFormData((prev) => ({
        ...prev,
        education: processedEducation,
      }));
      
      // Clear all education validation errors when data is refreshed
      setEducationErrors({});
      setHasValidatedEducation(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load education data');
    }
  };

  // Helper function to validate education sequence and update error state
  // This function ensures that:
  // - 10th standard year of passout is before 12th standard year of passout
  // - 12th standard year of passout is after 10th standard year of passout
  // - Higher education degrees (Bachelors, Masters, etc.) must be after school education
  // - Updates the educationErrors state to show validation errors in the UI
  const validateEducationSequence = (index, degreeTypeId, yearOfPassout) => {
    const errors = [];
    const currentDegreeType = Number(degreeTypeId);
    const currentYear = parseInt(yearOfPassout);
    
    if (currentYear && !isNaN(currentYear)) {
      formData.education.forEach((existingEdu, existingIndex) => {
        if (existingIndex === index) return; // Skip self
        
        const existingDegreeType = Number(existingEdu.degree_type_id || existingEdu.degree_type?.id);
        const existingYear = parseInt(existingEdu.year_of_passout);
        
        if (existingYear && !isNaN(existingYear)) {
          // School education validation (10th and 12th)
          if ([1, 2].includes(currentDegreeType) && [1, 2].includes(existingDegreeType)) {
            if (currentDegreeType === 2 && existingDegreeType === 1 && currentYear <= existingYear) {
              errors.push('12th standard year of passout must be after 10th standard year of passout');
            } else if (currentDegreeType === 1 && existingDegreeType === 2 && currentYear >= existingYear) {
              errors.push('10th standard year of passout must be before 12th standard year of passout');
            }
          }
          
          // Higher education must be after school education
          if (![1, 2].includes(currentDegreeType) && [1, 2].includes(existingDegreeType)) {
            // Current is higher education, existing is school education
            // For higher education, we need to check if it starts after school education is completed
            const currentEducation = formData.education[index];
            if (currentEducation && currentEducation.duration_from) {
              const startYear = new Date(currentEducation.duration_from).getFullYear();
              if (startYear <= existingYear) {
                errors.push('Higher education must start after school education is completed');
              }
            }
          } else if ([1, 2].includes(currentDegreeType) && ![1, 2].includes(existingDegreeType)) {
            // Current is school education, existing is higher education
            // School education should be completed before higher education starts
            if (existingEdu.duration_from) {
              const higherEdStartYear = new Date(existingEdu.duration_from).getFullYear();
              if (currentYear >= higherEdStartYear) {
                errors.push('School education must be completed before higher education starts');
              }
            }
          }
          
          // Higher education sequence validation
          if (![1, 2].includes(currentDegreeType) && ![1, 2].includes(existingDegreeType)) {
            // Both are higher education - ensure logical progression
            const currentEducation = formData.education[index];
            if (currentEducation && currentEducation.duration_from && existingEdu.duration_from) {
              const currentStartYear = new Date(currentEducation.duration_from).getFullYear();
              const existingStartYear = new Date(existingEdu.duration_from).getFullYear();
              if (currentStartYear <= existingStartYear) {
                errors.push('Higher education degrees must start in chronological order');
              }
            }
          }
        }
      });
    }
    
    // Update error state
    setEducationErrors(prev => ({
      ...prev,
      [index]: errors
    }));
    
    return errors;
  };

  const validateEducationData = (data, allEducation = []) => {
    const errors = [];
    if (!data.degree_type_id) errors.push('Degree type is required');
    if (!data.institute_name) errors.push('Institute name is required');
    
    // Check if it's school education (10th or 12th)
    const isSchoolEducation = ['1', '2', 1, 2].includes(Number(data.degree_type_id));
    
    if (isSchoolEducation) {
      if (!data.year_of_passout) errors.push('Year of passout is required');
      if (data.year_of_passout && (isNaN(data.year_of_passout) || data.year_of_passout < 1950 || data.year_of_passout > new Date().getFullYear() + 1)) {
        errors.push('Year of passout must be a valid year between 1950 and ' + (new Date().getFullYear() + 1));
      }
      
      // Validate logical sequence for school education
      if (data.year_of_passout && allEducation.length > 0) {
        const currentDegreeType = Number(data.degree_type_id);
        const currentYear = parseInt(data.year_of_passout);
        
        // Check against existing education entries
        allEducation.forEach(existingEdu => {
          if (existingEdu.id === data.id) return; // Skip self-comparison for updates
          
          const existingDegreeType = Number(existingEdu.degree_type_id || existingEdu.degree_type?.id);
          const existingYear = parseInt(existingEdu.year_of_passout);
          
          // Get existing education end year (for higher education, use duration_to year)
          let existingEndYear = existingYear;
          if (![1, 2].includes(existingDegreeType) && existingEdu.duration_to) {
            existingEndYear = new Date(existingEdu.duration_to).getFullYear();
          }
          
          if (existingEndYear && !isNaN(existingEndYear)) {
            // School education validation (10th and 12th)
            if ([1, 2].includes(existingDegreeType) && existingYear && !isNaN(existingYear)) {
              // 10th standard (degree_type_id = 1) should be before 12th standard (degree_type_id = 2)
              if (currentDegreeType === 2 && existingDegreeType === 1) {
                // Current is 12th, existing is 10th - 12th should be after 10th
                if (currentYear <= existingYear) {
                  errors.push('12th standard year of passout must be after 10th standard year of passout');
                }
              } else if (currentDegreeType === 1 && existingDegreeType === 2) {
                // Current is 10th, existing is 12th - 10th should be before 12th
                if (currentYear >= existingYear) {
                  errors.push('10th standard year of passout must be before 12th standard year of passout');
                }
              }
            }
            
            // Higher education must be after school education
            if (![1, 2].includes(existingDegreeType)) {
              if (existingEdu.duration_from) {
                const higherEdStartYear = new Date(existingEdu.duration_from).getFullYear();
                if (currentYear >= higherEdStartYear) {
                  errors.push('School education must be completed before higher education starts');
                }
              }
            }
          }
        });
      }
    } else {
    if (!data.duration_from) errors.push('Start date is required');
    if (!data.duration_to) errors.push('End date is required');
      
      // Validate that duration_to is after duration_from
      if (data.duration_from && data.duration_to) {
        const fromDate = new Date(data.duration_from);
        const toDate = new Date(data.duration_to);
        
        if (fromDate >= toDate) {
          errors.push('End date must be after start date');
        }
      }
      
      // Validate logical sequence for higher education
      if (data.duration_from && allEducation.length > 0) {
        const currentStartYear = new Date(data.duration_from).getFullYear();
        
        // Check against existing education entries
        allEducation.forEach(existingEdu => {
          if (existingEdu.id === data.id) return; // Skip self-comparison for updates
          
          const existingDegreeType = Number(existingEdu.degree_type_id || existingEdu.degree_type?.id);
          const existingYear = parseInt(existingEdu.year_of_passout);
          
          if (existingYear && !isNaN(existingYear)) {
            // Higher education must be after school education
            if ([1, 2].includes(existingDegreeType)) {
              if (currentStartYear <= existingYear) {
                errors.push('Higher education must start after school education is completed');
              }
            }
            
            // Higher education sequence validation
            if (![1, 2].includes(existingDegreeType)) {
              if (existingEdu.duration_from) {
                const existingStartYear = new Date(existingEdu.duration_from).getFullYear();
                if (currentStartYear <= existingStartYear) {
                  errors.push('Higher education degrees must start in chronological order');
                }
              }
            }
          }
        });
      }
    }
    
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
              // Make sure we're handling the percentage as a number
              if (value === '') {
                transformedValue = '';
              } else {
                const numValue = parseFloat(value);
                if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
                  // Store as a number, not a string
                  transformedValue = numValue;
                  console.log('Percentage value set:', numValue, typeof numValue);
                } else {
                  toast.error('Percentage/CGPA must be between 0 and 100');
                  return updatedData;
                }
              }
              break;
            case 'duration_from':
            case 'duration_to':
              // Directly use the date from the date input which should be in YYYY-MM-DD format
              transformedValue = value;
              break;
            case 'institute_name':
            case 'location':
              // Allow spaces in institute name and location
              transformedValue = value;
              break;
            default:
              transformedValue = value.toString().trim();
          }
        } else if (field === 'certifications') {
          // Keep existing certification handling
          switch(key) {
            case 'certification_date':
              transformedValue = value;
              break;
            case 'certification_name':
            case 'authority':
            case 'certificate_number':
              // Allow spaces in certification fields
              transformedValue = value;
              break;
            default:
              transformedValue = value;
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
    // Check if it's school education (10th or 12th)
    const degreeTypeId = edu.degree_type_id || edu.degree_type?.id;
    const isSchoolEducation = ['1', '2', 1, 2].includes(Number(degreeTypeId));
    
    // Validate the education data first - pass all education data for sequence validation
    const validationErrors = validateEducationData(edu, formData.education);
    if (validationErrors.length > 0) {
      validationErrors.forEach(error => toast.error(error));
      return;
    }

    // Check if all required fields are present
    const requiredFields = {
      degree_type_id: degreeTypeId,
      institute_name: edu.institute_name,
      percentage_cgpa: edu.percentage_cgpa,
      location: edu.location
    };

    // Add duration fields based on education type
    if (isSchoolEducation) {
      requiredFields.year_of_passout = edu.year_of_passout;
    } else {
      requiredFields.duration_from = edu.duration_from;
      requiredFields.duration_to = edu.duration_to;
    }

    // Check if all required fields have values
    const hasAllRequired = Object.values(requiredFields).every(val => val !== undefined && val !== null && val !== '');

    if (hasAllRequired) {
      const educationData = {
        id: edu.id, // This will be undefined for new records
        degree_type_id: degreeTypeId,
        specialization_id: edu.specialization_id || edu.specialization?.id || null,
        other_specialization: edu.other_specialization || null,
        percentage_cgpa: typeof edu.percentage_cgpa === 'number' ? edu.percentage_cgpa : parseFloat(edu.percentage_cgpa || '0'),
        institute_name: edu.institute_name.trim(),
        location: edu.location.trim(),
        duration_from: isSchoolEducation ? null : edu.duration_from,
        duration_to: isSchoolEducation ? null : edu.duration_to,
        year_of_passout: isSchoolEducation ? edu.year_of_passout : null
      };

      // Debug logging
      console.log('Education data being sent:', educationData);
      console.log('Is school education:', isSchoolEducation);
      console.log('Year of passout value:', edu.year_of_passout);

      if (edu.id) {
        // If we have an ID, it's an update
        updateEducation(educationData, index);
      } else {
        // If no ID, it's a new record
        createEducation(educationData, index);
      }
    } else {
      const missingFields = Object.entries(requiredFields)
        .filter(([_, value]) => !value)
        .map(([key]) => key);
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
    }
  };

  const createEducation = async (educationData, index) => {
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

        // Clear validation errors for this education entry
        setEducationErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[index];
          return newErrors;
        });
        setHasValidatedEducation(false);

        // Fetch fresh data to ensure we have the latest state
        await fetchEducationData();
        // Refresh profile completion data
        await fetchProfileCompletion();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add education';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateEducation = async (educationData, index) => {
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

        // Clear validation errors for this education entry
        setEducationErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[index];
          return newErrors;
        });
        setHasValidatedEducation(false);

        // Fetch fresh data to ensure we have the latest state
        await fetchEducationData();
        // Refresh profile completion data
        await fetchProfileCompletion();
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

  // Function to validate LinkedIn URL
  const validateLinkedInUrl = (url) => {
    if (!url || !url.trim()) return 'LinkedIn profile is required';
    
    // Remove whitespace
    const cleanUrl = url.trim();
    
    // LinkedIn URL patterns
    const linkedinPatterns = [
      /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/,
      /^https?:\/\/(www\.)?linkedin\.com\/pub\/[a-zA-Z0-9-]+\/?$/,
      /^https?:\/\/(www\.)?linkedin\.com\/company\/[a-zA-Z0-9-]+\/?$/
    ];
    
    // Check if URL matches any LinkedIn pattern
    const isValidLinkedIn = linkedinPatterns.some(pattern => pattern.test(cleanUrl));
    
    if (!isValidLinkedIn) {
      return 'Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/yourprofile)';
    }
    
    return null; // No error
  };

  const validateDocs = (data) => {
    const errors = [];
    if (!data.aadhaar_number?.trim()) errors.push('Aadhaar number is required');
    if (!data.upload_aadhar && !data.aadhar_path) errors.push('Aadhaar document is required');
    
    // Validate LinkedIn URL
    const linkedinError = validateLinkedInUrl(data.linkedin_profile);
    if (linkedinError) errors.push(linkedinError);
    
    if (!data.passport_photo && !data.passport_photo_path) errors.push('Passport size photo is required');
    return errors;
  };

  const validateParentDetails = (data) => {
    const errors = [];
    if (!data.parent_name?.trim()) errors.push('Parent name is required');
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
    } else if (name === 'linkedin_profile') {
      // Update form data first
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Validate LinkedIn URL in real-time
      if (value.trim()) {
        const error = validateLinkedInUrl(value);
        setLinkedinError(error || '');
      } else {
        setLinkedinError('');
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

      // File size validation
      if (name === 'upload_resume') {
        if (file.size > 10 * 1024 * 1024) { // 10MB limit for resume
          toast.error('Resume file must be less than 10MB');
          return;
        }
        // Validate file type for resume
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type)) {
          toast.error('Resume must be in PDF, DOC, or DOCX format');
          return;
        }
        toast.success('Resume file selected successfully!');
      } else if ((name === 'avatar_url' || name === 'passport_photo') && file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error(`${name === 'avatar_url' ? 'Profile picture' : 'Passport photo'} must be less than 2MB`);
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

      // Auto-save resume when uploaded
      if (name === 'upload_resume') {
        handleResumeUpload(file);
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

      const response = await axios.post(`${API_URL}/profile`, formDataToSend, {
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

  const handleResumeUpload = async (resumeFile) => {
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

      // Only send the resume data
      const jsonData = { resume_update: true };
      formDataToSend.append('data', JSON.stringify(jsonData));

      formDataToSend.append('upload_resume', resumeFile);

      const response = await axios.post(`${API_URL}/profile`, formDataToSend, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${userData.token}`,
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      if (response.data.success) {
        toast.success('Resume uploaded successfully!');
        if (response.data.user && response.data.user.upload_resume) {
          // Update the formData with the response from the server
          setFormData(prev => ({
            ...prev,
            upload_resume: null, // Clear the File object since we now have the path
            resume_path: response.data.user.upload_resume,
            upload_resume_path: response.data.user.upload_resume // Also set this for compatibility
          }));
          console.log('Resume uploaded successfully. Path:', response.data.user.upload_resume);
        }
        // Refresh profile completion data
        await fetchProfileCompletion();
      } else {
        throw new Error(response.data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Resume upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload resume');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFile = async (fieldName) => {
    if (fieldName === 'upload_resume') {
      // Handle resume deletion from backend
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/profile/resume`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();

        if (result.success) {
          toast.success('Resume deleted successfully');
          // Update local state to remove resume
          setFormData(prev => ({
            ...prev,
            upload_resume: null,
            resume_path: null,
            upload_resume_path: null
          }));
          // Refresh profile completion data
          await fetchProfileCompletion();
        } else {
          toast.error(result.message || 'Failed to delete resume');
        }
      } catch (error) {
        console.error('Error deleting resume:', error);
        toast.error('Failed to delete resume');
      }
    } else {
      // Handle other file removals (existing logic)
    setFormData(prev => ({
      ...prev,
      [fieldName]: null
    }));
    }
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
    
    // Validate LinkedIn URL
    const linkedinError = validateLinkedInUrl(data.linkedin_profile);
    if (linkedinError) errors.push(linkedinError);
    
    if (!data.passport_photo && !data.passport_photo_path) errors.push('Passport size photo is required');

    // Parent Details
    if (!data.parent_name?.trim()) errors.push('Parent name is required');
    if (!data.parent_aadhar?.trim()) errors.push('Parent Aadhaar is required');
    if (!data.parent_occupation?.trim()) errors.push('Parent occupation is required');
    if (!data.residential_address?.trim()) errors.push('Residential address is required');

    return errors;
  };

  // Save functions for individual tabs
  const saveBasicDetails = async () => {
    try {
      const errors = validateBasicDetails(formData);
      if (errors.length > 0) {
        errors.forEach(error => toast.error(error));
        return;
      }

      setLoading(true);
      const userInfo = getCookie("user_info");
      const userData = userInfo ? JSON.parse(userInfo) : null;

      if (!userData?.token) {
        toast.error('User authentication required');
        return;
      }

      const formDataToSend = new FormData();
      const jsonData = {
        name: formData.name?.trim(),
        email: formData.email?.trim().toLowerCase(),
        gender: formData.gender,
        birthday: formData.birthday,
        registration_number: formData.registration_number,
        domain_id: formData.domain_id,
        country_code: formData.country_code,
        phone: formData.phone
      };

      formDataToSend.append('data', JSON.stringify(jsonData));

      const response = await axios.post(`${API_URL}/profile`, formDataToSend, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${userData.token}`,
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      if (response.data.success) {
        setSuccess('Basic details updated successfully!');
        toast.success('Basic details updated successfully!');
        if (response.data.user) {
          setFormData(prev => ({
            ...prev,
            ...response.data.user
          }));
        }
        // Refresh profile completion data
        await fetchProfileCompletion();
      } else {
        throw new Error(response.data.message || 'Update failed');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update basic details');
      toast.error(error.response?.data?.message || 'Failed to update basic details');
    } finally {
      setLoading(false);
    }
  };

  const saveAdditionalDetails = async () => {
    try {
      const errors = validateAdditionalDetails(formData);
      if (errors.length > 0) {
        errors.forEach(error => toast.error(error));
        return;
      }

      setLoading(true);
      const userInfo = getCookie("user_info");
      const userData = userInfo ? JSON.parse(userInfo) : null;

      if (!userData?.token) {
        toast.error('User authentication required');
        return;
      }

      const formDataToSend = new FormData();
      const jsonData = {
        address: formData.address?.trim(),
        city: formData.city?.trim(),
        state_id: formData.state_id,
        pincode: formData.pincode?.trim()
      };

      formDataToSend.append('data', JSON.stringify(jsonData));

      const response = await axios.post(`${API_URL}/profile`, formDataToSend, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${userData.token}`,
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      if (response.data.success) {
        setSuccess('Additional details updated successfully!');
        toast.success('Additional details updated successfully!');
        setLinkedinError(''); // Clear LinkedIn validation error on successful save
        if (response.data.user) {
          setFormData(prev => ({
            ...prev,
            ...response.data.user
          }));
        }
        // Refresh profile completion data
        await fetchProfileCompletion();
      } else {
        throw new Error(response.data.message || 'Update failed');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update additional details');
      toast.error(error.response?.data?.message || 'Failed to update additional details');
    } finally {
      setLoading(false);
    }
  };

  const saveDocs = async () => {
    try {
      const errors = validateDocs(formData);
      if (errors.length > 0) {
        errors.forEach(error => toast.error(error));
        return;
      }

      setLoading(true);
      const userInfo = getCookie("user_info");
      const userData = userInfo ? JSON.parse(userInfo) : null;

      if (!userData?.token) {
        toast.error('User authentication required');
        return;
      }

      const formDataToSend = new FormData();

      // Handle file uploads
      const fileFields = ['upload_aadhar', 'passport_photo'];
      fileFields.forEach(field => {
        if (formData[field] instanceof File) {
          formDataToSend.append(field, formData[field]);
        }
      });

      const jsonData = {
        aadhaar_number: formData.aadhaar_number?.trim(),
        linkedin_profile: formData.linkedin_profile?.trim()
      };

      formDataToSend.append('data', JSON.stringify(jsonData));

      const response = await axios.post(`${API_URL}/profile`, formDataToSend, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${userData.token}`,
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

              if (response.data.success) {
          setSuccess('Documents updated successfully!');
          toast.success('Documents updated successfully!');
          setLinkedinError(''); // Clear LinkedIn validation error on successful save
          if (response.data.user) {
            setFormData(prev => ({
              ...prev,
              ...response.data.user
            }));
          }
          // Refresh profile completion data
          await fetchProfileCompletion();
        } else {
        throw new Error(response.data.message || 'Update failed');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update documents');
      toast.error(error.response?.data?.message || 'Failed to update documents');
    } finally {
      setLoading(false);
    }
  };

  const saveParentDetails = async () => {
    try {
      const errors = validateParentDetails(formData);
      if (errors.length > 0) {
        errors.forEach(error => toast.error(error));
        return;
      }

      setLoading(true);
      const userInfo = getCookie("user_info");
      const userData = userInfo ? JSON.parse(userInfo) : null;

      if (!userData?.token) {
        toast.error('User authentication required');
        return;
      }

      const formDataToSend = new FormData();
      const jsonData = {
        parent_name: formData.parent_name?.trim(),
        parent_email: formData.parent_email?.trim()?.toLowerCase(),
        parent_aadhar: formData.parent_aadhar?.trim(),
        parent_occupation: formData.parent_occupation?.trim(),
        residential_address: formData.residential_address?.trim()
      };

      formDataToSend.append('data', JSON.stringify(jsonData));

      const response = await axios.post(`${API_URL}/profile`, formDataToSend, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${userData.token}`,
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      if (response.data.success) {
        setSuccess('Parent details updated successfully!');
        toast.success('Parent details updated successfully!');
        setLinkedinError(''); // Clear LinkedIn validation error on successful save
        if (response.data.user) {
          setFormData(prev => ({
            ...prev,
            ...response.data.user
          }));
        }
        // Refresh profile completion data
        await fetchProfileCompletion();
      } else {
        throw new Error(response.data.message || 'Update failed');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update parent details');
      toast.error(error.response?.data?.message || 'Failed to update parent details');
    } finally {
      setLoading(false);
    }
  };

  // Update the handleSubmit function (for backward compatibility)
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

      const response = await axios.post(`${API_URL}/profile`, formDataToSend, {
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
        setLinkedinError(''); // Clear LinkedIn validation error on successful save
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
        // Refresh profile completion data
        await fetchProfileCompletion();
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


      formData.append('certificate_number', cert.certificate_number);

      if (cert.certificate_file) {
        formData.append('certificate_file', cert.certificate_file);
      }

      const url = cert.id
        ? `${API_URL}/certifications/${cert.id}`
        : `${API_URL}/certifications`;

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

        // Refresh profile completion data
        await fetchProfileCompletion();

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
                <DatePicker
                  selected={formData.birthday ? parseISO(formData.birthday) : null}
                  onChange={date => {
                    setFormData(prev => ({
                      ...prev,
                      birthday: date ? format(date, 'yyyy-MM-dd') : ''
                    }));
                  }}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="DD/MM/YYYY"
                  className="w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  required
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                type="button"
                onClick={saveBasicDetails}
                disabled={loading}
                className="px-4 py-2 text-white rounded-lg transition-colors hover:opacity-90"
                style={{
                  background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)'
                }}
              >
                {loading ? 'Saving...' : 'Save Basic Details'}
              </button>
              <button
                type="button"
                onClick={() => toggleSubTab('additional')}
                className={`px-4 py-2 text-white rounded-lg transition-colors ${
                  !formData.name?.trim() || !formData.email?.trim() || !formData.gender || !formData.birthday
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'hover:opacity-90'
                }`}
                style={{
                  background: !formData.name?.trim() || !formData.email?.trim() || !formData.gender || !formData.birthday
                    ? '#9ca3af'
                    : 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)'
                }}
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
                  {states.map(state => (
                    <option key={state.id} value={state.id}>{state.name}</option>
                  ))}
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
                onClick={saveAdditionalDetails}
                disabled={loading}
                className="px-4 py-2 text-white rounded-lg transition-colors hover:opacity-90"
                style={{
                  background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)'
                }}
              >
                {loading ? 'Saving...' : 'Save Additional Details'}
              </button>
              <button
                type="button"
                onClick={() => toggleSubTab('docs')}
                className={`px-4 py-2 text-white rounded-lg transition-colors ${
                  !formData.address?.trim() || !formData.city?.trim() || !formData.state_id || !formData.pincode?.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'hover:opacity-90'
                }`}
                style={{
                  background: !formData.address?.trim() || !formData.city?.trim() || !formData.state_id || !formData.pincode?.trim()
                    ? '#9ca3af'
                    : 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)'
                }}
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
                    <label className="cursor-pointer text-white px-4 py-2 rounded-lg transition-colors" style={{background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)'}}>
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
                  className={`w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 ${
                    linkedinError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
                  }`}
                  placeholder="https://linkedin.com/in/yourprofile"
                  required
                />
                {linkedinError && (
                  <p className="mt-1 text-xs text-red-500">{linkedinError}</p>
                )}
                {formData.linkedin_profile && !linkedinError && (
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
                <p className="mt-1 text-xs text-gray-500">Enter your full LinkedIn profile URL (e.g., https://linkedin.com/in/yourprofile)</p>
              </div>

              <div className="flex flex-col h-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Passport Size Photo<span className="text-red-500">*</span>
                </label>
                <div className="flex items-center space-x-4">
                  <label className="cursor-pointer text-white px-4 py-2 rounded-lg transition-colors" style={{background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)'}}>
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


            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                type="button"
                onClick={saveDocs}
                disabled={loading}
                className="px-4 py-2 text-white rounded-lg transition-colors hover:opacity-90"
                style={{
                  background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)'
                }}
              >
                {loading ? 'Saving...' : 'Save Documents'}
              </button>
              <button
                type="button"
                onClick={() => toggleSubTab('parent')}
                className={`px-4 py-2 text-white rounded-lg transition-colors ${
                  !formData.aadhaar_number?.trim() ||
                  (!formData.upload_aadhar && !formData.aadhar_path) ||
                  !formData.linkedin_profile?.trim() ||
                  linkedinError ||
                  (!formData.passport_photo && !formData.passport_photo_path) ||
                  (!formData.upload_resume && !formData.resume_path)
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'hover:opacity-90'
                }`}
                style={{
                  background: !formData.aadhaar_number?.trim() ||
                    (!formData.upload_aadhar && !formData.aadhar_path) ||
                    !formData.linkedin_profile?.trim() ||
                    linkedinError ||
                    (!formData.passport_photo && !formData.passport_photo_path)
                    ? '#9ca3af'
                    : 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)'
                }}
                disabled={
                  !formData.aadhaar_number?.trim() ||
                  (!formData.upload_aadhar && !formData.aadhar_path) ||
                  !formData.linkedin_profile?.trim() ||
                  linkedinError ||
                  (!formData.passport_photo && !formData.passport_photo_path)
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
                  Parent Email
                </label>
                <input
                  type="email"
                  name="parent_email"
                  value={formData.parent_email || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
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
                onClick={saveParentDetails}
                disabled={loading}
                className="px-4 py-2 text-white rounded-lg transition-colors hover:opacity-90"
                style={{
                  background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)'
                }}
              >
                {loading ? 'Saving...' : 'Save Parent Details'}
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
                          const newDegreeId = e.target.value;
                          handleItemChange('education', index, 'degree_type_id', newDegreeId);
                          
                          // Only fetch specializations for higher education
                          const isNewSchoolEducation = ['1', '2', 1, 2].includes(Number(newDegreeId));
                          if (!isNewSchoolEducation) {
                            fetchSpecializations(newDegreeId);
                            // Clear year_of_passout for higher education
                            handleItemChange('education', index, 'year_of_passout', '');
                            
                            // Validate duration sequence when changing to higher education
                            if (edu.duration_to) {
                              const endYear = new Date(edu.duration_to).getFullYear();
                              validateEducationSequence(index, newDegreeId, endYear);
                            }
                          } else {
                            // Clear specialization fields for school education
                            handleItemChange('education', index, 'specialization_id', '');
                            handleItemChange('education', index, 'other_specialization', '');
                            // Clear duration fields for school education
                            handleItemChange('education', index, 'duration_from', '');
                            handleItemChange('education', index, 'duration_to', '');
                            
                            // Validate year sequence when changing to school education
                            validateEducationSequence(index, newDegreeId, edu.year_of_passout);
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
                            {/* Only show ECE, EEE, and Others options */}
                            {specializations
                              .filter(spec => {
                                const name = spec.name.toLowerCase();
                                return name.includes('electronics and communication') || 
                                       name.includes('ece') ||
                                       name.includes('electrical and electronics') || 
                                       name.includes('eee');
                              })
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

                    {isSchoolEducation ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Year of Passout<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          min="1950"
                          max={new Date().getFullYear() + 1}
                          value={edu.year_of_passout || ''}
                          onChange={(e) => {
                            const year = e.target.value;
                            handleItemChange('education', index, 'year_of_passout', year);
                            // Set duration_from and duration_to based on year for school education
                            if (year) {
                              handleItemChange('education', index, 'duration_from', `${year}-06-01`);
                              handleItemChange('education', index, 'duration_to', `${year}-05-31`);
                            }
                            
                            // Real-time validation for year sequence
                            validateEducationSequence(index, edu.degree_type_id, year);
                          }}
                          className={`w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 ${
                            educationErrors[index] && educationErrors[index].length > 0 ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
                          }`}
                          placeholder="Enter year (e.g., 2023)"
                          required
                        />
                        {educationErrors[index] && educationErrors[index].length > 0 && (
                          <div className="mt-1">
                            {educationErrors[index].map((error, errorIndex) => (
                              <p key={errorIndex} className="text-xs text-red-500">{error}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration From<span className="text-red-500">*</span>
                      </label>
                      <DatePicker
                        selected={edu.duration_from ? parseISO(edu.duration_from) : null}
                        onChange={date => {
                          const formattedDate = date ? format(date, 'yyyy-MM-dd') : '';
                          handleItemChange('education', index, 'duration_from', formattedDate);
                          
                          // Real-time validation for higher education sequence
                          if (formattedDate) {
                            const startYear = date.getFullYear();
                            validateEducationSequence(index, edu.degree_type_id, startYear);
                          }
                        }}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="DD/MM/YYYY"
                        className={`w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 ${
                          educationErrors[index] && educationErrors[index].length > 0 ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
                        }`}
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        required
                      />
                      {educationErrors[index] && educationErrors[index].length > 0 && (
                        <div className="mt-1">
                          {educationErrors[index].map((error, errorIndex) => (
                            <p key={errorIndex} className="text-xs text-red-500">{error}</p>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration To<span className="text-red-500">*</span>
                      </label>
                      <DatePicker
                        selected={edu.duration_to ? parseISO(edu.duration_to) : null}
                        onChange={date => {
                          const formattedDate = date ? format(date, 'yyyy-MM-dd') : '';
                          handleItemChange('education', index, 'duration_to', formattedDate);
                          
                          // Real-time validation for higher education sequence
                          if (formattedDate) {
                            const endYear = date.getFullYear();
                            validateEducationSequence(index, edu.degree_type_id, endYear);
                          }
                        }}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="DD/MM/YYYY"
                        className={`w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 ${
                          educationErrors[index] && educationErrors[index].length > 0 ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
                        }`}
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        required
                      />
                      {educationErrors[index] && educationErrors[index].length > 0 && (
                        <div className="mt-1">
                          {educationErrors[index].map((error, errorIndex) => (
                            <p key={errorIndex} className="text-xs text-red-500">{error}</p>
                          ))}
                        </div>
                      )}
                    </div>
                      </>
                    )}

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
                        onChange={(e) => {
                          console.log('Percentage input value:', e.target.value, typeof e.target.value);
                          handleItemChange('education', index, 'percentage_cgpa', e.target.value);
                        }}
                        onBlur={() => {
                          console.log('Current percentage value after blur:', edu.percentage_cgpa, typeof edu.percentage_cgpa);
                        }}
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
                          className="px-4 py-2 text-white rounded-lg transition-colors hover:opacity-90"
                          style={{
                            background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)'
                          }}
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
                className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors hover:opacity-90"
                style={{
                  background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)'
                }}
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
                    style={{ 
                      background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                      color: 'white',
                      fontFamily: '"Poppins", "Poppins-Medium", sans-serif'
                    }}
                  >
                    <FiPlus className="add-project-btn-icon" />
                    Add Your First Project
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
                            <h4 className="project-card-section-title" style={{
                              background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              backgroundClip: 'text'
                            }}>Project Type</h4>
                            <div>
                              {project.project_type && (
                                <span className="project-card-tag" style={{
                                  background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                                  color: 'white',
                                  padding: '0.25rem 0.75rem',
                                  borderRadius: '0.375rem',
                                  fontSize: '0.875rem',
                                  fontWeight: 500
                                }}>
                                  {project.project_type}
                                </span>
                              )}
                              {project.is_ongoing && (
                                <span className="project-card-tag" style={{
                                  background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                                  color: 'white',
                                  padding: '0.25rem 0.75rem',
                                  borderRadius: '0.375rem',
                                  fontSize: '0.875rem',
                                  fontWeight: 500,
                                  marginLeft: '0.5rem'
                                }}>
                                  Ongoing
                                </span>
                              )}
                            </div>
                          </div>

                          {project.organization && (
                            <div className="project-card-section">
                              <h4 className="project-card-section-title" style={{
                                background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                              }}>Organization</h4>
                              <p className="project-card-section-content">{project.organization}</p>
                            </div>
                          )}

                          {project.key_achievements && (
                            <div className="project-card-section">
                              <h4 className="project-card-section-title" style={{
                                background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                              }}>Key Achievements</h4>
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
                    style={{ 
                      background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                      color: 'white',
                      fontFamily: '"Poppins", "Poppins-Medium", sans-serif'
                    }}
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
            <div className="flex justify-end mb-6">
              <button
                onClick={() => handleAddItem('certifications')}
                className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors hover:opacity-90"
                style={{
                  background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)'
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Certificate
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
                      <label className="cursor-pointer text-white px-4 py-2 rounded-lg transition-colors" style={{background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)'}}>
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
                        className="px-4 py-2 text-white rounded-lg transition-colors hover:opacity-90"
                        style={{
                          background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)'
                        }}
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
      case 'resume-upload':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-8">
              <div className="text-center space-y-4">
                
                {/* Current Resume Display */}
                {(formData.upload_resume || formData.resume_path) && (
                  <div className="mt-8 bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Current Resume</h3>
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <AiOutlineFilePdf className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {formData.upload_resume instanceof File 
                              ? formData.upload_resume.name 
                              : 'Resume.pdf'
                            }
                          </p>
                          <p className="text-sm text-gray-500">
                            {formData.upload_resume instanceof File 
                              ? `${(formData.upload_resume.size / 1024 / 1024).toFixed(2)} MB`
                              : 'Uploaded resume'
                            }
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const url = getDocumentUrl(formData.upload_resume || formData.resume_path || formData.upload_resume_path);
                            console.log('Resume URL:', url);
                            console.log('Resume path data:', {
                              upload_resume: formData.upload_resume,
                              resume_path: formData.resume_path,
                              upload_resume_path: formData.upload_resume_path
                            });
                            console.log('API_URL:', API_URL);
                            if (!url) {
                              toast.error('Resume file not found');
                            } else {
                              const fileName = formData.upload_resume instanceof File 
                                ? formData.upload_resume.name 
                                : 'Resume.pdf';
                              openPdfViewer(url, fileName);
                            }
                          }}
                          className="px-3 py-1.5 text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-sm font-medium"
                        >
                          <FiEye className="w-4 h-4 inline mr-1" />
                          View
                        </button>
                        <button
                          onClick={() => handleRemoveFile('upload_resume')}
                          className="px-3 py-1.5 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                        >
                          <FiTrash2 className="w-4 h-4 inline mr-1" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Upload New Resume */}
                <div className="mt-8">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                      <AiOutlineFilePdf className="w-8 h-8 text-orange-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Upload New Resume</h3>
                    <p className="text-gray-600 mb-4">
                      Supported formats: PDF, DOC, DOCX (Max size: 10MB)
                    </p>
                    <label className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 text-white rounded-lg transition-colors hover:opacity-90"
                           style={{
                             background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)'
                           }}>
                      <input
                        type="file"
                        name="upload_resume"
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                      />
                      <FiPlus className="w-5 h-5" />
                      Choose Resume File
                    </label>
                  </div>
                </div>



                {/* Save Button */}
                {formData.upload_resume && (
                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={() => handleResumeUpload(formData.upload_resume)}
                      className="px-6 py-3 text-white rounded-lg transition-colors hover:opacity-90"
                      style={{
                        background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)'
                      }}
                    >
                      Save Resume
                    </button>
                  </div>
                )}
              </div>
            </div>
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
        return path;
      }

      // Get the base URL without /api for storage files
      const baseUrl = API_URL.replace('/api', '');

      // For relative paths stored in the database
      // If path contains "avatars/" without a leading slash
      if (path.includes('avatars/') && !path.startsWith('/')) {
        return `${baseUrl}/storage/${path}`;
      }

      // If path contains "resumes/" without a leading slash
      if (path.includes('resumes/') && !path.startsWith('/')) {
        return `${baseUrl}/storage/${path}`;
      }

      // If path starts with "/storage/"
      if (path.startsWith('/storage/')) {
        return `${baseUrl}${path}`;
      }

      // Default case - assume it's a relative path
      return `${baseUrl}/storage/${path}`;
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

      await axios.delete(`${API_URL}/certifications/${cert.id}`, {
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

      // Refresh profile completion data
      await fetchProfileCompletion();
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
        url: `${API_URL}/delete/education`,
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
        // Refresh profile completion data
        await fetchProfileCompletion();
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

      let url = `${API_URL}/projects`;
      let method = 'post';
      let requestData = projectData;

      if (editingProject) {
        url = `${API_URL}/projects/${editingProject.id}`;
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
        // Refresh profile completion data
        await fetchProfileCompletion();
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

      const response = await axios.delete(`${API_URL}/projects/${projectToDelete}`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${userData.token}`
        }
      });

      if (response.data.success) {
        toast.success('Project deleted successfully');
        // Fetch updated projects list
        await fetchProjects();
        // Refresh profile completion data
        await fetchProfileCompletion();
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
              <Text style={styles.sectionTitle}>Certifications/Achievements</Text>
              {data.certifications.map((cert, index) => (
                <View key={index} style={{ marginBottom: 10 }}>
                  <Text style={styles.itemTitle}>{cert.certification_name}</Text>
                  <Text style={styles.itemDetails}>
                    Issued by {cert.authority}
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingFallback />
      </div>
    );
  }

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
                    src={formData.avatar_url}
                    alt="Profile"
                    className="profile-image"
                    onError={(e) => {
                      console.error("Avatar image failed to load:", e);
                      e.target.src = '/images/avatar-placeholder.png';
                      // Clear the invalid avatar URL from formData
                      setFormData(prev => ({
                        ...prev,
                        avatar_url: null
                      }));
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
                  {formData.batch?.name || 'No Batch Assigned'}
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
          </div>

          {/* Profile Completion Bar - Same as Placement Center */}
          <div className="mt-8 bg-white rounded-lg p-6 shadow-sm border-2" style={{
            borderColor: profileCompletionData?.is_complete ? '#4caf50' : '#ff9800'
          }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-gray-800">Profile Completion Status</h3>
                <div className="px-3 py-1.5 rounded-full text-xs font-bold text-white flex items-center gap-1" style={{
                  background: profileCompletionData?.is_complete 
                    ? 'linear-gradient(270deg, #10b981 0%, #059669 100%)'
                    : 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)'
                }}>
                  {profileCompletionData?.is_complete ? (
                    <>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Complete
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Incomplete
                    </>
                  )}
                </div>
              </div>
              <button
                onClick={() => setShowProfileDetails(true)}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                title="View Details"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Overall Progress</span>
                <span className="text-xl font-bold" style={{
                  background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {profileCompletionData?.overall_percentage || 0}%
                </span>
              </div>
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${profileCompletionData?.overall_percentage || 0}%`,
                      background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)'
                    }}
                  />
                </div>
              </div>
            </div>

            {!profileCompletionData?.is_complete && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div className="text-sm text-yellow-800">
                    <strong>Profile completion required:</strong> You need at least 90% profile completion to apply for placements.
                    {profileCompletionData?.missing_sections?.length > 0 && (
                      <span> Missing: {profileCompletionData.missing_sections.join(', ')}</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {profileCompletionData?.is_complete && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div className="text-sm text-green-800">
                    <strong>Profile Complete!</strong> You can now apply for placements.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile Details Modal */}
          {showProfileDetails && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b">
                  <h3 className="text-xl font-semibold text-gray-800">Profile Completion Details</h3>
                  <button
                    onClick={() => setShowProfileDetails(false)}
                    className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profileCompletionData?.sections && Object.entries(profileCompletionData.sections).map(([sectionKey, percentage]) => {
                      const sectionName = sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1).replace(/([A-Z])/g, ' $1');
                      const isSectionComplete = percentage >= 100;
                      
                      return (
                        <div key={sectionKey} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="text-orange-500">
                              {sectionKey === 'personal' && (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                              )}
                              {sectionKey === 'education' && (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17 1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                                </svg>
                              )}
                              {sectionKey === 'projects' && (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                                </svg>
                              )}
                              {sectionKey === 'certifications' && (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              )}
                              {sectionKey === 'resume' && (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <span className="font-semibold text-gray-800">{sectionName}</span>
                            <div className="px-2 py-1 rounded-full text-xs font-bold text-white" style={{
                              background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)'
                            }}>
                              {percentage}%
                            </div>
                          </div>
                          <div className="relative mb-2">
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className="h-1.5 rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${percentage}%`,
                                  background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)'
                                }}
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {isSectionComplete ? (
                              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                            )}
                            <span className="text-sm text-gray-600">
                              {isSectionComplete ? 'Complete' : 'Incomplete'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="flex justify-end p-6 border-t">
                  <button
                    onClick={() => setShowProfileDetails(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add ResumeModal */}
          <ResumeModal
            show={showResumeModal}
            onClose={() => setShowResumeModal(false)}
            onSelect={setSelectedTemplate}
            selectedTemplate={selectedTemplate}
          />

          {/* Existing menu grid */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
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
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <span className={`main-menu-icon flex-shrink-0 mt-1 ${
                    activeMenu === menu.id ? 'text-white' : ''
                  }`}>
                    {menu.icon}
                  </span>
                  <div className="flex flex-col items-start min-w-0 flex-1">
                    <span className="font-medium text-gray-700 text-sm leading-tight break-words w-full whitespace-normal">{menu.label}</span>
                  </div>
                </div>
                <span className={`main-menu-arrow flex-shrink-0 ${
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
