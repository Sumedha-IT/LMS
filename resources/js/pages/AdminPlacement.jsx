import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { 
    Box, 
    Tabs, 
    Tab, 
    Typography, 
    Paper, 
    Card, 
    CardContent,
    Grid,
    Chip,
    Button,
    Alert,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Snackbar,
    Drawer,
    Avatar,
    Divider,
    IconButton,
    Checkbox,
    FormControlLabel,
    Tooltip,
    InputAdornment,
    FormHelperText,
    List,
    ListItem,
    ListItemText,
    ListItemIcon
} from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    AreaChart,
    Area,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar
} from 'recharts';
import { 
    Work as WorkIcon, 
    Assessment as AssessmentIcon,
    Business as BusinessIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    Search as SearchIcon,
    Close as CloseIcon,
    Group as GroupIcon,
    FilterList as FilterListIcon,
    OpenInNew as OpenInNewIcon,
    Person as PersonIcon,
    Description as DescriptionIcon,
    ArrowBack as ArrowBackIcon,
    Download as DownloadIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    LocationOn as LocationIcon,
    School as SchoolIcon,
    CalendarToday as CalendarIcon,
    LinkedIn as LinkedInIcon,
    Undo as UndoIcon
} from '@mui/icons-material';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { countryStates } from '../utils/jsonData';
import { 
    useGetCompaniesQuery,
    useCreateCompanyMutation,
    useUpdateCompanyMutation,
    useDeleteCompanyMutation,
    useGetJobPostingsQuery,
    useCreateJobPostingMutation,
    useUpdateJobPostingMutation,
    useDeleteJobPostingMutation,
    useGetJobApplicationsQuery,
    useCreateJobApplicationMutation,
    useUpdateJobApplicationMutation,
    useDeleteJobApplicationMutation,
    useGetCoursesQuery
} from '../store/service/user/UserService';
import StudentDashboard from './StudentDashboard';
import axios from 'axios';

function TabPanel({ children, value, index, ...other }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`admin-placement-tabpanel-${index}`}
            aria-labelledby={`admin-placement-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `admin-placement-tab-${index}`,
        'aria-controls': `admin-placement-tabpanel-${index}`,
    };
}

const AdminPlacement = () => {
    
    // Date formatting function for d/m/year format
    const formatDateToDMY = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return format(date, 'dd/MM/yyyy');
        } catch (error) {
            console.error('Error formatting date:', error);
            return dateString;
        }
    };
    
    const { id } = useParams();
    const [tabValue, setTabValue] = useState(0);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [deleteConfirmDialog, setDeleteConfirmDialog] = useState({ open: false, type: '', id: null });
    const [companiesSearch, setCompaniesSearch] = useState('');
    const [applicationsDialog, setApplicationsDialog] = useState({ open: false, jobId: null, jobTitle: '' });

    // Job Filters State
    const [jobFilters, setJobFilters] = useState({
        search: '',
        job_type: '',
        status: '',
        location: '',
        company_id: '',
        course_id: '',
        salary_min: '',
        salary_max: '',
        experience_required: '',
        has_vacancies: false,
        posted_date_from: '',
        posted_date_to: '',
        deadline_from: '',
        deadline_to: ''
    });
    const [showFilters, setShowFilters] = useState(false);

    // API Hooks
    const { data: companies, isLoading: companiesLoading, refetch: refetchCompanies } = useGetCompaniesQuery();
    const { data: jobPostings, isLoading: jobPostingsLoading, refetch: refetchJobPostings } = useGetJobPostingsQuery(jobFilters);
    const { data: jobApplications, isLoading: jobApplicationsLoading, refetch: refetchJobApplications } = useGetJobApplicationsQuery();
    const { data: courses, isLoading: coursesLoading, refetch: refetchCourses } = useGetCoursesQuery();

    // Enhanced job applications with user details
    const [enhancedJobApplications, setEnhancedJobApplications] = useState([]);
    const [loadingEnhancedApplications, setLoadingEnhancedApplications] = useState(false);
    
    // Student Details Modal State
    const [studentDetailsDialog, setStudentDetailsDialog] = useState({ open: false, studentId: null, jobId: null });
    const [selectedStudentData, setSelectedStudentData] = useState(null);
    const [studentJobApplications, setStudentJobApplications] = useState([]);
    const [studentExamResults, setStudentExamResults] = useState([]);
    const [loadingStudentDetails, setLoadingStudentDetails] = useState(false);
    const [studentDetailsError, setStudentDetailsError] = useState(null);
    const [studentDetailsTabValue, setStudentDetailsTabValue] = useState(0);
    
    // Bulk update state
    const [selectedApplications, setSelectedApplications] = useState([]);
    const [bulkUpdateStatus, setBulkUpdateStatus] = useState('');
    const [bulkUpdateDialog, setBulkUpdateDialog] = useState(false);
    const [updatingBulkStatus, setUpdatingBulkStatus] = useState(false);
    
    // Undo functionality state
    const [undoOperations, setUndoOperations] = useState([]);
    const [undoDialog, setUndoDialog] = useState(false);
    const [undoingOperation, setUndoingOperation] = useState(false);
    const [lastUndoKey, setLastUndoKey] = useState(null);

    // Company Details Dialog State
    const [companyDetailsDialog, setCompanyDetailsDialog] = useState({ open: false, company: null });
    
    // Job Posting Details Dialog State
    const [jobPostingDetailsDialog, setJobPostingDetailsDialog] = useState({ open: false, jobPosting: null });
    
    // States for dynamic dropdown
    const [availableStates, setAvailableStates] = useState([]);
    
    // Generate year options for dropdowns
    const currentYear = new Date().getFullYear();
    const yearOptions = [];
    for (let year = currentYear - 10; year <= currentYear + 5; year++) {
        yearOptions.push(year);
    }

    // Mutations
    const [createCompany, { isLoading: creatingCompany }] = useCreateCompanyMutation();
    const [updateCompany, { isLoading: updatingCompany }] = useUpdateCompanyMutation();
    const [deleteCompany, { isLoading: deletingCompany }] = useDeleteCompanyMutation();
    const [createJobPosting, { isLoading: creatingJobPosting }] = useCreateJobPostingMutation();
    const [updateJobPosting, { isLoading: updatingJobPosting }] = useUpdateJobPostingMutation();
    const [deleteJobPosting, { isLoading: deletingJobPosting }] = useDeleteJobPostingMutation();

    // Form states
    const [companyForm, setCompanyForm] = useState({
        name: '',
        description: '',
        website: '',
        company_size: '',
        contact_person: '',
        designation: '',
        contact_email: '',
        contact_phone: '',
        address: '',
        // New fields
        company_address: '',
        city: '',
        state: '',
        country: '',
        contact_person_name: '',
        contact_email_new: '',
        contact_number: '',
        alternate_contact_number: '',
        about_company: '',
        linkedin_url: '',
        social_media_links: '',
        is_active: false
    });

    // Form validation states
    const [companyFormErrors, setCompanyFormErrors] = useState({});
    const [companyFormTouched, setCompanyFormTouched] = useState({});

    // Form validation function
    const validateCompanyForm = (form) => {
        const errors = {};
        
        // Required fields
        if (!form.name?.trim()) {
            errors.name = 'Company name is required';
        } else if (form.name.length < 2) {
            errors.name = 'Company name must be at least 2 characters';
        }

        // Company Address validation
        if (!form.company_address?.trim()) {
            errors.company_address = 'Company address is required';
        }

        // City validation
        if (!form.city?.trim()) {
            errors.city = 'City is required';
        }

        // State validation
        if (!form.state?.trim()) {
            errors.state = 'State is required';
        }

        // Country validation
        if (!form.country?.trim()) {
            errors.country = 'Country is required';
        }

        // Contact Person Name validation (alphabets only)
        if (!form.contact_person_name?.trim()) {
            errors.contact_person_name = 'Contact person name is required';
        } else if (!/^[A-Za-z\s]+$/.test(form.contact_person_name)) {
            errors.contact_person_name = 'Contact person name should contain only alphabets';
        }

        // Contact Email validation
        if (!form.contact_email_new?.trim()) {
            errors.contact_email_new = 'Contact email is required';
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(form.contact_email_new)) {
                errors.contact_email_new = 'Please enter a valid email address';
            }
        }

        // Contact Number validation
        if (!form.contact_number?.trim()) {
            errors.contact_number = 'Contact number is required';
        } else {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(form.contact_number.replace(/[\s\-\(\)]/g, ''))) {
                errors.contact_number = 'Please enter a valid phone number';
            }
        }

        // Alternate Contact Number validation (optional)
        if (form.alternate_contact_number?.trim()) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(form.alternate_contact_number.replace(/[\s\-\(\)]/g, ''))) {
                errors.alternate_contact_number = 'Please enter a valid phone number';
            }
        }

        // About Company validation
        if (!form.about_company?.trim()) {
            errors.about_company = 'About company is required';
        }

        // LinkedIn URL validation (optional)
        if (form.linkedin_url?.trim()) {
            const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
            if (!urlRegex.test(form.linkedin_url)) {
                errors.linkedin_url = 'Please enter a valid LinkedIn URL';
            }
        }

        // Social Media Links validation (optional)
        if (form.social_media_links?.trim()) {
            const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
            if (!urlRegex.test(form.social_media_links)) {
                errors.social_media_links = 'Please enter a valid URL';
            }
        }

        // Email validation (old field)
        if (form.contact_email?.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(form.contact_email)) {
                errors.contact_email = 'Please enter a valid email address';
            }
        }

        // Website validation
        if (form.website?.trim()) {
            const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
            if (!urlRegex.test(form.website)) {
                errors.website = 'Please enter a valid website URL';
            }
        }

        // Phone validation (old field)
        if (form.contact_phone?.trim()) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(form.contact_phone.replace(/[\s\-\(\)]/g, ''))) {
                errors.contact_phone = 'Please enter a valid phone number';
            }
        }

        return errors;
    };

    // Handle form field changes with validation
    const handleCompanyFormChange = (field, value) => {
        const newForm = { ...companyForm, [field]: value };
        setCompanyForm(newForm);
        
        // Mark field as touched
        setCompanyFormTouched({ ...companyFormTouched, [field]: true });
        
        // Validate and update errors
        const errors = validateCompanyForm(newForm);
        setCompanyFormErrors(errors);
    };

    const [jobPostingForm, setJobPostingForm] = useState({
        company_id: '',
        title: '',
        course_id: '',
        requirements: '',
        job_type: 'full_time',
        location: '',
        salary_min: '',
        salary_max: '',
        experience_required: '',
        vacancies: 1,
        status: 'draft',
        application_deadline: '',
        // Eligibility Criteria fields
        btech_year_of_passout_min: '',
        btech_year_of_passout_max: '',
        mtech_year_of_passout_min: '',
        mtech_year_of_passout_max: '',
        btech_percentage_min: '',
        mtech_percentage_min: '',
        skills_required: [],
        additional_criteria: '',
        // New fields from SQL query
        eligible_courses: [],
        specializations: [],
        backlogs_allowed: '',
        training_period_stipend: '',
        bond_service_agreement: '',
        mandatory_original_documents: '',
        recruitment_process_steps: '',
        mode_of_recruitment: '',
        interview_date: '',
        interview_mode: '',
        venue_link: ''
    });

    useEffect(() => {
        // Calculate stats from real data
        const fetchStudentStats = async () => {
            try {
                const userInfo = localStorage.getItem('user_info') || document.cookie.split('; ').find(row => row.startsWith('user_info='))?.split('=')[1];
                const userData = JSON.parse(userInfo);
                const response = await axios.get('/api/students', {
                    headers: { 'Authorization': userData.token }
                });
                const students = response.data.data || [];
                const totalStudents = students.length;
                const placedStudents = students.filter(s => s.placement_status === 'Placed').length;

                const totalCompanies = companies?.length || 0;
                const activeJobs = jobPostings?.data?.filter(job => job.status === 'open').length || 0;
                setStats({
                    totalStudents,
                    placedStudents,
                    activeJobs,
                    totalCompanies
                });
            } catch (err) {
                setStats({
                    totalStudents: 0,
                    placedStudents: 0,
                    activeJobs: jobPostings?.data?.filter(job => job.status === 'open').length || 0,
                    totalCompanies: companies?.length || 0
                });
            } finally {
                setLoading(false);
            }
        };
        if (companies && jobPostings && jobApplications) {
            fetchStudentStats();
        }
    }, [companies, jobPostings, jobApplications]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleOpenDialog = (type, item = null) => {
        setDialogType(type);
        setSelectedItem(item);
        if (item) {
            if (type === 'company') {
                // Convert null values to empty strings to prevent React warnings
                const sanitizedItem = {
                    name: item.name || '',
                    description: item.description || '',
                    website: item.website || '',
                    company_size: item.company_size || '',
                    contact_person: item.contact_person || '',
                    designation: item.designation || '',
                    contact_email: item.contact_email || '',
                    contact_phone: item.contact_phone || '',
                    address: item.address || '',
                    // New fields
                    company_address: item.company_address || '',
                    city: item.city || '',
                    state: item.state || '',
                    country: item.country || '',
                    contact_person_name: item.contact_person_name || '',
                    contact_email_new: item.contact_email_new || '',
                    contact_number: item.contact_number || '',
                    alternate_contact_number: item.alternate_contact_number || '',
                    about_company: item.about_company || '',
                    linkedin_url: item.linkedin_url || '',
                    social_media_links: item.social_media_links || '',
                    is_active: item.is_active || false
                };
                setCompanyForm(sanitizedItem);
                // Set available states for the existing company's country
                if (item.country) {
                    const countryData = countryStates.find(cs => cs.country === item.country);
                    if (countryData) {
                        setAvailableStates(countryData.state);
                    } else {
                        setAvailableStates([]);
                    }
                } else {
                    setAvailableStates([]);
                }
            } else if (type === 'jobPosting') {
                // Merge job posting data with default eligibility criteria fields
                const defaultEligibilityFields = {
                    btech_year_of_passout_min: '',
                    btech_year_of_passout_max: '',
                    mtech_year_of_passout_min: '',
                    mtech_year_of_passout_max: '',
                    btech_percentage_min: '',
                    mtech_percentage_min: '',
                    additional_criteria: '',
                    // New fields from SQL query
                    eligible_courses: [],
                    specializations: [],
                    backlogs_allowed: '',
                    training_period_stipend: '',
                    bond_service_agreement: '',
                    mandatory_original_documents: '',
                    recruitment_process_steps: '',
                    mode_of_recruitment: '',
                    interview_date: '',
                    interview_mode: '',
                    venue_link: ''
                };
                
                // Merge the job posting data with default eligibility fields
                
                // Extract eligibility criteria data if it exists
                const eligibilityData = item || {};
                
                setJobPostingForm({
                    ...defaultEligibilityFields,
                    ...item,
                    // Merge eligibility criteria data
                    btech_year_of_passout_min: eligibilityData.btech_year_of_passout_min || '',
                    btech_year_of_passout_max: eligibilityData.btech_year_of_passout_max || '',
                    mtech_year_of_passout_min: eligibilityData.mtech_year_of_passout_min || '',
                    mtech_year_of_passout_max: eligibilityData.mtech_year_of_passout_max || '',
                    btech_percentage_min: eligibilityData.btech_percentage_min || '',
                    mtech_percentage_min: eligibilityData.mtech_percentage_min || '',
                    additional_criteria: eligibilityData.additional_criteria || '',
                    // Handle new fields - parse JSON if needed
                    eligible_courses: Array.isArray(item.eligible_courses) ? item.eligible_courses : 
                                    (typeof item.eligible_courses === 'string' ? JSON.parse(item.eligible_courses || '[]') : []),
                    specializations: Array.isArray(item.specializations) ? item.specializations : 
                                   (typeof item.specializations === 'string' ? JSON.parse(item.specializations || '[]') : []),
                    backlogs_allowed: item.backlogs_allowed || '',
                    training_period_stipend: item.training_period_stipend || '',
                    bond_service_agreement: item.bond_service_agreement || '',
                    mandatory_original_documents: item.mandatory_original_documents || '',
                    recruitment_process_steps: item.recruitment_process_steps || '',
                    mode_of_recruitment: item.mode_of_recruitment || '',
                    interview_date: item.interview_date || '',
                    interview_mode: item.interview_mode || '',
                    venue_link: item.venue_link || ''
                });
            }
        } else {
            // Reset forms for new items
            if (type === 'company') {
                setCompanyForm({
                    name: '',
                    description: '',
                    website: '',
                    company_size: '',
                    contact_person: '',
                    designation: '',
                    contact_email: '',
                    contact_phone: '',
                    address: '',
                    // New fields
                    company_address: '',
                    city: '',
                    state: '',
                    country: '',
                    contact_person_name: '',
                    contact_email_new: '',
                    contact_number: '',
                    alternate_contact_number: '',
                    about_company: '',
                    linkedin_url: '',
                    social_media_links: '',
                    is_active: false
                });
                // Reset form validation states
                setCompanyFormErrors({});
                setCompanyFormTouched({});
                // Reset available states
                setAvailableStates([]);
            } else if (type === 'jobPosting') {
                setJobPostingForm({
                    company_id: '',
                    title: '',
                    course_id: '',
                    requirements: '',
                    job_type: 'full_time',
                    location: '',
                    salary_min: '',
                    salary_max: '',
                    experience_required: '',
                    vacancies: 1,
                    status: 'draft',
                    application_deadline: '',
                    // Eligibility Criteria fields
                    btech_year_of_passout_min: '',
                    btech_year_of_passout_max: '',
                    mtech_year_of_passout_min: '',
                    mtech_year_of_passout_max: '',
                    btech_percentage_min: '',
                    mtech_percentage_min: '',
                    skills_required: [],
                    additional_criteria: '',
                    // New fields from SQL query
                    eligible_courses: [],
                    specializations: [],
                    backlogs_allowed: '',
                    training_period_stipend: '',
                    bond_service_agreement: '',
                    mandatory_original_documents: '',
                    recruitment_process_steps: '',
                    mode_of_recruitment: '',
                    interview_date: '',
                    interview_mode: '',
                    venue_link: ''
                });
            }
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedItem(null);
    };

    const handleSubmit = async () => {
        try {
            if (dialogType === 'company') {
                if (selectedItem) {
                    await updateCompany({ id: selectedItem.id, payload: companyForm }).unwrap();
                    setSnackbar({ open: true, message: 'Company updated successfully!', severity: 'success' });
                } else {
                    await createCompany(companyForm).unwrap();
                    setSnackbar({ open: true, message: 'Company created successfully!', severity: 'success' });
                }
                refetchCompanies();
            } else if (dialogType === 'jobPosting') {
                if (selectedItem) {
                    await updateJobPosting({ id: selectedItem.id, payload: jobPostingForm }).unwrap();
                    setSnackbar({ open: true, message: 'Job posting updated successfully!', severity: 'success' });
                } else {
                    await createJobPosting(jobPostingForm).unwrap();
                    setSnackbar({ open: true, message: 'Job posting created successfully!', severity: 'success' });
                }
                refetchJobPostings();
            }
            handleCloseDialog();
        } catch (error) {
            setSnackbar({ open: true, message: 'Error: ' + (error.data?.message || error.message), severity: 'error' });
        }
    };

    const handleDelete = async (type, id) => {
        setDeleteConfirmDialog({ open: true, type, id });
    };

    const confirmDelete = async () => {
        const { type, id } = deleteConfirmDialog;
        setDeleteConfirmDialog({ open: false, type: '', id: null });
        
        try {
            if (type === 'company') {
                await deleteCompany(id).unwrap();
                setSnackbar({ open: true, message: 'Company deleted successfully!', severity: 'success' });
                refetchCompanies();
            } else if (type === 'jobPosting') {
                await deleteJobPosting(id).unwrap();
                setSnackbar({ open: true, message: 'Job posting deleted successfully!', severity: 'success' });
                refetchJobPostings();
            }
        } catch (error) {
            setSnackbar({ open: true, message: 'Error: ' + (error.data?.message || error.message), severity: 'error' });
        }
    };

    const cancelDelete = () => {
        setDeleteConfirmDialog({ open: false, type: '', id: null });
    };

    const handleViewCompanyDetails = (company) => {
        setCompanyDetailsDialog({ open: true, company });
    };

    const handleCloseCompanyDetails = () => {
        setCompanyDetailsDialog({ open: false, company: null });
    };

    const handleViewJobPostingDetails = (jobPosting) => {
        setJobPostingDetailsDialog({ open: true, jobPosting });
    };

    const handleCloseJobPostingDetails = () => {
        setJobPostingDetailsDialog({ open: false, jobPosting: null });
    };

    // Function to handle country change and update available states
    const handleCountryChange = (country) => {
        // Update both country and state in a single operation
        const newForm = { ...companyForm, country: country, state: '' };
        setCompanyForm(newForm);
        
        // Mark fields as touched
        setCompanyFormTouched({ ...companyFormTouched, country: true, state: true });
        
        // Validate and update errors
        const errors = validateCompanyForm(newForm);
        setCompanyFormErrors(errors);
        
        // Find states for the selected country
        const countryData = countryStates.find(cs => cs.country === country);
        if (countryData) {
            setAvailableStates(countryData.state);
        } else {
            setAvailableStates([]);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            // Job posting statuses
            case 'active': return 'success';
            case 'open': return 'success';
            case 'draft': return 'warning';
            case 'closed': return 'error';
            case 'on_hold': return 'info';
            
            // Job application statuses
            case 'applied': return 'default';
            case 'shortlisted': return 'info';
            case 'interview_scheduled': return 'warning';
            case 'interviewed': return 'primary';
            case 'selected': return 'success';
            case 'selected_not_joined': return 'warning';
            case 'rejected': return 'error';
            case 'withdrawn': return 'secondary';
            
            default: return 'default';
        }
    };

    const getJobTypeColor = (jobType) => {
        switch (jobType) {
            case 'full_time': return 'primary';
            case 'part_time': return 'secondary';
            case 'internship': return 'info';
            case 'contract': return 'warning';
            default: return 'default';
        }
    };

    // Job Filter Handlers
    const handleApplyJobFilters = () => {
        // The query will automatically refetch when jobFilters state changes
        // No need to manually call refetchJobPostings
    };

    const handleClearJobFilters = () => {
        setJobFilters({
            search: '',
            job_type: '',
            status: '',
            location: '',
            company_id: '',
            course_id: '',
            salary_min: '',
            salary_max: '',
            experience_required: '',
            has_vacancies: false,
            posted_date_from: '',
            posted_date_to: '',
            deadline_from: '',
            deadline_to: ''
        });
        // The query will automatically refetch when jobFilters state changes
    };

    // Function to get applications count for a specific job
    const getApplicationsCount = (jobId) => {
        if (!jobApplications?.data) return 0;
        return jobApplications.data.filter(app => app.job_posting_id === jobId).length;
    };

    // Function to get applications by status for a specific job
    const getApplicationsByStatus = (jobId) => {
        if (!jobApplications?.data) return {};
        const jobApps = jobApplications.data.filter(app => app.job_posting_id === jobId);
        const statusCounts = {};
        jobApps.forEach(app => {
            statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
        });
        return statusCounts;
    };

    // Function to get applications for a specific job with student details
    const getJobApplications = (jobId) => {
        if (!jobApplications?.data) return [];
        return jobApplications.data.filter(app => app.job_posting_id === jobId);
    };

    // Function to handle applications dialog
    const handleApplicationsClick = async (jobId, jobTitle) => {
        setApplicationsDialog({ open: true, jobId, jobTitle });
        await fetchEnhancedJobApplications(jobId);
        await fetchUndoOperations(jobId);
    };

    // Function to close applications dialog
    const handleCloseApplicationsDialog = () => {
        setApplicationsDialog({ open: false, jobId: null, jobTitle: '' });
    };

    const handleStudentDetailsClick = async (studentId, jobId) => {
        try {
        setStudentDetailsDialog({ open: true, studentId, jobId });
        await fetchStudentDetails(studentId);
        } catch (error) {
            console.error('Error in handleStudentDetailsClick:', error);
            setStudentDetailsError('Failed to load student details. Please try again.');
        }
    };

    const handleCloseStudentDetailsDialog = () => {
        setStudentDetailsDialog({ open: false, studentId: null, jobId: null });
        setSelectedStudentData(null);
        setStudentJobApplications([]);
        setStudentExamResults([]);
        setStudentDetailsError(null);
        setStudentDetailsTabValue(0);
    };

    const fetchStudentDetails = async (studentId) => {
        try {
            setLoadingStudentDetails(true);
            setStudentDetailsError(null);
            
            // Get authentication token
            const userInfo = getCookie('user_info');
            const userData = userInfo ? JSON.parse(userInfo) : null;
            
            if (!userData?.token) {
                throw new Error('Authentication required');
            }

            // Fetch basic student data first
            const [
                profileResult,
                applicationsResult,
                examResult
            ] = await Promise.allSettled([
                axios.get(`/api/users/${studentId}?include=course,batches`, {
                    headers: { 'Authorization': `Bearer ${userData.token}` }
                }),
                axios.get(`/api/job-applications?user_id=${studentId}`, {
                    headers: { 'Authorization': `Bearer ${userData.token}` }
                }),
                axios.get(`/api/students/${studentId}/exam-results`, {
                    headers: { 'Authorization': `Bearer ${userData.token}` }
                })
            ]);

            // Extract successful responses or use default values
            const profileResponse = profileResult.status === 'fulfilled' ? profileResult.value : { data: {} };
            const applicationsResponse = applicationsResult.status === 'fulfilled' ? applicationsResult.value : { data: { data: [] } };
            const examResponse = examResult.status === 'fulfilled' ? examResult.value : { data: { data: [] } };

            // Log any failed API calls
            if (profileResult.status === 'rejected') console.error('Profile API failed:', profileResult.reason);
            if (applicationsResult.status === 'rejected') console.error('Applications API failed:', applicationsResult.reason);
            if (examResult.status === 'rejected') console.error('Exam API failed:', examResult.reason);

            // Now fetch education, projects, and certifications for the specific user
            const [
                educationResult,
                projectsResult,
                certificationsResult
            ] = await Promise.allSettled([
                axios.get(`/api/get/education/${studentId}`, {
                    headers: { 'Authorization': `Bearer ${userData.token}` }
                }),
                axios.get(`/api/projects/${studentId}`, {
                    headers: { 'Authorization': `Bearer ${userData.token}` }
                }),
                axios.get(`/api/certifications/${studentId}`, {
                    headers: { 'Authorization': `Bearer ${userData.token}` }
                })
            ]);

            // Extract successful responses or use default values
            const educationResponse = educationResult.status === 'fulfilled' ? educationResult.value : { data: { data: [] } };
            const projectsResponse = projectsResult.status === 'fulfilled' ? projectsResult.value : { data: { projects: [] } };
            const certificationsResponse = certificationsResult.status === 'fulfilled' ? certificationsResult.value : { data: { data: [] } };

            // Log any failed API calls
            if (educationResult.status === 'rejected') console.error('Education API failed:', educationResult.reason);
            if (projectsResult.status === 'rejected') console.error('Projects API failed:', projectsResult.reason);
            if (certificationsResult.status === 'rejected') console.error('Certifications API failed:', certificationsResult.reason);
            
            // Combine all data into a single object
            const combinedStudentData = {
                ...profileResponse.data,
                education: educationResponse.data.data || [],
                projects: projectsResponse.data.projects || [],
                certifications: certificationsResponse.data.data || []
            };
            
            setSelectedStudentData(combinedStudentData);
            setStudentJobApplications(applicationsResponse.data.data || []);
            setStudentExamResults(examResponse.data.data || []);
            
        } catch (err) {
            console.error('Error fetching student details:', err);
            setStudentDetailsError('Failed to load student details: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoadingStudentDetails(false);
        }
    };

    const handleStudentDetailsTabChange = (event, newValue) => {
        setStudentDetailsTabValue(newValue);
    };

    // Bulk update functions
    const handleSelectAllApplications = (event) => {
        if (event.target.checked) {
            setSelectedApplications(enhancedJobApplications.map(app => app.id));
        } else {
            setSelectedApplications([]);
        }
    };

    const handleSelectApplication = (applicationId) => {
        setSelectedApplications(prev => 
            prev.includes(applicationId) 
                ? prev.filter(id => id !== applicationId)
                : [...prev, applicationId]
        );
    };

    const handleBulkStatusUpdate = async () => {
        if (!bulkUpdateStatus || selectedApplications.length === 0) {
            return;
        }

        try {
            setUpdatingBulkStatus(true);
            const userInfo = getCookie('user_info');
            const userData = userInfo ? JSON.parse(userInfo) : null;

            if (!userData?.token) {
                throw new Error('Authentication required');
            }

            const response = await axios.post('/api/job-applications/bulk-update', {
                application_ids: selectedApplications,
                status: bulkUpdateStatus,
                job_posting_id: applicationsDialog.jobId
            }, {
                headers: { 'Authorization': `Bearer ${userData.token}` }
            });

            if (response.data.success) {
                // Store undo key for later use
                setLastUndoKey(response.data.undo_key);
                
                // Refresh the applications list
                await fetchEnhancedJobApplications(applicationsDialog.jobId);
                setSelectedApplications([]);
                setBulkUpdateStatus('');
                setBulkUpdateDialog(false);
                
                // Show success message with undo option
                setSnackbar({
                    open: true,
                    message: `Successfully updated ${selectedApplications.length} application(s) to ${bulkUpdateStatus}. You can undo this action anytime.`,
                    severity: 'success',
                    action: (
                        <Button 
                            color="inherit" 
                            size="small" 
                            onClick={() => setUndoDialog(true)}
                            sx={{ color: 'white' }}
                        >
                            UNDO
                        </Button>
                    )
                });
            }
        } catch (error) {
            console.error('Bulk update error:', error);
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Failed to update applications',
                severity: 'error'
            });
        } finally {
            setUpdatingBulkStatus(false);
        }
    };

    const handleUndoBulkUpdate = async (undoKey = lastUndoKey) => {
        if (!undoKey) return;

        try {
            setUndoingOperation(true);
            const userInfo = getCookie('user_info');
            const userData = userInfo ? JSON.parse(userInfo) : null;

            if (!userData?.token) {
                throw new Error('Authentication required');
            }

            const response = await axios.post('/api/job-applications/undo-bulk-update', {
                undo_key: undoKey
            }, {
                headers: { 'Authorization': `Bearer ${userData.token}` }
            });

            if (response.data.success) {
                // Refresh the applications list
                await fetchEnhancedJobApplications(applicationsDialog.jobId);
                setUndoDialog(false);
                setLastUndoKey(null);
                
                // Show success message
                setSnackbar({
                    open: true,
                    message: `Successfully reverted ${response.data.reverted_count} application(s) to previous status`,
                    severity: 'success'
                });
            }
        } catch (error) {
            console.error('Undo error:', error);
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Failed to undo operation',
                severity: 'error'
            });
        } finally {
            setUndoingOperation(false);
        }
    };

    const fetchUndoOperations = async (jobPostingId) => {
        try {
            const userInfo = getCookie('user_info');
            const userData = userInfo ? JSON.parse(userInfo) : null;

            if (!userData?.token) {
                throw new Error('Authentication required');
            }

            const response = await axios.get(`/api/job-applications/undo-operations/${jobPostingId}`, {
                headers: { 'Authorization': `Bearer ${userData.token}` }
            });

            if (response.data.success) {
                setUndoOperations(response.data.undo_operations);
            }
        } catch (error) {
            console.error('Error fetching undo operations:', error);
        }
    };



    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Helper function to get the proper document URL
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
            const baseUrl = import.meta.env.VITE_APP_API_URL?.replace('/api', '') || 'http://localhost:8000';

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

    const downloadFile = (fileUrl, fileName) => {
        if (!fileUrl) return;
        
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName || 'document';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Function to fetch enhanced job applications with user details
    const fetchEnhancedJobApplications = async (jobId) => {
        try {
            setLoadingEnhancedApplications(true);
            const userInfo = getCookie('user_info');
            const userData = JSON.parse(userInfo);
            
            // Fetch job applications for specific job with user details
            const response = await axios.get(`/api/job-applications?job_posting_id=${jobId}`, {
                headers: { 'Authorization': userData.token }
            });
            
            if (response.data.data) {
                // For each application, fetch user details with batches and course
                const enhancedApplications = await Promise.all(
                    response.data.data.map(async (application) => {
                        try {
                            const userResponse = await axios.get(`/api/students/${application.user_id}`, {
                                headers: { 'Authorization': userData.token }
                            });
                            return {
                                ...application,
                                user: userResponse.data.data || application.user
                            };
                        } catch (err) {
                            console.error('Error fetching user details:', err);
                            return application;
                        }
                    })
                );
                setEnhancedJobApplications(enhancedApplications);
            }
        } catch (err) {
            console.error('Error fetching enhanced job applications:', err);
            setEnhancedJobApplications([]);
        } finally {
            setLoadingEnhancedApplications(false);
        }
    };

    // Helper function to get cookie
    const getCookie = (name) => {
        let cookies = document.cookie.split('; ');
        for (let cookie of cookies) {
            let [key, value] = cookie.split('=');
            if (key === name) {
                return decodeURIComponent(value);
            }
        }
        return null;
    };

    // Function to export applications to Excel with resume files
    const handleExportApplications = async () => {
        try {
            if (!enhancedJobApplications || enhancedJobApplications.length === 0) {
                setSnackbar({
                    open: true,
                    message: 'No applications to export',
                    severity: 'warning'
                });
                return;
            }

            setSnackbar({
                open: true,
                message: 'Preparing export with resume files...',
                severity: 'info'
            });

            // Get authentication token
            const userInfo = getCookie('user_info');
            const userData = userInfo ? JSON.parse(userInfo) : null;
            
            if (!userData?.token) {
                throw new Error('Authentication required');
            }

            // Prepare data for export and download resume files
            const exportData = [];
            const resumeFiles = [];

            for (const application of enhancedJobApplications) {
                const studentName = application.user?.name || 'Unknown';
                const batchName = application.user?.batches?.[0]?.batch_name || 'N/A';
                const courseName = application.user?.course?.name || 'N/A';
                const applicationDate = application.application_date ? 
                    new Date(application.application_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    }) : 'N/A';
                const status = application.status?.replace('_', ' ').toUpperCase() || 'N/A';
                
                let resumeFileName = 'No Resume';
                let resumeFileData = null;

                // Download resume file if available
                if (application.user?.upload_resume) {
                    try {
                        const resumeResponse = await axios.get(
                            `${import.meta.env.VITE_APP_API_URL.replace('/api', '')}/storage/${application.user.upload_resume}`,
                            {
                                headers: { 'Authorization': `Bearer ${userData.token}` },
                                responseType: 'blob'
                            }
                        );
                        
                        // Get file extension from the resume filename
                        const fileExtension = application.user.upload_resume.split('.').pop() || 'pdf';
                        resumeFileName = `${studentName.replace(/[^a-zA-Z0-9]/g, '_')}_Resume.${fileExtension}`;
                        resumeFileData = resumeResponse.data;
                        
                        resumeFiles.push({
                            name: resumeFileName,
                            data: resumeFileData,
                            type: resumeResponse.headers['content-type'] || 'application/pdf'
                        });
                    } catch (resumeError) {
                        console.error('Error downloading resume:', resumeError);
                        resumeFileName = 'Resume Download Failed';
                    }
                }

                exportData.push({
                    'Student Name': studentName,
                    'Batch': batchName,
                    'Course': courseName,
                    'Application Date': applicationDate,
                    'Status': status,
                    'Resume File': resumeFileName
                });
            }

            // Create workbook and worksheet
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(exportData);

            // Set column widths
            const columnWidths = [
                { wch: 25 }, // Student Name
                { wch: 15 }, // Batch
                { wch: 20 }, // Course
                { wch: 15 }, // Application Date
                { wch: 15 }, // Status
                { wch: 30 }  // Resume File
            ];
            worksheet['!cols'] = columnWidths;

            // Add worksheet to workbook
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Job Applications');

            // Generate filename with current date
            const currentDate = new Date().toISOString().split('T')[0];
            const jobTitle = applicationsDialog.jobTitle?.replace(/[^a-zA-Z0-9]/g, '_') || 'Job_Applications';
            const filename = `${jobTitle}_Applications_${currentDate}.xlsx`;

            // Create a ZIP file containing both Excel and resume files
            if (resumeFiles.length > 0) {
                try {
                    // Create a new ZIP file
                    const zip = new JSZip();
                    
                    // Add the Excel file to the ZIP
                    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
                    zip.file(filename, excelBuffer);
                    
                    // Add resume files to a 'resumes' folder in the ZIP
                    const resumesFolder = zip.folder('resumes');
                    resumeFiles.forEach((file) => {
                        resumesFolder.file(file.name, file.data);
                    });
                    
                    // Generate and download the ZIP file
                    const zipBlob = await zip.generateAsync({ type: 'blob' });
                    const zipUrl = URL.createObjectURL(zipBlob);
                    const zipLink = document.createElement('a');
                    zipLink.href = zipUrl;
                    zipLink.download = `${jobTitle}_Applications_${currentDate}.zip`;
                    document.body.appendChild(zipLink);
                    zipLink.click();
                    document.body.removeChild(zipLink);
                    URL.revokeObjectURL(zipUrl);

                    setSnackbar({
                        open: true,
                        message: `✅ Successfully exported ${enhancedJobApplications.length} applications and ${resumeFiles.length} resume files in ZIP format!`,
                        severity: 'success'
                    });
                } catch (zipError) {
                    console.error('Error creating ZIP:', zipError);
                    // Fallback to individual downloads if ZIP fails
                    XLSX.writeFile(workbook, filename);
                    resumeFiles.forEach((file) => {
                        const fileUrl = URL.createObjectURL(file.data);
                        const link = document.createElement('a');
                        link.href = fileUrl;
                        link.download = file.name;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(fileUrl);
                    });
                    
                    setSnackbar({
                        open: true,
                        message: `Exported applications to Excel and resume files individually (ZIP creation failed).`,
                        severity: 'warning'
                    });
                }
            } else {
                // Save the Excel file normally if no resumes
                XLSX.writeFile(workbook, filename);
                setSnackbar({
                    open: true,
                    message: `Successfully exported ${enhancedJobApplications.length} applications to Excel`,
                    severity: 'success'
                });
            }

        } catch (error) {
            console.error('Export error:', error);
            setSnackbar({
                open: true,
                message: 'Failed to export applications. Please try again.',
                severity: 'error'
            });
        }
    };

    const navigate = useNavigate();

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    // Derived filtered companies list for search
    const filteredCompanies = (companies || []).filter((c) => {
        if (!companiesSearch?.trim()) return true;
        const q = companiesSearch.toLowerCase();
        return (
            c.name?.toLowerCase().includes(q) ||
            c.contact_person?.toLowerCase().includes(q) ||
            c.contact_email?.toLowerCase().includes(q)
        );
    });

    return (
        <Box sx={{ width: '100%', p: { xs: 2, md: 3 }, backgroundColor: '#f8f9fa' }}>
            

            {/* Modern Tiles */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                {[{
                    key: 'totalStudents',
                    label: 'Total Students',
                    value: stats?.totalStudents || 0,
                    icon: <GroupIcon sx={{ color: '#fff' }} />,
                }, {
                    key: 'placedStudents',
                    label: 'Placed Students',
                    value: stats?.placedStudents || 0,
                    icon: <AssessmentIcon sx={{ color: '#fff' }} />,
                }, {
                    key: 'activeJobs',
                    label: 'Active Jobs',
                    value: stats?.activeJobs || 0,
                    icon: <WorkIcon sx={{ color: '#fff' }} />,
                }, {
                    key: 'totalCompanies',
                    label: 'Total Companies',
                    value: stats?.totalCompanies || 0,
                    icon: <BusinessIcon sx={{ color: '#fff' }} />,
                }].map((tile, idx) => {
                    const gradient = idx % 2 === 0
                        ? 'linear-gradient(135deg, #0f1f3d 0%, #1e3c72 100%)' // Blue gradient (dashboard)
                        : 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)'; // Orange gradient (dashboard)
                    return (
                    <Grid key={tile.key} item xs={12} md={3}>
                        <Box
                            sx={{
                                position: 'relative',
                                borderRadius: 3,
                                p: 2.5,
                                boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                                background: gradient,
                                color: '#fff',
                                overflow: 'hidden',
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 36, height: 36 }}>
                                    {tile.icon}
                                </Avatar>
                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                    {tile.label}
                                </Typography>
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1 }}>
                                {tile.value}
                            </Typography>
                            <Box
                                sx={{
                                    position: 'absolute',
                                    right: -20,
                                    bottom: -20,
                                    width: 120,
                                    height: 120,
                                    bgcolor: 'rgba(255,255,255,0.08)',
                                    borderRadius: '50%'
                                }}
                            />
                        </Box>
                    </Grid>
                )})}
            </Grid>

            {/* Tabs */}
            <Paper sx={{ width: '100%', borderRadius: 3, boxShadow: 4 }}>
                <Box sx={{ px: 2, pt: 2 }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        aria-label="admin placement tabs"
                        variant="scrollable"
                        scrollButtons="auto"
                        TabIndicatorProps={{ style: { display: 'none' } }}
                        sx={{
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontWeight: 600,
                                mr: 1,
                                borderRadius: 2,
                                minHeight: 40,
                                color: 'text.secondary',
                                backgroundColor: 'rgba(0,0,0,0.04)'
                            },
                            '& .Mui-selected': {
                                color: '#fff !important',
                                background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)'
                            }
                        }}
                    >
                        <Tab
                            icon={<BusinessIcon />}
                            label={`Companies (${stats?.totalCompanies || 0})`}
                            {...a11yProps(0)}
                        />
                        <Tab
                            icon={<WorkIcon />}
                            label={`Job Postings (${stats?.activeJobs || 0})`}
                            {...a11yProps(1)}
                        />
                        <Tab
                            icon={<AssessmentIcon />}
                            label="Reports"
                            {...a11yProps(2)}
                        />
                    </Tabs>
                </Box>

                {/* Tab Panels */}


                <TabPanel value={tabValue} index={1}>
                    <Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                            <Typography variant="h5">Job Postings</Typography>
                            <Box display="flex" gap={1.5} alignItems="center">
                                <TextField
                                    size="small"
                                                                            placeholder=""
                                    value={jobFilters.search || ''}
                                    onChange={(e) => setJobFilters({ ...jobFilters, search: e.target.value })}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon fontSize="small" />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <Button
                                    variant="contained"
                                    startIcon={<FilterListIcon />}
                                    onClick={() => setShowFilters(!showFilters)}
                                    sx={{
                                        textTransform: 'none',
                                        borderRadius: 2,
                                        background: 'linear-gradient(135deg, #0f1f3d 0%, #1e3c72 100%)'
                                    }}
                                >
                                    {showFilters ? 'Hide Filters' : 'Filters'}
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={() => handleOpenDialog('jobPosting')}
                                    sx={{
                                        textTransform: 'none',
                                        borderRadius: 2,
                                        background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)'
                                    }}
                                >
                                    Add Job
                                </Button>
                            </Box>
                        </Box>

                        {/* Filters Section */}
                        {showFilters && (
                            <Paper sx={{ p: 2, mb: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    Filters
                            </Typography>
                            <Grid container spacing={2}>
                                {/* Search Filter */}
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        fullWidth
                                        label="Search"
                                        placeholder=""
                                        value={jobFilters.search || ''}
                                        onChange={(e) => setJobFilters({...jobFilters, search: e.target.value})}
                                        size="small"
                                    />
                                </Grid>

                                {/* Job Type Filter */}
                                <Grid item xs={12} md={3}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Job Type</InputLabel>
                                        <Select
                                            value={jobFilters.job_type || ''}
                                            onChange={(e) => setJobFilters({...jobFilters, job_type: e.target.value})}
                                            label="Job Type"
                                        >
                                            <MenuItem value="">All Types</MenuItem>
                                            <MenuItem value="full_time">Full Time</MenuItem>
                                            <MenuItem value="part_time">Part Time</MenuItem>
                                            <MenuItem value="internship">Internship</MenuItem>
                                            <MenuItem value="contract">Contract</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* Status Filter */}
                                <Grid item xs={12} md={3}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Status</InputLabel>
                                        <Select
                                            value={jobFilters.status || ''}
                                            onChange={(e) => setJobFilters({...jobFilters, status: e.target.value})}
                                            label="Status"
                                        >
                                            <MenuItem value="">All Status</MenuItem>
                                            <MenuItem value="draft">Draft</MenuItem>
                                            <MenuItem value="open">Open</MenuItem>
                                            <MenuItem value="closed">Closed</MenuItem>
                                            <MenuItem value="on_hold">On Hold</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* Location Filter */}
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        fullWidth
                                        label="Location"
                                        placeholder=""
                                        value={jobFilters.location || ''}
                                        onChange={(e) => setJobFilters({...jobFilters, location: e.target.value})}
                                        size="small"
                                    />
                                </Grid>

                                {/* Company Filter */}
                                <Grid item xs={12} md={3}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Company</InputLabel>
                                        <Select
                                            value={jobFilters.company_id || ''}
                                            onChange={(e) => setJobFilters({...jobFilters, company_id: e.target.value})}
                                            label="Company"
                                            disabled={companiesLoading}
                                        >
                                            <MenuItem value="">All Companies</MenuItem>
                                            {companiesLoading ? (
                                                <MenuItem disabled>Loading companies...</MenuItem>
                                            ) : (
                                                companies?.map((company) => (
                                                    <MenuItem key={company.id} value={company.id}>
                                                        {company.name}
                                                    </MenuItem>
                                                ))
                                            )}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* Course Filter */}
                                <Grid item xs={12} md={3}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Course</InputLabel>
                                        <Select
                                            value={jobFilters.course_id || ''}
                                            onChange={(e) => setJobFilters({...jobFilters, course_id: e.target.value})}
                                            label="Course"
                                            disabled={coursesLoading}
                                        >
                                            <MenuItem value="">All Courses</MenuItem>
                                            {coursesLoading ? (
                                                <MenuItem disabled>Loading courses...</MenuItem>
                                            ) : (
                                                courses?.courses?.map((course) => (
                                                    <MenuItem key={course.id} value={course.id}>
                                                        {course.name}
                                                    </MenuItem>
                                                ))
                                            )}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* Salary Range Filters */}
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        fullWidth
                                        label="Min Salary"
                                        type="number"
                                        placeholder=""
                                        value={jobFilters.salary_min || ''}
                                        onChange={(e) => setJobFilters({...jobFilters, salary_min: e.target.value})}
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        fullWidth
                                        label="Max Salary"
                                        type="number"
                                        placeholder=""
                                        value={jobFilters.salary_max || ''}
                                        onChange={(e) => setJobFilters({...jobFilters, salary_max: e.target.value})}
                                        size="small"
                                    />
                                </Grid>

                                {/* Experience Filter */}
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        fullWidth
                                        label="Experience"
                                        placeholder=""
                                        value={jobFilters.experience_required || ''}
                                        onChange={(e) => setJobFilters({...jobFilters, experience_required: e.target.value})}
                                        size="small"
                                    />
                                </Grid>

                                {/* Vacancies Filter */}
                                <Grid item xs={12} md={2}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={jobFilters.has_vacancies || false}
                                                onChange={(e) => setJobFilters({...jobFilters, has_vacancies: e.target.checked})}
                                            />
                                        }
                                        label="Has Vacancies"
                                    />
                                </Grid>

                                {/* Date Range Filters */}
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        fullWidth
                                        label="Posted From"
                                        type="date"
                                        value={jobFilters.posted_date_from || ''}
                                        onChange={(e) => setJobFilters({...jobFilters, posted_date_from: e.target.value})}
                                        size="small"
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        fullWidth
                                        label="Posted To"
                                        type="date"
                                        value={jobFilters.posted_date_to || ''}
                                        onChange={(e) => setJobFilters({...jobFilters, posted_date_to: e.target.value})}
                                        size="small"
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>

                                {/* Action Buttons */}
                                <Grid item xs={12} md={6}>
                                    <Box display="flex" gap={2}>
                            <Button
                                variant="contained"
                                            onClick={handleApplyJobFilters}
                                            startIcon={<SearchIcon />}
                                        >
                                            Apply Filters
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            onClick={handleClearJobFilters}
                                        >
                                            Clear Filters
                            </Button>
                        </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                        )}
                        
                        {jobPostingsLoading ? (
                            <Box display="flex" justifyContent="center" p={3}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            (!jobPostings?.data || jobPostings?.data?.length === 0) ? (
                                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3, boxShadow: 3 }}>
                                    <Typography variant="h6" gutterBottom>No job postings found</Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Create your first job posting to start receiving applications.
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        onClick={() => handleOpenDialog('jobPosting')}
                                        sx={{ mt: 2, textTransform: 'none', borderRadius: 2, background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)' }}
                                    >
                                        Create Job Posting
                                    </Button>
                                </Paper>
                            ) : (
                            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 4 }}>
                                <Table size="small" sx={{
                                    '& tbody tr:hover': { backgroundColor: 'action.hover' },
                                    '& tbody tr:nth-of-type(odd)': { backgroundColor: 'rgba(0,0,0,0.02)' },
                                    '& thead th': { 
                                        background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                                        color: '#fff',
                                        fontWeight: 700,
                                        fontSize: '0.875rem'
                                    }
                                }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Title</TableCell>
                                            <TableCell>Company</TableCell>
                                            <TableCell>Course</TableCell>
                                            <TableCell>Location</TableCell>
                                            <TableCell>Type</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Application Deadline</TableCell>
                                            <TableCell align="center">Applications</TableCell>
                                            <TableCell align="right">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                                                        <TableBody>
                                        {jobPostings?.data?.map((job) => {
                                            const applicationsCount = getApplicationsCount(job.id);
                                            const applicationsByStatus = getApplicationsByStatus(job.id);
                                            
                                            return (
                                                <TableRow 
                                                    key={job.id}
                                                    onClick={applicationsCount > 0 ? () => handleApplicationsClick(job.id, job.title) : undefined}
                                                    sx={{ 
                                                        cursor: applicationsCount > 0 ? 'pointer' : 'default',
                                                        '&:hover': applicationsCount > 0 ? {
                                                            backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                                        } : {},
                                                        transition: 'all 0.2s ease',
                                                        '&:hover .MuiTableCell-root': {
                                                            backgroundColor: 'transparent'
                                                        }
                                                    }}
                                                >
                                                    <TableCell>{job.title}</TableCell>
                                                    <TableCell>{job.company?.name || 'N/A'}</TableCell>
                                                    <TableCell>{job.course?.name || 'N/A'}</TableCell>
                                                    <TableCell>{job.location}</TableCell>
                                                    <TableCell>
                                                        <Chip 
                                                            label={job.job_type} 
                                                            color={getJobTypeColor(job.job_type)} 
                                                            size="small" 
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip 
                                                            label={job.status} 
                                                            color={getStatusColor(job.status)} 
                                                            size="small" 
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        {job.application_deadline ? formatDateToDMY(job.application_deadline) : 'N/A'}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Tooltip title={
                                                            <Box>
                                                                <Typography variant="body2" fontWeight="bold">Applications by Status:</Typography>
                                                                {Object.keys(applicationsByStatus).length > 0 ? (
                                                                    Object.entries(applicationsByStatus).map(([status, count]) => (
                                                                        <Typography key={status} variant="body2">
                                                                            {status.charAt(0).toUpperCase() + status.slice(1)}: {count}
                                                                        </Typography>
                                                                    ))
                                                                ) : (
                                                                    <Typography variant="body2">No applications yet</Typography>
                                                                )}
                                                                {applicationsCount > 0 && (
                                                                    <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                                                                        Click anywhere on row to view details
                                                                    </Typography>
                                                                )}
                                                            </Box>
                                                        }>
                                                            <Box display="flex" alignItems="center" justifyContent="center">
                                                                <Chip 
                                                                    label={applicationsCount}
                                                                    color={applicationsCount > 0 ? 'primary' : 'default'}
                                                                    variant={applicationsCount > 0 ? 'filled' : 'outlined'}
                                                                    size="small"
                                                                    sx={{ 
                                                                        fontWeight: 600,
                                                                        minWidth: 40
                                                                    }}
                                                                />
                                                            </Box>
                                                        </Tooltip>
                                                    </TableCell>
                                                    <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                                                        <Box display="flex" justifyContent="flex-end" gap={0.5}>
                                                            <Tooltip title="View Details">
                                                                <IconButton size="small" color="primary" onClick={() => handleViewJobPostingDetails(job)}>
                                                                    <ViewIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Edit">
                                                                <IconButton size="small" onClick={() => handleOpenDialog('jobPosting', job)}>
                                                                    <EditIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Delete">
                                                                <IconButton size="small" color="error" onClick={() => handleDelete('jobPosting', job.id)}>
                                                                    <DeleteIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            )
                        )}
                    </Box>
                </TabPanel>

                <TabPanel value={tabValue} index={0}>
                    <Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                            <Typography variant="h5">Companies</Typography>
                            <Box display="flex" gap={1.5} alignItems="center">
                                <TextField
                                    size="small"
                                    placeholder="Search companies..."
                                    value={companiesSearch || ''}
                                    onChange={(e) => setCompaniesSearch(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon fontSize="small" />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <Button 
                                    variant="contained" 
                                    startIcon={<AddIcon />}
                                    onClick={() => handleOpenDialog('company')}
                                    sx={{ textTransform: 'none', borderRadius: 2, background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)' }}
                                >
                                    Add Company
                                </Button>
                            </Box>
                        </Box>
                        
                        {companiesLoading ? (
                            <Box display="flex" justifyContent="center" p={3}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            (!filteredCompanies || filteredCompanies.length === 0) ? (
                                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3, boxShadow: 3 }}>
                                    <Typography variant="h6" gutterBottom>No companies found</Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Add a company to begin managing placements.
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        onClick={() => handleOpenDialog('company')}
                                        sx={{ mt: 2, textTransform: 'none', borderRadius: 2, background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)' }}
                                    >
                                        Add Company
                                    </Button>
                                </Paper>
                            ) : (
                            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 4 }}>
                                <Table size="small" sx={{
                                    '& tbody tr:hover': { backgroundColor: 'action.hover' },
                                    '& tbody tr:nth-of-type(odd)': { backgroundColor: 'rgba(0,0,0,0.02)' },
                                    '& thead th': { 
                                        background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                                        color: '#fff',
                                        fontWeight: 700,
                                        fontSize: '0.875rem'
                                    }
                                }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Contact Person</TableCell>
                                            <TableCell>City</TableCell>
                                            <TableCell>Country</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell align="right">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredCompanies.map((company) => (
                                            <TableRow key={company.id}>
                                                <TableCell>{company.name}</TableCell>
                                                <TableCell>{company.contact_person_name || company.contact_person || 'N/A'}</TableCell>
                                                <TableCell>{company.city || 'N/A'}</TableCell>
                                                <TableCell>{company.country || 'N/A'}</TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label={company.is_active ? 'Active' : 'Inactive'} 
                                                        color={company.is_active ? 'success' : 'default'} 
                                                        size="small" 
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Box display="flex" justifyContent="flex-end" gap={0.5}>
                                                        <Tooltip title="View Details">
                                                            <IconButton size="small" color="primary" onClick={() => handleViewCompanyDetails(company)}>
                                                                <ViewIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Edit">
                                                            <IconButton size="small" onClick={() => handleOpenDialog('company', company)}>
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Delete">
                                                            <IconButton size="small" color="error" onClick={() => handleDelete('company', company.id)}>
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            )
                        )}
                    </Box>
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                    <Box>
                        <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
                            📊 Placement Analytics & Reports
                        </Typography>
                        
                        <Grid container spacing={3}>
                            {/* Placement Overview Chart */}
                            <Grid item xs={12} md={6}>
                                <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 3 }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#0f1f3d' }}>
                                            📈 Placement Overview
                                        </Typography>
                                        <Box sx={{ height: 300, mt: 2 }}>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart
                                                    data={[
                                                        {
                                                            name: 'Total Students',
                                                            value: stats?.totalStudents || 0,
                                                            fill: '#0f1f3d'
                                                        },
                                                        {
                                                            name: 'Placed Students',
                                                            value: stats?.placedStudents || 0,
                                                            fill: '#4caf50'
                                                        }
                                                    ]}
                                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="name" />
                                                    <YAxis />
                                                    <RechartsTooltip />
                                                    <Bar dataKey="value" fill="#8884d8" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Application Status Pie Chart */}
                            <Grid item xs={12} md={6}>
                                <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 3 }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#0f1f3d' }}>
                                            📋 Application Status Distribution
                                        </Typography>
                                        <Box sx={{ height: 300, mt: 2 }}>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={(() => {
                                                            const statusCounts = {};
                                                            jobApplications?.data?.forEach(app => {
                                                                statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
                                                            });
                                                            
                                                            return Object.entries(statusCounts).map(([status, count]) => ({
                                                                name: status.replace('_', ' ').toUpperCase(),
                                                                value: count
                                                            }));
                                                        })()}
                                                        cx="50%"
                                                        cy="50%"
                                                        labelLine={false}
                                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                        outerRadius={80}
                                                        fill="#8884d8"
                                                        dataKey="value"
                                                    >
                                                        {(() => {
                                                            const statusColors = ['#2196f3', '#ff9800', '#9c27b0', '#ff5722', '#4caf50', '#f44336', '#9e9e9e'];
                                                            return jobApplications?.data?.map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={statusColors[index % statusColors.length]} />
                                                            ));
                                                        })()}
                                                    </Pie>
                                                    <RechartsTooltip />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Monthly Applications Trend */}
                            <Grid item xs={12} md={8}>
                                <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#0f1f3d' }}>
                                            📈 Monthly Applications Trend
                                        </Typography>
                                        <Box sx={{ height: 300, mt: 2 }}>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart
                                                    data={(() => {
                                                        const monthlyData = {};
                                                        jobApplications?.data?.forEach(app => {
                                                            const date = new Date(app.application_date);
                                                            const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                                                            monthlyData[monthYear] = (monthlyData[monthYear] || 0) + 1;
                                                        });
                                                        
                                                        return Object.entries(monthlyData)
                                                            .sort(([a], [b]) => a.localeCompare(b))
                                                            .map(([month, count]) => ({
                                                                month,
                                                                applications: count
                                                            }));
                                                    })()}
                                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="month" />
                                                    <YAxis />
                                                    <RechartsTooltip />
                                                    <Area type="monotone" dataKey="applications" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Job Postings vs Applications */}
                            <Grid item xs={12} md={4}>
                                <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#0f1f3d' }}>
                                            💼 Job Postings vs Applications
                                        </Typography>
                                        <Box sx={{ height: 300, mt: 2 }}>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart
                                                    data={[
                                                        {
                                                            name: 'Active Jobs',
                                                            value: stats?.activeJobs || 0,
                                                            fill: '#2196f3'
                                                        },
                                                        {
                                                            name: 'Total Applications',
                                                            value: jobApplications?.data?.length || 0,
                                                            fill: '#ff9800'
                                                        },
                                                        {
                                                            name: 'Avg per Job',
                                                            value: stats?.activeJobs > 0 ? Math.round((jobApplications?.data?.length || 0) / stats?.activeJobs) : 0,
                                                            fill: '#4caf50'
                                                        }
                                                    ]}
                                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="name" />
                                                    <YAxis />
                                                    <RechartsTooltip />
                                                    <Bar dataKey="value" fill="#8884d8" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Company Performance Radar Chart */}
                            <Grid item xs={12} md={6}>
                                <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#0f1f3d' }}>
                                            🎯 Placement Performance Metrics
                                        </Typography>
                                        <Box sx={{ height: 300, mt: 2 }}>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <RadarChart
                                                    data={[
                                                        {
                                                            subject: 'Placement Rate',
                                                            A: stats?.totalStudents > 0 ? Math.round((stats?.placedStudents / stats?.totalStudents) * 100) : 0,
                                                            fullMark: 100,
                                                        },

                                                        {
                                                            subject: 'Job Availability',
                                                            A: stats?.activeJobs > 0 ? Math.min(100, (stats?.activeJobs / 10) * 100) : 0,
                                                            fullMark: 100,
                                                        },
                                                        {
                                                            subject: 'Application Rate',
                                                            A: stats?.totalStudents > 0 ? Math.min(100, ((jobApplications?.data?.length || 0) / stats?.totalStudents) * 100) : 0,
                                                            fullMark: 100,
                                                        },
                                                        {
                                                            subject: 'Success Rate',
                                                            A: jobApplications?.data?.length > 0 ? Math.round(((jobApplications?.data?.filter(app => app.status === 'selected').length) / jobApplications?.data?.length) * 100) : 0,
                                                            fullMark: 100,
                                                        },
                                                    ]}
                                                >
                                                    <PolarGrid />
                                                    <PolarAngleAxis dataKey="subject" />
                                                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                                    <Radar name="Performance" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                                                    <RechartsTooltip />
                                                </RadarChart>
                                            </ResponsiveContainer>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Recent Activity Timeline */}
                            <Grid item xs={12} md={6}>
                                <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#0f1f3d' }}>
                                            🕒 Recent Activity Timeline
                                        </Typography>
                                        <Box sx={{ mt: 2, maxHeight: 300, overflowY: 'auto' }}>
                                            {jobApplications?.data?.slice(0, 8).map((app, index) => (
                                                <Box key={index} sx={{ 
                                                    mb: 2, 
                                                    p: 2, 
                                                    borderRadius: 2, 
                                                    bgcolor: 'rgba(0,0,0,0.02)',
                                                    borderLeft: '4px solid #2196f3',
                                                    position: 'relative'
                                                }}>
                                                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                                        <Box>
                                                            <Typography variant="body2" fontWeight={600} color="primary.main">
                                                                {app.user?.name || 'Unknown Student'}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Applied for {app.job_posting?.title || 'Unknown Job'}
                                                            </Typography>
                                                        </Box>
                                                        <Chip 
                                                            label={app.status?.replace('_', ' ').toUpperCase()} 
                                                            size="small"
                                                            color={app.status === 'selected' ? 'success' : 
                                                                   app.status === 'rejected' ? 'error' : 
                                                                   app.status === 'shortlisted' ? 'warning' : 'default'}
                                                        />
                                                    </Box>
                                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                                        {app.application_date ? new Date(app.application_date).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        }) : 'N/A'}
                                                    </Typography>
                                                </Box>
                                            ))}
                                            {(!jobApplications?.data || jobApplications.data.length === 0) && (
                                                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', textAlign: 'center', py: 4 }}>
                                                    No recent activity
                                                </Typography>
                                            )}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Quick Actions */}
                            <Grid item xs={12}>
                                <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#0f1f3d' }}>
                                            ⚡ Quick Actions & Export
                                        </Typography>
                                        <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                            <Button
                                                variant="outlined"
                                                startIcon={<WorkIcon />}
                                                onClick={() => setTabValue(1)}
                                                sx={{ textTransform: 'none', borderRadius: 2 }}
                                            >
                                                View Job Postings
                                            </Button>

                                            <Button
                                                variant="outlined"
                                                startIcon={<BusinessIcon />}
                                                onClick={() => setTabValue(0)}
                                                sx={{ textTransform: 'none', borderRadius: 2 }}
                                            >
                                                Manage Companies
                                            </Button>
                                            <Button
                                                variant="contained"
                                                startIcon={<DownloadIcon />}
                                                sx={{ 
                                                    textTransform: 'none', 
                                                    borderRadius: 2,
                                                    background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)'
                                                }}
                                            >
                                                Export Report
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Box>
                </TabPanel>


            </Paper>

            {/* Applications Dialog */}
            <Dialog 
                open={applicationsDialog.open} 
                onClose={handleCloseApplicationsDialog} 
                maxWidth="md" 
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        boxShadow: '0 24px 38px 3px rgba(0,0,0,0.14), 0 9px 46px 8px rgba(0,0,0,0.12), 0 11px 15px -7px rgba(0,0,0,0.2)',
                    }
                }}
            >
                <DialogTitle 
                    sx={{ 
                        background: 'linear-gradient(135deg, #0f1f3d 0%, #1e3c72 100%)',
                        color: 'white',
                        py: 3,
                        position: 'relative',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '4px',
                            background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                        }
                    }}
                >
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box display="flex" alignItems="center" gap={2}>
                            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 40, height: 40 }}>
                                <GroupIcon />
                            </Avatar>
                            <Box>
                                <Typography variant="h5" fontWeight="600">
                                    Job Applications
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                                    {applicationsDialog.jobTitle}
                                </Typography>
                            </Box>
                        </Box>
                        <Button
                            variant="contained"
                            startIcon={<DownloadIcon />}
                            onClick={handleExportApplications}
                            disabled={loadingEnhancedApplications || enhancedJobApplications.length === 0}
                            sx={{ 
                                bgcolor: 'rgba(255,255,255,0.2)', 
                                color: 'white',
                                border: '1px solid rgba(255,255,255,0.3)',
                                textTransform: 'none',
                                fontWeight: 600,
                                '&:hover': { 
                                    bgcolor: 'rgba(255,255,255,0.3)',
                                    border: '1px solid rgba(255,255,255,0.5)'
                                },
                                '&:disabled': {
                                    bgcolor: 'rgba(255,255,255,0.1)',
                                    color: 'rgba(255,255,255,0.5)',
                                    border: '1px solid rgba(255,255,255,0.1)'
                                }
                            }}
                        >
                            Export to Excel
                        </Button>
                    </Box>
                </DialogTitle>
                
                <DialogContent sx={{ p: 0 }}>
                    <Box sx={{ p: 3 }}>
                        {loadingEnhancedApplications ? (
                            <Box display="flex" justifyContent="center" alignItems="center" py={4}>
                                <CircularProgress />
                                <Typography variant="body2" sx={{ ml: 2 }}>
                                    Loading student details...
                                </Typography>
                            </Box>
                        ) : applicationsDialog.jobId && (
                            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
                                {/* Bulk Update Controls */}
                                {selectedApplications.length > 0 && (
                                    <Box sx={{ 
                                        p: 2, 
                                        background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: 2,
                                        borderRadius: '8px 8px 0 0'
                                    }}>
                                        <Typography variant="body2" color="white" fontWeight={500}>
                                            {selectedApplications.length} application(s) selected
                                        </Typography>
                                        <FormControl size="small" sx={{ minWidth: 150 }}>
                                            <Select
                                                value={bulkUpdateStatus}
                                                onChange={(e) => setBulkUpdateStatus(e.target.value)}
                                                displayEmpty
                                                sx={{ 
                                                    bgcolor: 'white', 
                                                    '& .MuiSelect-select': { py: 1 },
                                                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
                                                }}
                                            >
                                                <MenuItem value="" disabled>Select Status</MenuItem>
                                                <MenuItem value="shortlisted">Shortlisted</MenuItem>
                                                <MenuItem value="interview_scheduled">Interview Scheduled</MenuItem>
                                                <MenuItem value="interviewed">Interviewed</MenuItem>
                                                <MenuItem value="selected">Selected</MenuItem>
                                                <MenuItem value="selected_not_joined">Selected Not Joined</MenuItem>
                                                <MenuItem value="rejected">Rejected</MenuItem>
                                                <MenuItem value="withdrawn">Withdrawn</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            onClick={() => setBulkUpdateDialog(true)}
                                            disabled={!bulkUpdateStatus}
                                            sx={{ 
                                                bgcolor: 'white', 
                                                color: '#e42b12', 
                                                fontWeight: 600,
                                                '&:hover': { 
                                                    bgcolor: 'rgba(255,255,255,0.9)',
                                                    color: '#e42b12'
                                                },
                                                '&:disabled': {
                                                    bgcolor: 'rgba(255,255,255,0.5)',
                                                    color: 'rgba(228,43,18,0.5)'
                                                }
                                            }}
                                        >
                                            Update Status
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => setSelectedApplications([])}
                                            sx={{ 
                                                borderColor: 'white', 
                                                color: 'white', 
                                                fontWeight: 500,
                                                '&:hover': { 
                                                    borderColor: 'white', 
                                                    bgcolor: 'rgba(255,255,255,0.1)' 
                                                } 
                                            }}
                                        >
                                            Clear Selection
                                        </Button>
                                    </Box>
                                )}
                                
                                <Table size="small">
                                    <TableHead>
                                        <TableRow sx={{ 
                                            background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                                            '& th': { color: '#fff', fontWeight: 700 }
                                        }}>
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    checked={selectedApplications.length === enhancedJobApplications.length && enhancedJobApplications.length > 0}
                                                    indeterminate={selectedApplications.length > 0 && selectedApplications.length < enhancedJobApplications.length}
                                                    onChange={handleSelectAllApplications}
                                                    sx={{ color: 'white', '&.Mui-checked': { color: 'white' } }}
                                                />
                                            </TableCell>
                                            <TableCell>Student Name</TableCell>
                                            <TableCell>Batch</TableCell>
                                            <TableCell>Course</TableCell>
                                            <TableCell>Application Date</TableCell>
                                            <TableCell>Status</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell colSpan={7} sx={{ textAlign: 'center', py: 1, fontSize: '0.875rem', color: 'text.secondary', fontStyle: 'italic' }}>
                                                Select applications to update status in bulk, or click on any student row to view complete details
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {enhancedJobApplications.map((application) => (
                                            <TableRow 
                                                key={application.id} 
                                                onClick={() => handleStudentDetailsClick(application.user_id, applicationsDialog.jobId)}
                                                sx={{ 
                                                    '&:hover': { backgroundColor: 'rgba(103, 126, 234, 0.08)' },
                                                    cursor: 'pointer',
                                                    transition: 'background-color 0.2s ease'
                                                }}
                                            >
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        checked={selectedApplications.includes(application.id)}
                                                        onChange={(e) => {
                                                            e.stopPropagation();
                                                            handleSelectApplication(application.id);
                                                        }}
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Box display="flex" alignItems="center" gap={1}>
                                                        <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem' }}>
                                                            {application.user?.name?.charAt(0)?.toUpperCase() || 'S'}
                                                        </Avatar>
                                                        <Typography variant="body2" fontWeight={500}>
                                                            {application.user?.name || 'N/A'}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    {application.user?.batches?.[0]?.batch_name || 'N/A'}
                                                </TableCell>
                                                <TableCell>
                                                    {application.user?.course?.name || 'N/A'}
                                                </TableCell>
                                                <TableCell>
                                                    {application.application_date ? 
                                                        new Date(application.application_date).toLocaleDateString() : 
                                                        'N/A'
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    <Box display="flex" alignItems="center" gap={1}>
                                                        <Chip 
                                                            label={application.status} 
                                                            color={getStatusColor(application.status)} 
                                                            size="small" 
                                                        />
                                                        <Tooltip title="View complete student details">
                                                            <OpenInNewIcon sx={{ fontSize: 16, opacity: 0.7 }} />
                                                        </Tooltip>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                        
                        {enhancedJobApplications.length === 0 && !loadingEnhancedApplications && (
                            <Box textAlign="center" py={4}>
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    No applications found
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    No students have applied for this job yet.
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                
                <DialogActions sx={{ p: 3, pt: 1 }}>
                    {undoOperations.length > 0 && (
                        <Button 
                            onClick={() => setUndoDialog(true)}
                            variant="outlined"
                            sx={{ 
                                textTransform: 'none',
                                borderRadius: 2,
                                px: 3,
                                borderColor: '#e42b12',
                                color: '#e42b12',
                                '&:hover': {
                                    borderColor: '#e42b12',
                                    backgroundColor: 'rgba(228,43,18,0.1)'
                                }
                            }}
                            startIcon={<UndoIcon />}
                        >
                            Undo Operations ({undoOperations.length})
                        </Button>
                    )}
                    <Button 
                        onClick={handleCloseApplicationsDialog}
                        sx={{ 
                            textTransform: 'none',
                            borderRadius: 2,
                            px: 3
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Bulk Update Confirmation Dialog */}
            <Dialog
                open={bulkUpdateDialog}
                onClose={() => setBulkUpdateDialog(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        boxShadow: '0 24px 38px 3px rgba(0,0,0,0.14), 0 9px 46px 8px rgba(0,0,0,0.12), 0 11px 15px -7px rgba(0,0,0,0.2)',
                    }
                }}
            >
                <DialogTitle sx={{ 
                    background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                    color: 'white',
                    py: 3
                }}>
                    <Typography variant="h6" fontWeight="600">
                        Confirm Bulk Status Update
                    </Typography>
                </DialogTitle>
                
                <DialogContent sx={{ p: 3 }}>
                    <Typography variant="body1" gutterBottom>
                        Are you sure you want to update the status of <strong>{selectedApplications.length}</strong> application(s) to <strong>{bulkUpdateStatus}</strong>?
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        This action will:
                    </Typography>
                    <ul style={{ marginTop: 8, marginBottom: 16 }}>
                        <li>Update the application status in the database</li>
                        <li>Send email notifications to the selected students</li>
                        <li>Update the status in the student placement center</li>
                    </ul>
                    <Typography variant="body2" color="warning.main" fontWeight="500">
                        This action cannot be undone.
                    </Typography>
                </DialogContent>
                
                <DialogActions sx={{ p: 3, pt: 1 }}>
                    <Button 
                        onClick={() => setBulkUpdateDialog(false)}
                        disabled={updatingBulkStatus}
                        sx={{ textTransform: 'none' }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleBulkStatusUpdate}
                        variant="contained"
                        disabled={updatingBulkStatus}
                        sx={{ 
                            textTransform: 'none',
                            background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                            '&:hover': {
                                background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                            }
                        }}
                    >
                        {updatingBulkStatus ? (
                            <>
                                <CircularProgress size={16} sx={{ mr: 1, color: 'white' }} />
                                Updating...
                            </>
                        ) : (
                            'Confirm Update'
                        )}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Undo Operations Dialog */}
            <Dialog
                open={undoDialog}
                onClose={() => setUndoDialog(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        boxShadow: '0 24px 38px 3px rgba(0,0,0,0.14), 0 9px 46px 8px rgba(0,0,0,0.12), 0 11px 15px -7px rgba(0,0,0,0.2)',
                    }
                }}
            >
                <DialogTitle sx={{ 
                    background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                    color: 'white',
                    py: 3
                }}>
                    <Typography variant="h6" fontWeight="600">
                        Available Undo Operations
                    </Typography>
                </DialogTitle>
                
                <DialogContent sx={{ p: 3 }}>
                    {undoOperations.length > 0 ? (
                        <Box>
                            <Typography variant="body1" gutterBottom>
                                The following operations can be undone:
                            </Typography>
                            <TableContainer component={Paper} sx={{ mt: 2 }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Applications</TableCell>
                                            <TableCell>Date</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {undoOperations.map((operation, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <Chip 
                                                        label={operation.new_status} 
                                                        color={getStatusColor(operation.new_status)}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>{operation.updated_count} application(s)</TableCell>
                                                <TableCell>
                                                    {new Date(operation.updated_at).toLocaleString()}
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        onClick={() => handleUndoBulkUpdate(operation.undo_key)}
                                                        disabled={undoingOperation}
                                                        startIcon={<UndoIcon />}
                                                        sx={{ 
                                                            borderColor: '#e42b12',
                                                            color: '#e42b12',
                                                            '&:hover': {
                                                                borderColor: '#e42b12',
                                                                backgroundColor: 'rgba(228,43,18,0.1)'
                                                            }
                                                        }}
                                                    >
                                                        {undoingOperation ? 'Undoing...' : 'Undo'}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    ) : (
                        <Typography variant="body1" color="text.secondary">
                            No undo operations available.
                        </Typography>
                    )}
                </DialogContent>
                
                <DialogActions sx={{ p: 3, pt: 1 }}>
                    <Button 
                        onClick={() => setUndoDialog(false)}
                        sx={{ textTransform: 'none' }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Company Dialog */}
            <Dialog 
                open={openDialog && dialogType === 'company'} 
                onClose={handleCloseDialog} 
                maxWidth="lg" 
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        boxShadow: '0 24px 38px 3px rgba(0,0,0,0.14), 0 9px 46px 8px rgba(0,0,0,0.12), 0 11px 15px -7px rgba(0,0,0,0.2)',
                    }
                }}
            >
                <DialogTitle 
                    sx={{ 
                        background: 'linear-gradient(135deg, #0f1f3d 0%, #1e3c72 100%)',
                        color: 'white',
                        py: 3,
                        position: 'relative',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '4px',
                            background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                        }
                    }}
                >
                    <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 40, height: 40 }}>
                            <BusinessIcon />
                        </Avatar>
                        <Box>
                            <Typography variant="h5" fontWeight="600">
                                {selectedItem ? 'Edit Company' : 'Add New Company'}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                                {selectedItem ? 'Update company information' : 'Create a new company profile'}
                            </Typography>
                        </Box>
                    </Box>
                </DialogTitle>
                
                <DialogContent sx={{ p: 0 }}>
                    <Box sx={{ p: 4 }}>
                        {/* Company Basic Information Section */}
                        <Paper 
                            elevation={0} 
                            sx={{ 
                                p: 3, 
                                mb: 3, 
                                border: '1px solid #e2e8f0',
                                borderRadius: 2,
                                background: '#ffffff',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            }}
                        >
                            <Box display="flex" alignItems="center" gap={2} mb={3}>
                                <Avatar sx={{ background: 'linear-gradient(135deg, #0f1f3d 0%, #1e3c72 100%)', width: 32, height: 32 }}>
                                    <BusinessIcon fontSize="small" />
                                </Avatar>
                                <Typography variant="h6" fontWeight="600" color="#0f1f3d">
                                    Company Information
                                </Typography>
                            </Box>
                            
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        label="Company Name"
                                        value={companyForm.name}
                                        onChange={(e) => handleCompanyFormChange('name', e.target.value)}
                                        onBlur={() => setCompanyFormTouched({ ...companyFormTouched, name: true })}
                                        error={companyFormTouched.name && !!companyFormErrors.name}
                                        helperText={companyFormTouched.name && companyFormErrors.name}
                                        variant="outlined"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(15, 31, 61, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(30, 60, 114, 0.25)',
                                                }
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <BusinessIcon color="action" fontSize="small" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Website"
                                        value={companyForm.website}
                                        onChange={(e) => setCompanyForm({...companyForm, website: e.target.value})}
                                        variant="outlined"
                                        placeholder=""
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(15, 31, 61, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(30, 60, 114, 0.25)',
                                                }
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    🌐
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Company Size</InputLabel>
                                        <Select
                                            value={companyForm.company_size || ''}
                                            label="Company Size"
                                            onChange={(e) => setCompanyForm({...companyForm, company_size: e.target.value})}
                                            sx={{
                                                borderRadius: 2,
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(15, 31, 61, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(30, 60, 114, 0.25)',
                                                }
                                            }}
                                        >
                                            <MenuItem value="1-10">1-10 employees</MenuItem>
                                            <MenuItem value="11-50">11-50 employees</MenuItem>
                                            <MenuItem value="51-200">51-200 employees</MenuItem>
                                            <MenuItem value="201-500">201-500 employees</MenuItem>
                                            <MenuItem value="501-1000">501-1000 employees</MenuItem>
                                            <MenuItem value="1000+">1000+ employees</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={4}
                                        label="Company Description"
                                        value={companyForm.description}
                                        onChange={(e) => setCompanyForm({...companyForm, description: e.target.value})}
                                        variant="outlined"
                                        placeholder=""
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(15, 31, 61, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(30, 60, 114, 0.25)',
                                                }
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                                                    📝
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* Contact Information Section */}
                        <Paper 
                            elevation={0} 
                            sx={{ 
                                p: 3, 
                                mb: 3,
                                border: '1px solid #e2e8f0',
                                borderRadius: 2,
                                background: '#ffffff',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            }}
                        >
                            <Box display="flex" alignItems="center" gap={2} mb={3}>
                                <Avatar sx={{ background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)', width: 32, height: 32 }}>
                                    👤
                                </Avatar>
                                <Typography variant="h6" fontWeight="600" color="#eb6707">
                                    Contact Information
                                </Typography>
                            </Box>
                            
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Contact Person"
                                        value={companyForm.contact_person}
                                        onChange={(e) => setCompanyForm({...companyForm, contact_person: e.target.value})}
                                        variant="outlined"
                                        placeholder=""
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(235, 103, 7, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(228, 43, 18, 0.25)',
                                                }
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    👨‍💼
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Designation"
                                        value={companyForm.designation}
                                        onChange={(e) => setCompanyForm({...companyForm, designation: e.target.value})}
                                        variant="outlined"
                                        placeholder=""
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(235, 103, 7, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(228, 43, 18, 0.25)',
                                                }
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    🏢
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Contact Email"
                                        type="email"
                                        value={companyForm.contact_email}
                                        onChange={(e) => setCompanyForm({...companyForm, contact_email: e.target.value})}
                                        variant="outlined"
                                        placeholder=""
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(235, 103, 7, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(228, 43, 18, 0.25)',
                                                }
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    ✉️
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Contact Phone"
                                        value={companyForm.contact_phone}
                                        onChange={(e) => setCompanyForm({...companyForm, contact_phone: e.target.value})}
                                        variant="outlined"
                                        placeholder=""
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(235, 103, 7, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(228, 43, 18, 0.25)',
                                                }
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    📞
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Box /> {/* Empty space for alignment */}
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        label="Company Address"
                                        value={companyForm.address}
                                        onChange={(e) => setCompanyForm({...companyForm, address: e.target.value})}
                                        variant="outlined"
                                        placeholder=""
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(235, 103, 7, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(228, 43, 18, 0.25)',
                                                }
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                                                    📍
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* New Company Details Section */}
                        <Paper 
                            elevation={0} 
                            sx={{ 
                                p: 3, 
                                mb: 3,
                                border: '1px solid #e2e8f0',
                                borderRadius: 2,
                                background: '#ffffff',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            }}
                        >
                            <Box display="flex" alignItems="center" gap={2} mb={3}>
                                <Avatar sx={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', width: 32, height: 32 }}>
                                    🏢
                                </Avatar>
                                <Typography variant="h6" fontWeight="600" color="#059669">
                                    Company Details
                                </Typography>
                            </Box>
                            
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        required
                                        multiline
                                        rows={3}
                                        label="Company Address"
                                        value={companyForm.company_address}
                                        onChange={(e) => handleCompanyFormChange('company_address', e.target.value)}
                                        onBlur={() => setCompanyFormTouched({ ...companyFormTouched, company_address: true })}
                                        error={companyFormTouched.company_address && !!companyFormErrors.company_address}
                                        helperText={companyFormTouched.company_address && companyFormErrors.company_address}
                                        variant="outlined"
                                        placeholder="Enter complete company address"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.25)',
                                                }
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                                                    🏢
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <FormControl fullWidth required>
                                        <InputLabel>Country</InputLabel>
                                        <Select
                                            value={companyForm.country || ''}
                                            label="Country"
                                            onChange={(e) => handleCountryChange(e.target.value)}
                                            onBlur={() => setCompanyFormTouched({ ...companyFormTouched, country: true })}
                                            error={companyFormTouched.country && !!companyFormErrors.country}
                                            sx={{
                                                borderRadius: 2,
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.25)',
                                                }
                                            }}
                                        >
                                            <MenuItem value="India">India</MenuItem>
                                            <MenuItem value="United States">United States</MenuItem>
                                            <MenuItem value="United Kingdom">United Kingdom</MenuItem>
                                            <MenuItem value="Canada">Canada</MenuItem>
                                            <MenuItem value="Australia">Australia</MenuItem>
                                            <MenuItem value="Germany">Germany</MenuItem>
                                            <MenuItem value="France">France</MenuItem>
                                            <MenuItem value="Japan">Japan</MenuItem>
                                            <MenuItem value="China">China</MenuItem>
                                            <MenuItem value="Singapore">Singapore</MenuItem>
                                            <MenuItem value="Other">Other</MenuItem>
                                        </Select>
                                        {companyFormTouched.country && companyFormErrors.country && (
                                            <FormHelperText error>{companyFormErrors.country}</FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <FormControl fullWidth required>
                                        <InputLabel>State</InputLabel>
                                        <Select
                                            value={companyForm.state || ''}
                                            label="State"
                                            onChange={(e) => handleCompanyFormChange('state', e.target.value)}
                                            onBlur={() => setCompanyFormTouched({ ...companyFormTouched, state: true })}
                                            error={companyFormTouched.state && !!companyFormErrors.state}
                                            disabled={!companyForm.country || availableStates.length === 0}
                                            sx={{
                                                borderRadius: 2,
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.25)',
                                                }
                                            }}
                                        >
                                            {availableStates.length > 0 ? (
                                                availableStates.map((state) => (
                                                    <MenuItem key={state} value={state}>
                                                        {state}
                                                    </MenuItem>
                                                ))
                                            ) : (
                                                <MenuItem disabled>
                                                    {companyForm.country ? 'No states available' : 'Please select a country first'}
                                                </MenuItem>
                                            )}
                                        </Select>
                                        {companyFormTouched.state && companyFormErrors.state && (
                                            <FormHelperText error>{companyFormErrors.state}</FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        required
                                        label="City"
                                        value={companyForm.city}
                                        onChange={(e) => handleCompanyFormChange('city', e.target.value)}
                                        onBlur={() => setCompanyFormTouched({ ...companyFormTouched, city: true })}
                                        error={companyFormTouched.city && !!companyFormErrors.city}
                                        helperText={companyFormTouched.city && companyFormErrors.city}
                                        variant="outlined"
                                        placeholder="Enter city"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.25)',
                                                }
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    🏙️
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        required
                                        multiline
                                        rows={4}
                                        label="About Company / Company Profile"
                                        value={companyForm.about_company}
                                        onChange={(e) => handleCompanyFormChange('about_company', e.target.value)}
                                        onBlur={() => setCompanyFormTouched({ ...companyFormTouched, about_company: true })}
                                        error={companyFormTouched.about_company && !!companyFormErrors.about_company}
                                        helperText={companyFormTouched.about_company && companyFormErrors.about_company}
                                        variant="outlined"
                                        placeholder="Brief description about the company"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.25)',
                                                }
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                                                    📋
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="LinkedIn Page URL (Optional)"
                                        value={companyForm.linkedin_url}
                                        onChange={(e) => handleCompanyFormChange('linkedin_url', e.target.value)}
                                        onBlur={() => setCompanyFormTouched({ ...companyFormTouched, linkedin_url: true })}
                                        error={companyFormTouched.linkedin_url && !!companyFormErrors.linkedin_url}
                                        helperText={companyFormTouched.linkedin_url && companyFormErrors.linkedin_url}
                                        variant="outlined"
                                        placeholder="https://linkedin.com/company/..."
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.25)',
                                                }
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    💼
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Other Social Media Links (Optional)"
                                        value={companyForm.social_media_links}
                                        onChange={(e) => handleCompanyFormChange('social_media_links', e.target.value)}
                                        onBlur={() => setCompanyFormTouched({ ...companyFormTouched, social_media_links: true })}
                                        error={companyFormTouched.social_media_links && !!companyFormErrors.social_media_links}
                                        helperText={companyFormTouched.social_media_links && companyFormErrors.social_media_links}
                                        variant="outlined"
                                        placeholder="https://..."
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.25)',
                                                }
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    🌐
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* New Contact Information Section */}
                        <Paper 
                            elevation={0} 
                            sx={{ 
                                p: 3, 
                                mb: 3,
                                border: '1px solid #e2e8f0',
                                borderRadius: 2,
                                background: '#ffffff',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            }}
                        >
                            <Box display="flex" alignItems="center" gap={2} mb={3}>
                                <Avatar sx={{ background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)', width: 32, height: 32 }}>
                                    📞
                                </Avatar>
                                <Typography variant="h6" fontWeight="600" color="#dc2626">
                                    Contact Information
                                </Typography>
                            </Box>
                            
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        label="Contact Person Name"
                                        value={companyForm.contact_person_name}
                                        onChange={(e) => handleCompanyFormChange('contact_person_name', e.target.value)}
                                        onBlur={() => setCompanyFormTouched({ ...companyFormTouched, contact_person_name: true })}
                                        error={companyFormTouched.contact_person_name && !!companyFormErrors.contact_person_name}
                                        helperText={companyFormTouched.contact_person_name && companyFormErrors.contact_person_name}
                                        variant="outlined"
                                        placeholder="Enter contact person name (alphabets only)"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(239, 68, 68, 0.25)',
                                                }
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    👤
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        label="Contact Email"
                                        type="email"
                                        value={companyForm.contact_email_new}
                                        onChange={(e) => handleCompanyFormChange('contact_email_new', e.target.value)}
                                        onBlur={() => setCompanyFormTouched({ ...companyFormTouched, contact_email_new: true })}
                                        error={companyFormTouched.contact_email_new && !!companyFormErrors.contact_email_new}
                                        helperText={companyFormTouched.contact_email_new && companyFormErrors.contact_email_new}
                                        variant="outlined"
                                        placeholder="Enter valid email address"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(239, 68, 68, 0.25)',
                                                }
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    ✉️
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        label="Contact Number"
                                        value={companyForm.contact_number}
                                        onChange={(e) => handleCompanyFormChange('contact_number', e.target.value)}
                                        onBlur={() => setCompanyFormTouched({ ...companyFormTouched, contact_number: true })}
                                        error={companyFormTouched.contact_number && !!companyFormErrors.contact_number}
                                        helperText={companyFormTouched.contact_number && companyFormErrors.contact_number}
                                        variant="outlined"
                                        placeholder="Enter contact number"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(239, 68, 68, 0.25)',
                                                }
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    📱
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Alternate Contact Number (Optional)"
                                        value={companyForm.alternate_contact_number}
                                        onChange={(e) => handleCompanyFormChange('alternate_contact_number', e.target.value)}
                                        onBlur={() => setCompanyFormTouched({ ...companyFormTouched, alternate_contact_number: true })}
                                        error={companyFormTouched.alternate_contact_number && !!companyFormErrors.alternate_contact_number}
                                        helperText={companyFormTouched.alternate_contact_number && companyFormErrors.alternate_contact_number}
                                        variant="outlined"
                                        placeholder="Enter alternate contact number"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(239, 68, 68, 0.25)',
                                                }
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    📞
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Box>
                </DialogContent>
                
                <DialogActions 
                    sx={{ 
                        p: 3, 
                        pt: 0,
                        gap: 2,
                        justifyContent: 'space-between'
                    }}
                >
                    <Button 
                        onClick={handleCloseDialog}
                        variant="outlined"
                        size="large"
                        sx={{
                            borderRadius: 2,
                            px: 4,
                            py: 1.5,
                            borderColor: '#e5e7eb',
                            color: '#6b7280',
                            '&:hover': {
                                borderColor: '#d1d5db',
                                backgroundColor: '#f9fafb'
                            }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSubmit} 
                        variant="contained"
                        size="large"
                        disabled={creatingCompany || updatingCompany}
                        sx={{
                            background: 'linear-gradient(135deg, #0f1f3d 0%, #1e3c72 100%)',
                            borderRadius: 2,
                            px: 4,
                            py: 1.5,
                            fontWeight: 600,
                            boxShadow: '0 4px 15px rgba(15, 31, 61, 0.4)',
                            '&:hover': {
                                background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                                boxShadow: '0 6px 20px rgba(235, 103, 7, 0.6)',
                                transform: 'translateY(-1px)'
                            },
                            '&:disabled': {
                                background: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
                                boxShadow: 'none'
                            },
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {creatingCompany || updatingCompany ? (
                            <Box display="flex" alignItems="center" gap={1}>
                                <CircularProgress size={20} color="inherit" />
                                <span>{selectedItem ? 'Updating...' : 'Creating...'}</span>
                            </Box>
                        ) : (
                            <Box display="flex" alignItems="center" gap={1}>
                                <span>{selectedItem ? 'Update Company' : 'Create Company'}</span>
                                {selectedItem ? '✏️' : '✨'}
                            </Box>
                        )}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Job Posting Dialog */}
            <Dialog 
                open={openDialog && dialogType === 'jobPosting'} 
                onClose={handleCloseDialog} 
                maxWidth="lg" 
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        boxShadow: '0 24px 38px 3px rgba(0,0,0,0.14), 0 9px 46px 8px rgba(0,0,0,0.12), 0 11px 15px -7px rgba(0,0,0,0.2)',
                    }
                }}
            >
                <DialogTitle 
                    sx={{ 
                        background: 'linear-gradient(135deg, #0f1f3d 0%, #1e3c72 100%)',
                        color: 'white',
                        py: 3,
                        position: 'relative',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '4px',
                            background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                        }
                    }}
                >
                    <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 40, height: 40 }}>
                            <WorkIcon />
                        </Avatar>
                        <Box>
                            <Typography variant="h5" fontWeight="600">
                                {selectedItem ? 'Edit Job Posting' : 'Add New Job Posting'}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                                {selectedItem ? 'Update job posting details' : 'Create a new job posting'}
                            </Typography>
                        </Box>
                    </Box>
                </DialogTitle>
                
                <DialogContent sx={{ p: 0 }}>
                    <Box sx={{ p: 4, maxHeight: '70vh', overflowY: 'auto' }}>
                        {/* Job Basic Information Section */}
                        <Paper 
                            elevation={0} 
                            sx={{ 
                                p: 4, 
                                mb: 4, 
                                border: '1px solid #e2e8f0',
                                borderRadius: 3,
                                background: '#ffffff',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            }}
                        >
                            <Box display="flex" alignItems="center" gap={2} mb={4}>
                                <Avatar sx={{ background: 'linear-gradient(135deg, #0f1f3d 0%, #1e3c72 100%)', width: 36, height: 36 }}>
                                    <WorkIcon fontSize="small" />
                                </Avatar>
                                <Typography variant="h6" fontWeight="600" color="#0f1f3d">
                                    Job Information
                                </Typography>
                            </Box>
                            
                            <Grid container spacing={4}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        label="Job Title"
                                        value={jobPostingForm.title}
                                        onChange={(e) => setJobPostingForm({...jobPostingForm, title: e.target.value})}
                                        variant="outlined"
                                        placeholder=""
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(15, 31, 61, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(30, 60, 114, 0.25)',
                                                }
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontSize: '0.9rem',
                                                fontWeight: 500
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    💼
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel sx={{ fontSize: '0.9rem', fontWeight: 500 }}>Company</InputLabel>
                                        <Select
                                            value={jobPostingForm.company_id}
                                            onChange={(e) => setJobPostingForm({...jobPostingForm, company_id: e.target.value})}
                                            sx={{
                                                borderRadius: 2,
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(15, 31, 61, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(30, 60, 114, 0.25)',
                                                }
                                            }}
                                        >
                                            {companies?.map((company) => (
                                                <MenuItem key={company.id} value={company.id}>
                                                    {company.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel sx={{ fontSize: '0.9rem', fontWeight: 500 }}>Course</InputLabel>
                                        <Select
                                            value={jobPostingForm.course_id}
                                            onChange={(e) => setJobPostingForm({...jobPostingForm, course_id: e.target.value})}
                                            disabled={coursesLoading}
                                            sx={{
                                                borderRadius: 2,
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(15, 31, 61, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(30, 60, 114, 0.25)',
                                                }
                                            }}
                                        >
                                            {coursesLoading ? (
                                                <MenuItem disabled>Loading courses...</MenuItem>
                                            ) : (
                                                courses?.courses?.map((course) => (
                                                    <MenuItem key={course.id} value={course.id}>
                                                        {course.name}
                                                    </MenuItem>
                                                ))
                                            )}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Location"
                                        value={jobPostingForm.location}
                                        onChange={(e) => setJobPostingForm({...jobPostingForm, location: e.target.value})}
                                        variant="outlined"
                                        placeholder=""
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(15, 31, 61, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(30, 60, 114, 0.25)',
                                                }
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontSize: '0.9rem',
                                                fontWeight: 500
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    📍
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel sx={{ fontSize: '0.9rem', fontWeight: 500 }}>Job Type</InputLabel>
                                        <Select
                                            value={jobPostingForm.job_type}
                                            onChange={(e) => setJobPostingForm({...jobPostingForm, job_type: e.target.value})}
                                            sx={{
                                                borderRadius: 2,
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(15, 31, 61, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(30, 60, 114, 0.25)',
                                                }
                                            }}
                                        >
                                            <MenuItem value="full_time">🕐 Full Time</MenuItem>
                                            <MenuItem value="part_time">⏰ Part Time</MenuItem>
                                            <MenuItem value="contract">📋 Contract</MenuItem>
                                            <MenuItem value="internship">🎓 Internship</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel sx={{ fontSize: '0.9rem', fontWeight: 500 }}>Status</InputLabel>
                                        <Select
                                            value={jobPostingForm.status}
                                            onChange={(e) => setJobPostingForm({...jobPostingForm, status: e.target.value})}
                                            sx={{
                                                borderRadius: 2,
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(15, 31, 61, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(30, 60, 114, 0.25)',
                                                }
                                            }}
                                        >
                                            <MenuItem value="draft">📝 Draft</MenuItem>
                                            <MenuItem value="open">✅ Open</MenuItem>
                                            <MenuItem value="closed">❌ Closed</MenuItem>
                                            <MenuItem value="on_hold">⏸️ On Hold</MenuItem>
                                            <MenuItem value="expired">⏰ Expired</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                            </Grid>
                        </Paper>

                        {/* Job Requirements Section */}
                        <Paper 
                            elevation={0} 
                            sx={{ 
                                p: 4, 
                                mb: 4,
                                border: '1px solid #e2e8f0',
                                borderRadius: 3,
                                background: '#ffffff',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            }}
                        >
                            <Box display="flex" alignItems="center" gap={2} mb={4}>
                                <Avatar sx={{ background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)', width: 36, height: 36 }}>
                                    📋
                                </Avatar>
                                <Typography variant="h6" fontWeight="600" color="#eb6707">
                                    Job Description, Roles and Responsibilities
                                </Typography>
                            </Box>
                            
                            <Grid container spacing={4}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={4}
                                        label="Job Description, Roles and Responsibilities"
                                        value={jobPostingForm.requirements}
                                        onChange={(e) => setJobPostingForm({...jobPostingForm, requirements: e.target.value})}
                                        variant="outlined"
                                        placeholder=""
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(235, 103, 7, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(228, 43, 18, 0.25)',
                                                }
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontSize: '0.9rem',
                                                fontWeight: 500
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                                                    ✅
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>

                            </Grid>
                        </Paper>

                        {/* Compensation & Details Section */}
                        <Paper 
                            elevation={0} 
                            sx={{ 
                                p: 4, 
                                mb: 4,
                                border: '1px solid #e2e8f0',
                                borderRadius: 3,
                                background: '#ffffff',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            }}
                        >
                            <Box display="flex" alignItems="center" gap={2} mb={4}>
                                <Avatar sx={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', width: 36, height: 36 }}>
                                    💰
                                </Avatar>
                                <Typography variant="h6" fontWeight="600" color="#059669">
                                    Compensation & Details
                                </Typography>
                            </Box>
                            
                            <Grid container spacing={4}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Minimum Salary"
                                        type="number"
                                        value={jobPostingForm.salary_min}
                                        onChange={(e) => setJobPostingForm({...jobPostingForm, salary_min: e.target.value})}
                                        variant="outlined"
                                        placeholder=""
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.25)',
                                                }
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontSize: '0.9rem',
                                                fontWeight: 500
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    💵
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Maximum Salary"
                                        type="number"
                                        value={jobPostingForm.salary_max}
                                        onChange={(e) => setJobPostingForm({...jobPostingForm, salary_max: e.target.value})}
                                        variant="outlined"
                                        placeholder=""
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.25)',
                                                }
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontSize: '0.9rem',
                                                fontWeight: 500
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    💵
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Experience Required"
                                        value={jobPostingForm.experience_required}
                                        onChange={(e) => setJobPostingForm({...jobPostingForm, experience_required: e.target.value})}
                                        variant="outlined"
                                        placeholder=""
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.25)',
                                                }
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontSize: '0.9rem',
                                                fontWeight: 500
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    ⏳
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Number of Vacancies"
                                        type="number"
                                        value={jobPostingForm.vacancies}
                                        onChange={(e) => setJobPostingForm({...jobPostingForm, vacancies: e.target.value})}
                                        variant="outlined"
                                        placeholder=""
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.25)',
                                                }
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontSize: '0.9rem',
                                                fontWeight: 500
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    👥
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Application Deadline"
                                        type="date"
                                        value={jobPostingForm.application_deadline}
                                        onChange={(e) => setJobPostingForm({...jobPostingForm, application_deadline: e.target.value})}
                                        InputLabelProps={{ shrink: true }}
                                        placeholder=""
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.25)',
                                                }
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontSize: '0.9rem',
                                                fontWeight: 500
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    ⏰
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>

                            </Grid>
                        </Paper>

                        {/* Eligibility Criteria Section */}
                        <Paper 
                            elevation={0} 
                            sx={{ 
                                p: 3, 
                                mb: 3,
                                border: '1px solid #e2e8f0',
                                borderRadius: 2,
                                background: '#ffffff',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            }}
                        >
                            <Box display="flex" alignItems="center" gap={2} mb={3}>
                                <Avatar sx={{ background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)', width: 32, height: 32 }}>
                                    🎓
                                </Avatar>
                                <Typography variant="h6" fontWeight="600" color="#7c3aed">
                                    Eligibility Criteria
                                </Typography>
                            </Box>
                            
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>BTech Year of Passout (Min)</InputLabel>
                                        <Select
                                            value={jobPostingForm.btech_year_of_passout_min}
                                            onChange={e => setJobPostingForm({ ...jobPostingForm, btech_year_of_passout_min: e.target.value })}
                                            label="BTech Year of Passout (Min)"
                                            sx={{
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(124, 58, 237, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(139, 92, 246, 0.25)',
                                                }
                                            }}
                                        >
                                            <MenuItem value="">
                                                <em>Select Year</em>
                                            </MenuItem>
                                            {yearOptions.map((year) => (
                                                <MenuItem key={year} value={year}>
                                                    {year}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>BTech Year of Passout (Max)</InputLabel>
                                        <Select
                                            value={jobPostingForm.btech_year_of_passout_max}
                                            onChange={e => setJobPostingForm({ ...jobPostingForm, btech_year_of_passout_max: e.target.value })}
                                            label="BTech Year of Passout (Max)"
                                            sx={{
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(124, 58, 237, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(139, 92, 246, 0.25)',
                                                }
                                            }}
                                        >
                                            <MenuItem value="">
                                                <em>Select Year</em>
                                            </MenuItem>
                                            {yearOptions.map((year) => (
                                                <MenuItem key={year} value={year}>
                                                    {year}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>MTech Year of Passout (Min)</InputLabel>
                                        <Select
                                            value={jobPostingForm.mtech_year_of_passout_min}
                                            onChange={e => setJobPostingForm({ ...jobPostingForm, mtech_year_of_passout_min: e.target.value })}
                                            label="MTech Year of Passout (Min)"
                                            sx={{
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(124, 58, 237, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(139, 92, 246, 0.25)',
                                                }
                                            }}
                                        >
                                            <MenuItem value="">
                                                <em>Select Year</em>
                                            </MenuItem>
                                            {yearOptions.map((year) => (
                                                <MenuItem key={year} value={year}>
                                                    {year}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>MTech Year of Passout (Max)</InputLabel>
                                        <Select
                                            value={jobPostingForm.mtech_year_of_passout_max}
                                            onChange={e => setJobPostingForm({ ...jobPostingForm, mtech_year_of_passout_max: e.target.value })}
                                            label="MTech Year of Passout (Max)"
                                            sx={{
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(124, 58, 237, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(139, 92, 246, 0.25)',
                                                }
                                            }}
                                        >
                                            <MenuItem value="">
                                                <em>Select Year</em>
                                            </MenuItem>
                                            {yearOptions.map((year) => (
                                                <MenuItem key={year} value={year}>
                                                    {year}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="BTech Percentage (Min)"
                                        type="number"
                                        value={jobPostingForm.btech_percentage_min}
                                        onChange={e => setJobPostingForm({ ...jobPostingForm, btech_percentage_min: e.target.value })}
                                        variant="outlined"
                                        placeholder=""
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(124, 58, 237, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(139, 92, 246, 0.25)',
                                                }
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    📊
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="MTech Percentage (Min)"
                                        type="number"
                                        value={jobPostingForm.mtech_percentage_min}
                                        onChange={e => setJobPostingForm({ ...jobPostingForm, mtech_percentage_min: e.target.value })}
                                        variant="outlined"
                                        placeholder=""
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(124, 58, 237, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(139, 92, 246, 0.25)',
                                                }
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    📊
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        label="Additional Criteria"
                                        value={jobPostingForm.additional_criteria}
                                        onChange={e => setJobPostingForm({ ...jobPostingForm, additional_criteria: e.target.value })}
                                        variant="outlined"
                                        placeholder="Any additional eligibility criteria or special requirements..."
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(124, 58, 237, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(139, 92, 246, 0.25)',
                                                }
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                                                    📝
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* New Job Posting Fields Section */}
                        <Paper 
                            elevation={0} 
                            sx={{ 
                                p: 4, 
                                mb: 4,
                                border: '1px solid #e2e8f0',
                                borderRadius: 3,
                                background: '#ffffff',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            }}
                        >
                            <Box display="flex" alignItems="center" gap={2} mb={4}>
                                <Avatar sx={{ background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)', width: 36, height: 36 }}>
                                    🎯
                                </Avatar>
                                <Typography variant="h6" fontWeight="600" color="#dc2626">
                                    Additional Job Details
                                </Typography>
                            </Box>
                            
                            <Grid container spacing={4}>
                                {/* Eligible Courses */}
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel sx={{ fontSize: '0.9rem', fontWeight: 500 }}>Eligible Courses / Programs</InputLabel>
                                        <Select
                                            multiple
                                            value={jobPostingForm.eligible_courses}
                                            onChange={(e) => setJobPostingForm({...jobPostingForm, eligible_courses: e.target.value})}
                                            renderValue={(selected) => (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {selected.map((value) => (
                                                        <Chip key={value} label={value} size="small" />
                                                    ))}
                                                </Box>
                                            )}
                                            sx={{
                                                borderRadius: 2,
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(239, 68, 68, 0.25)',
                                                }
                                            }}
                                        >
                                            <MenuItem value="B.Tech">B.Tech</MenuItem>
                                            <MenuItem value="M.Tech">M.Tech</MenuItem>
                                            <MenuItem value="Diploma">Diploma</MenuItem>
                                            <MenuItem value="B.Sc">B.Sc</MenuItem>
                                            <MenuItem value="M.Sc">M.Sc</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* Specializations */}
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel sx={{ fontSize: '0.9rem', fontWeight: 500 }}>Specializations</InputLabel>
                                        <Select
                                            multiple
                                            value={jobPostingForm.specializations}
                                            onChange={(e) => setJobPostingForm({...jobPostingForm, specializations: e.target.value})}
                                            renderValue={(selected) => (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {selected.map((value) => (
                                                        <Chip key={value} label={value} size="small" />
                                                    ))}
                                                </Box>
                                            )}
                                            sx={{
                                                borderRadius: 2,
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(239, 68, 68, 0.25)',
                                                }
                                            }}
                                        >
                                            <MenuItem value="ECE">ECE</MenuItem>
                                            <MenuItem value="EEE">EEE</MenuItem>
                                            <MenuItem value="EIE">EIE</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* Backlogs Allowed */}
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel sx={{ fontSize: '0.9rem', fontWeight: 500 }}>Backlogs Allowed</InputLabel>
                                        <Select
                                            value={jobPostingForm.backlogs_allowed}
                                            onChange={(e) => setJobPostingForm({...jobPostingForm, backlogs_allowed: e.target.value})}
                                            sx={{
                                                borderRadius: 2,
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(239, 68, 68, 0.25)',
                                                }
                                            }}
                                        >
                                            <MenuItem value="">Select Option</MenuItem>
                                            <MenuItem value="Yes">Yes</MenuItem>
                                            <MenuItem value="No">No</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* Training Period & Stipend */}
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Training Period & Stipend (if applicable)"
                                        type="number"
                                        value={jobPostingForm.training_period_stipend}
                                        onChange={(e) => setJobPostingForm({...jobPostingForm, training_period_stipend: e.target.value})}
                                        variant="outlined"
                                        placeholder="Enter amount in INR"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(239, 68, 68, 0.25)',
                                                }
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontSize: '0.9rem',
                                                fontWeight: 500
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    💰
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>

                                {/* Bond / Service Agreement Details */}
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        label="Bond / Service Agreement Details (Optional)"
                                        value={jobPostingForm.bond_service_agreement}
                                        onChange={(e) => setJobPostingForm({...jobPostingForm, bond_service_agreement: e.target.value})}
                                        variant="outlined"
                                        placeholder="If applicable, describe bond or service agreement terms..."
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(239, 68, 68, 0.25)',
                                                }
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                                                    📋
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>

                                {/* Mandatory Original Documents */}
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel sx={{ fontSize: '0.9rem', fontWeight: 500 }}>Is It Mandatory to submit all original documents of selected students to recruiters?</InputLabel>
                                        <Select
                                            value={jobPostingForm.mandatory_original_documents}
                                            onChange={(e) => setJobPostingForm({...jobPostingForm, mandatory_original_documents: e.target.value})}
                                            sx={{
                                                borderRadius: 2,
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(239, 68, 68, 0.25)',
                                                }
                                            }}
                                        >
                                            <MenuItem value="">Select Option</MenuItem>
                                            <MenuItem value="Yes">Yes</MenuItem>
                                            <MenuItem value="No">No</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* Recruitment Process Steps */}
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        label="Recruitment Process Steps (optional)"
                                        value={jobPostingForm.recruitment_process_steps}
                                        onChange={(e) => setJobPostingForm({...jobPostingForm, recruitment_process_steps: e.target.value})}
                                        variant="outlined"
                                        placeholder="E.g. Online Test, Technical Interview, HR Round"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(239, 68, 68, 0.25)',
                                                }
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                                                    🔄
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>

                                {/* Mode of Recruitment Process */}
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel sx={{ fontSize: '0.9rem', fontWeight: 500 }}>Mode of Recruitment Process</InputLabel>
                                        <Select
                                            value={jobPostingForm.mode_of_recruitment}
                                            onChange={(e) => setJobPostingForm({...jobPostingForm, mode_of_recruitment: e.target.value})}
                                            sx={{
                                                borderRadius: 2,
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(239, 68, 68, 0.25)',
                                                }
                                            }}
                                        >
                                            <MenuItem value="">Select Mode</MenuItem>
                                            <MenuItem value="Online">Online</MenuItem>
                                            <MenuItem value="Offline">Offline</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* Interview Date */}
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Interview Date(s) (if known)"
                                        type="date"
                                        value={jobPostingForm.interview_date}
                                        onChange={(e) => setJobPostingForm({...jobPostingForm, interview_date: e.target.value})}
                                        InputLabelProps={{ shrink: true }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(239, 68, 68, 0.25)',
                                                }
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontSize: '0.9rem',
                                                fontWeight: 500
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    📅
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>

                                {/* Interview Mode */}
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel sx={{ fontSize: '0.9rem', fontWeight: 500 }}>Interview Mode</InputLabel>
                                        <Select
                                            value={jobPostingForm.interview_mode}
                                            onChange={(e) => setJobPostingForm({...jobPostingForm, interview_mode: e.target.value})}
                                            sx={{
                                                borderRadius: 2,
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(239, 68, 68, 0.25)',
                                                }
                                            }}
                                        >
                                            <MenuItem value="">Select Mode</MenuItem>
                                            <MenuItem value="Online">Online</MenuItem>
                                            <MenuItem value="Offline">Offline</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* Venue / Link */}
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Venue / Link (if offline or online scheduled)"
                                        value={jobPostingForm.venue_link}
                                        onChange={(e) => setJobPostingForm({...jobPostingForm, venue_link: e.target.value})}
                                        variant="outlined"
                                        placeholder="Enter venue address or online meeting link"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.15)',
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(239, 68, 68, 0.25)',
                                                }
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontSize: '0.9rem',
                                                fontWeight: 500
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    📍
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Box>
                </DialogContent>
                
                <DialogActions 
                    sx={{ 
                        p: 3, 
                        pt: 0,
                        gap: 2,
                        justifyContent: 'space-between'
                    }}
                >
                    <Button 
                        onClick={handleCloseDialog}
                        variant="outlined"
                        size="large"
                        sx={{
                            borderRadius: 2,
                            px: 4,
                            py: 1.5,
                            borderColor: '#e5e7eb',
                            color: '#6b7280',
                            '&:hover': {
                                borderColor: '#d1d5db',
                                backgroundColor: '#f9fafb'
                            }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSubmit} 
                        variant="contained"
                        size="large"
                        disabled={creatingJobPosting || updatingJobPosting}
                        sx={{
                            background: 'linear-gradient(135deg, #0f1f3d 0%, #1e3c72 100%)',
                            borderRadius: 2,
                            px: 4,
                            py: 1.5,
                            fontWeight: 600,
                            boxShadow: '0 4px 15px rgba(15, 31, 61, 0.4)',
                            '&:hover': {
                                background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                                boxShadow: '0 6px 20px rgba(235, 103, 7, 0.6)',
                                transform: 'translateY(-1px)'
                            },
                            '&:disabled': {
                                background: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
                                boxShadow: 'none'
                            },
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {creatingJobPosting || updatingJobPosting ? (
                            <Box display="flex" alignItems="center" gap={1}>
                                <CircularProgress size={20} color="inherit" />
                                <span>{selectedItem ? 'Updating...' : 'Creating...'}</span>
                            </Box>
                        ) : (
                            <Box display="flex" alignItems="center" gap={1}>
                                <span>{selectedItem ? 'Update Job Posting' : 'Create Job Posting'}</span>
                                {selectedItem ? '✏️' : '✨'}
                            </Box>
                        )}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteConfirmDialog.open}
                onClose={cancelDelete}
                aria-labelledby="delete-confirmation-dialog-title"
                aria-describedby="delete-confirmation-dialog-description"
            >
                <DialogTitle id="delete-confirmation-dialog-title">
                    Confirm Delete
                </DialogTitle>
                <DialogContent>
                    <Typography id="delete-confirmation-dialog-description">
                        {deleteConfirmDialog.type === 'company' 
                            ? 'Are you sure you want to delete this company? This action cannot be undone.'
                            : 'Are you sure you want to delete this job posting? This action cannot be undone.'
                        }
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelDelete} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={confirmDelete} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Student Details Modal */}
            <Dialog
                open={studentDetailsDialog.open}
                onClose={handleCloseStudentDetailsDialog}
                maxWidth="lg"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        boxShadow: '0 24px 38px 3px rgba(0,0,0,0.14), 0 9px 46px 8px rgba(0,0,0,0.12), 0 11px 15px -7px rgba(0,0,0,0.2)',
                        maxHeight: '90vh'
                    }
                }}
            >
                <DialogTitle 
                    component="div"
                    sx={{ 
                        background: 'linear-gradient(135deg, #0f1f3d 0%, #1e3c72 100%)',
                        color: 'white',
                        py: 3,
                        position: 'relative',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '4px',
                            background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                        }
                    }}
                >
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box display="flex" alignItems="center" gap={2}>
                            <Avatar sx={{ 
                                width: 48, 
                                height: 48, 
                                fontSize: '1.5rem',
                                bgcolor: 'rgba(255,255,255,0.2)'
                            }}>
                                <PersonIcon />
                            </Avatar>
                            <Box>
                                <Typography variant="h5" fontWeight="600">
                                    Student Application Details
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                                    Complete profile and application history
                                </Typography>
                            </Box>
                        </Box>
                        <IconButton 
                            onClick={handleCloseStudentDetailsDialog}
                            sx={{ color: 'white' }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                
                <DialogContent sx={{ p: 0 }}>
                    {loadingStudentDetails ? (
                        <Box display="flex" justifyContent="center" alignItems="center" py={8}>
                            <CircularProgress />
                            <Typography variant="body2" sx={{ ml: 2 }}>
                                Loading student details...
                            </Typography>
                        </Box>
                    ) : studentDetailsError ? (
                        <Box p={3}>
                            <Alert severity="error">{studentDetailsError}</Alert>
                        </Box>
                    ) : selectedStudentData ? (
                        <Box>
                            {/* Student Basic Info Card */}
                            <Card sx={{ m: 3, background: 'linear-gradient(135deg, #0f1f3d 0%, #1e3c72 100%)', color: 'white' }}>
                                <CardContent>
                                    <Grid container spacing={3} alignItems="center">
                                        <Grid item>
                                            <Avatar 
                                                sx={{ 
                                                    width: 80, 
                                                    height: 80, 
                                                    fontSize: '2rem',
                                                    bgcolor: 'rgba(255,255,255,0.2)'
                                                }}
                                            >
                                                {selectedStudentData.name?.charAt(0)?.toUpperCase() || 'S'}
                                            </Avatar>
                                        </Grid>
                                        <Grid item xs>
                                            <Typography variant="h5" fontWeight="600" gutterBottom>
                                                {selectedStudentData.name}
                                            </Typography>
                                            <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                                {selectedStudentData.email}
                                            </Typography>
                                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                                Batch: {selectedStudentData.batch_name || selectedStudentData.batches?.[0]?.batch_name || selectedStudentData.batches?.[0]?.name || 'N/A'}
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <Chip 
                                                label={selectedStudentData.course_name || selectedStudentData.course?.name || 'Course N/A'} 
                                                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>

                            {/* Tabs */}
                            <Paper sx={{ mx: 3, mb: 3 }}>
                                <Tabs 
                                    value={studentDetailsTabValue} 
                                    onChange={handleStudentDetailsTabChange}
                                    sx={{ 
                                        borderBottom: 1, 
                                        borderColor: 'divider',
                                        '& .MuiTab-root': {
                                            textTransform: 'none',
                                            fontWeight: 500
                                        }
                                    }}
                                >
                                    <Tab 
                                        icon={<PersonIcon />} 
                                        label="Profile" 
                                    />
                                    <Tab 
                                        icon={<DescriptionIcon />} 
                                        label="Resume" 
                                    />
                                    <Tab 
                                        icon={<AssessmentIcon />} 
                                        label="Scorecards" 
                                    />
                                    <Tab 
                                        icon={<WorkIcon />} 
                                        label="Applied Jobs" 
                                    />
                                </Tabs>

                                {/* Profile Tab */}
                                {studentDetailsTabValue === 0 && (
                                    <Box sx={{ p: 3 }}>
                                        <Grid container spacing={3}>
                                            {/* Personal Information */}
                                            <Grid item xs={12} md={6}>
                                                <Card>
                                                    <CardContent>
                                                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <PersonIcon sx={{ mr: 1 }} />
                                                            Personal Information
                                                        </Typography>
                                                        <List dense>
                                                            <ListItem>
                                                                <ListItemIcon>
                                                                    <EmailIcon />
                                                                </ListItemIcon>
                                                                <ListItemText 
                                                                    primary="Email" 
                                                                    secondary={selectedStudentData.email || 'N/A'} 
                                                                />
                                                            </ListItem>
                                                            <ListItem>
                                                                <ListItemIcon>
                                                                    <PhoneIcon />
                                                                </ListItemIcon>
                                                                <ListItemText 
                                                                    primary="Phone" 
                                                                    secondary={`${selectedStudentData.country_code || '+91'} ${selectedStudentData.phone || 'N/A'}`} 
                                                                />
                                                            </ListItem>
                                                            <ListItem>
                                                                <ListItemIcon>
                                                                    <CalendarIcon />
                                                                </ListItemIcon>
                                                                <ListItemText 
                                                                    primary="Date of Birth" 
                                                                    secondary={formatDate(selectedStudentData.birthday)} 
                                                                />
                                                            </ListItem>
                                                            <ListItem>
                                                                <ListItemIcon>
                                                                    <PersonIcon />
                                                                </ListItemIcon>
                                                                <ListItemText 
                                                                    primary="Gender" 
                                                                    secondary={selectedStudentData.gender || 'N/A'} 
                                                                />
                                                            </ListItem>
                                                            <ListItem>
                                                                <ListItemIcon>
                                                                    <LocationIcon />
                                                                </ListItemIcon>
                                                                <ListItemText 
                                                                    primary="Address" 
                                                                    secondary={selectedStudentData.address || 'N/A'} 
                                                                />
                                                            </ListItem>
                                                            <ListItem>
                                                                <ListItemIcon>
                                                                    <LocationIcon />
                                                                </ListItemIcon>
                                                                <ListItemText 
                                                                    primary="City" 
                                                                    secondary={selectedStudentData.city || 'N/A'} 
                                                                />
                                                            </ListItem>
                                                            <ListItem>
                                                                <ListItemIcon>
                                                                    <LocationIcon />
                                                                </ListItemIcon>
                                                                <ListItemText 
                                                                    primary="Pincode" 
                                                                    secondary={selectedStudentData.pincode || 'N/A'} 
                                                                />
                                                            </ListItem>
                                                            {selectedStudentData.aadhaar_number && (
                                                            <ListItem>
                                                                <ListItemIcon>
                                                                        <DescriptionIcon />
                                                                </ListItemIcon>
                                                                <ListItemText 
                                                                        primary="Aadhaar Number" 
                                                                        secondary={selectedStudentData.aadhaar_number} 
                                                                />
                                                            </ListItem>
                                                            )}
                                                            {selectedStudentData.linkedin_profile && (
                                                            <ListItem>
                                                                <ListItemIcon>
                                                                        <LinkedInIcon />
                                                                </ListItemIcon>
                                                                <ListItemText 
                                                                        primary="LinkedIn Profile" 
                                                                        secondary={
                                                                            <a 
                                                                                href={selectedStudentData.linkedin_profile} 
                                                                                target="_blank" 
                                                                                rel="noopener noreferrer"
                                                                                style={{ color: '#1976d2', textDecoration: 'none' }}
                                                                            >
                                                                                View Profile
                                                                            </a>
                                                                        } 
                                                                />
                                                            </ListItem>
                                                            )}
                                                        </List>
                                                    </CardContent>
                                                </Card>
                                            </Grid>



                                            {/* Parent Information */}
                                             {(selectedStudentData.parent_name || selectedStudentData.parent_email || selectedStudentData.parent_contact || selectedStudentData.parent_occupation) && (
                                            <Grid item xs={12}>
                                                <Card>
                                                    <CardContent>
                                                        <Typography variant="h6" gutterBottom>
                                                            Parent Information
                                                        </Typography>
                                                        <Grid container spacing={2}>
                                                                 {selectedStudentData.parent_name && (
                                                            <Grid item xs={12} md={6}>
                                                                <Typography variant="subtitle2" color="text.secondary">
                                                                    Parent Name
                                                                </Typography>
                                                                <Typography variant="body1">
                                                                             {selectedStudentData.parent_name}
                                                                </Typography>
                                                            </Grid>
                                                                 )}
                                                                 {selectedStudentData.parent_email && (
                                                            <Grid item xs={12} md={6}>
                                                                <Typography variant="subtitle2" color="text.secondary">
                                                                    Parent Email
                                                                </Typography>
                                                                <Typography variant="body1">
                                                                             {selectedStudentData.parent_email}
                                                                </Typography>
                                                            </Grid>
                                                                 )}
                                                                 {selectedStudentData.parent_contact && (
                                                            <Grid item xs={12} md={6}>
                                                                <Typography variant="subtitle2" color="text.secondary">
                                                                    Parent Contact
                                                                </Typography>
                                                                <Typography variant="body1">
                                                                             {selectedStudentData.parent_contact}
                                                                </Typography>
                                                            </Grid>
                                                                 )}
                                                                 {selectedStudentData.parent_occupation && (
                                                            <Grid item xs={12} md={6}>
                                                                <Typography variant="subtitle2" color="text.secondary">
                                                                    Parent Occupation
                                                                </Typography>
                                                                <Typography variant="body1">
                                                                             {selectedStudentData.parent_occupation}
                                                                </Typography>
                                                            </Grid>
                                                                 )}
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                             )}

                                             {/* Education Details */}
                                             {selectedStudentData.education && selectedStudentData.education.length > 0 && (
                                                 <Grid item xs={12}>
                                                <Card>
                                                    <CardContent>
                                                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                                                 <SchoolIcon sx={{ mr: 1 }} />
                                                                 Education Details
                                                        </Typography>
                                                             <Grid container spacing={2}>
                                                                 {selectedStudentData.education.map((edu, index) => (
                                                                     <Grid item xs={12} key={index}>
                                                                         <Card variant="outlined" sx={{ p: 2 }}>
                                                                             <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                                                                 {edu.institute_name || 'Institute Name N/A'}
                                                                </Typography>
                                                                             <Grid container spacing={1}>
                                                                                 <Grid item xs={12} md={6}>
                                                            <Typography variant="body2" color="text.secondary">
                                                                                         Degree: {edu.degree_type?.name || 'N/A'}
                                                            </Typography>
                                                                                 </Grid>
                                                                                 {edu.specialization?.name && (
                                                                                     <Grid item xs={12} md={6}>
                                                                                         <Typography variant="body2" color="text.secondary">
                                                                                             Specialization: {edu.specialization.name}
                                                                                         </Typography>
                                                                                     </Grid>
                                                                                 )}
                                                                                 <Grid item xs={12} md={6}>
                                                                                     <Typography variant="body2" color="text.secondary">
                                                                                         Duration: {formatDate(edu.duration_from)} - {formatDate(edu.duration_to)}
                                                                                     </Typography>
                                                                                 </Grid>
                                                                                 <Grid item xs={12} md={6}>
                                                                                     <Typography variant="body2" color="text.secondary">
                                                                                         CGPA/Percentage: {edu.percentage_cgpa || 'N/A'}%
                                                                                     </Typography>
                                                                                 </Grid>
                                                                                 <Grid item xs={12}>
                                                                                     <Typography variant="body2" color="text.secondary">
                                                                                         Location: {edu.location || 'N/A'}
                                                                                     </Typography>
                                                                                 </Grid>
                                                                             </Grid>
                                                                         </Card>
                                                                     </Grid>
                                                                 ))}
                                                             </Grid>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                             )}

                                             {/* Projects */}
                                             {selectedStudentData.projects && selectedStudentData.projects.length > 0 && (
                                                 <Grid item xs={12}>
                                                <Card>
                                                    <CardContent>
                                                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                                                 <WorkIcon sx={{ mr: 1 }} />
                                                                 Projects
                                                        </Typography>
                                                             <Grid container spacing={2}>
                                                                 {selectedStudentData.projects.map((project, index) => (
                                                                     <Grid item xs={12} key={index}>
                                                                         <Card variant="outlined" sx={{ p: 2 }}>
                                                                             <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                                                                 {project.title || 'Project Title N/A'}
                                                                </Typography>
                                                                             <Grid container spacing={1}>
                                                                                 {project.role && (
                                                                                     <Grid item xs={12} md={6}>
                                                                                         <Typography variant="body2" color="text.secondary">
                                                                                             Role: {project.role}
                                                                                         </Typography>
                                                                                     </Grid>
                                                                                 )}
                                                                                 {project.technologies && (
                                                                                     <Grid item xs={12} md={6}>
                                                                                         <Typography variant="body2" color="text.secondary">
                                                                                             Technologies: {project.technologies}
                                                                </Typography>
                                                                                     </Grid>
                                                                                 )}
                                                                                 <Grid item xs={12} md={6}>
                                                                                     <Typography variant="body2" color="text.secondary">
                                                                                         Duration: {formatDate(project.start_date)} - {project.is_ongoing ? 'Present' : formatDate(project.end_date)}
                                                                </Typography>
                                                                                 </Grid>
                                                                                 {project.team_size && (
                                                                                     <Grid item xs={12} md={6}>
                                                                                         <Typography variant="body2" color="text.secondary">
                                                                                             Team Size: {project.team_size}
                                                                                         </Typography>
                                                                                     </Grid>
                                                                                 )}
                                                                                 {project.project_type && (
                                                                                     <Grid item xs={12} md={6}>
                                                                                         <Typography variant="body2" color="text.secondary">
                                                                                             Project Type: {project.project_type}
                                                                                         </Typography>
                                                                                     </Grid>
                                                                                 )}
                                                                                 {project.client_name && (
                                                                                     <Grid item xs={12} md={6}>
                                                                                         <Typography variant="body2" color="text.secondary">
                                                                                             Client: {project.client_name}
                                                                                         </Typography>
                                                                                     </Grid>
                                                                                 )}
                                                                                 <Grid item xs={12}>
                                                                                     <Typography variant="body2" color="text.secondary">
                                                                                         Description: {project.description || 'No description available'}
                                                                                     </Typography>
                                                                                 </Grid>
                                                                                 {project.key_achievements && (
                                                                                     <Grid item xs={12}>
                                                                                         <Typography variant="body2" color="text.secondary">
                                                                                             Key Achievements: {project.key_achievements}
                                                                                         </Typography>
                                                                                     </Grid>
                                                                                 )}
                                                                                 {(project.project_url || project.github_url) && (
                                                                                     <Grid item xs={12}>
                                                                <Box display="flex" gap={1}>
                                                                                             {project.project_url && (
                                                                    <Button
                                                                        size="small"
                                                                        variant="outlined"
                                                                                                     startIcon={<OpenInNewIcon />}
                                                                                                     onClick={() => window.open(project.project_url, '_blank')}
                                                                    >
                                                                                                     View Project
                                                                    </Button>
                                                                                             )}
                                                                                             {project.github_url && (
                                                                    <Button
                                                                        size="small"
                                                                        variant="outlined"
                                                                                                     startIcon={<OpenInNewIcon />}
                                                                                                     onClick={() => window.open(project.github_url, '_blank')}
                                                                    >
                                                                                                     View GitHub
                                                                    </Button>
                                                                                             )}
                                                                </Box>
                                                                                     </Grid>
                                                                                 )}
                                                                             </Grid>
                                                                         </Card>
                                                                     </Grid>
                                                                 ))}
                                                             </Grid>
                                                         </CardContent>
                                                     </Card>
                                                 </Grid>
                                             )}

                                             {/* Certifications */}
                                             {selectedStudentData.certifications && selectedStudentData.certifications.length > 0 && (
                                                 <Grid item xs={12}>
                                                     <Card>
                                                         <CardContent>
                                                             <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                                                 <AssessmentIcon sx={{ mr: 1 }} />
                                                                 Certifications
                                                             </Typography>
                                                             <Grid container spacing={2}>
                                                                 {selectedStudentData.certifications.map((cert, index) => (
                                                                     <Grid item xs={12} md={6} key={index}>
                                                                         <Card variant="outlined" sx={{ p: 2 }}>
                                                                             <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                                                                 {cert.certification_name || 'Certification Name N/A'}
                                                                             </Typography>
                                                                             <Grid container spacing={1}>
                                                                                 <Grid item xs={12}>
                                                            <Typography variant="body2" color="text.secondary">
                                                                                         Authority: {cert.authority || 'N/A'}
                                                            </Typography>
                                                                                 </Grid>
                                                                                 <Grid item xs={12} md={6}>
                                                                                     <Typography variant="body2" color="text.secondary">
                                                                                         Date: {formatDate(cert.certification_date)}
                                                                                     </Typography>
                                                                                 </Grid>
                                                                                 {cert.score && (
                                                                                     <Grid item xs={12} md={6}>
                                                                                         <Typography variant="body2" color="text.secondary">
                                                                                             Score: {cert.score}%
                                                                                         </Typography>
                                                                                     </Grid>
                                                                                 )}
                                                                                 {cert.certificate_number && (
                                                                                     <Grid item xs={12}>
                                                                                         <Typography variant="body2" color="text.secondary">
                                                                                             Certificate Number: {cert.certificate_number}
                                                                                         </Typography>
                                                                                     </Grid>
                                                                                 )}
                                                                             </Grid>
                                                                         </Card>
                                                                     </Grid>
                                                                 ))}
                                                             </Grid>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                             )}
                                         </Grid>
                                    </Box>
                                )}

                                {/* Resume Tab */}
                                {studentDetailsTabValue === 1 && (
                                    <Box sx={{ p: 3 }}>
                                        <Grid container spacing={3}>
                                            {/* Resume - Full Width Display */}
                                                <Grid item xs={12}>
                                                    <Card>
                                                        <CardContent>
                                                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <DescriptionIcon sx={{ mr: 1 }} />
                                                            Resume
                                                            </Typography>
                                                        {selectedStudentData.upload_resume ? (
                                                            <Box>
                                                                <Box display="flex" gap={1} mb={2}>
                                                            <Button
                                                                        variant="outlined"
                                                                        startIcon={<DownloadIcon />}
                                                                        onClick={() => downloadFile(getDocumentUrl(selectedStudentData.upload_resume), 'resume.pdf')}
                                                                    >
                                                                        Download Resume
                                                            </Button>
                                                                </Box>
                                                                <Box sx={{ 
                                                                    width: '100%', 
                                                                    height: '600px', 
                                                                    border: '1px solid #e0e0e0',
                                                                    borderRadius: '4px',
                                                                    overflow: 'hidden'
                                                                }}>
                                                                    <iframe
                                                                        src={getDocumentUrl(selectedStudentData.upload_resume)}
                                                                        title="Student Resume"
                                                                        width="100%"
                                                                        height="100%"
                                                                        style={{ border: 'none' }}
                                                                    />
                                                                </Box>
                                                            </Box>
                                                        ) : (
                                                            <Box sx={{ 
                                                                display: 'flex', 
                                                                flexDirection: 'column', 
                                                                alignItems: 'center', 
                                                                justifyContent: 'center',
                                                                py: 8,
                                                                textAlign: 'center'
                                                            }}>
                                                                <DescriptionIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                                                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                                                    No Resume Available
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    This student has not uploaded a resume yet.
                                                                </Typography>
                                                            </Box>
                                                        )}
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                        </Grid>
                                    </Box>
                                )}

                                {/* Scorecards Tab */}
                                {studentDetailsTabValue === 2 && (
                                    <Box sx={{ p: 3 }}>
                                        <Grid container spacing={3}>
                                            {/* Exam Results */}
                                            <Grid item xs={12}>
                                                <Card>
                                                    <CardContent>
                                                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <AssessmentIcon sx={{ mr: 1 }} />
                                                            Exam Results
                                                        </Typography>
                                                        
                                                        {studentExamResults.length > 0 ? (
                                                            <TableContainer>
                                                                <Table>
                                                                    <TableHead>
                                                                        <TableRow>
                                                                            <TableCell>Exam Name</TableCell>
                                                                            <TableCell>Marks Obtained</TableCell>
                                                                            <TableCell>Total Marks</TableCell>
                                                                            <TableCell>Percentage</TableCell>
                                                                            <TableCell>Date</TableCell>
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        {studentExamResults.map((result, index) => {
                                                                            return (
                                                                                <TableRow key={index}>
                                                                                                                                                                                                                                                    <TableCell>{result.exam_name || 'N/A'}</TableCell>
                                                                                <TableCell>{result.score || 'N/A'}</TableCell>
                                                                                    <TableCell>{result.total_marks || 'N/A'}</TableCell>
                                                                                    <TableCell>
                                                                                        {result.score && result.total_marks ? 
                                                                                            `${((parseFloat(result.score) / parseFloat(result.total_marks)) * 100).toFixed(2)}%` : 
                                                                                            'N/A'
                                                                                        }
                                                                                    </TableCell>
                                                                                    <TableCell>{formatDate(result.exam_date)}</TableCell>
                                                                                </TableRow>
                                                                            );
                                                                        })}
                                                                    </TableBody>
                                                                </Table>
                                                            </TableContainer>
                                                        ) : (
                                                            <Typography variant="body2" color="text.secondary">
                                                                No exam results available
                                                            </Typography>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            </Grid>

                                            {/* Academic Performance Summary */}
                                            <Grid item xs={12} md={6}>
                                                <Card>
                                                    <CardContent>
                                                        <Typography variant="h6" gutterBottom>
                                                            Academic Summary
                                                        </Typography>
                                                        <List dense>
                                                            <ListItem>
                                                                <ListItemText 
                                                                    primary="Total Exams Taken" 
                                                                    secondary={studentExamResults.length} 
                                                                />
                                                            </ListItem>
                                                            <ListItem>
                                                                <ListItemText 
                                                                    primary="Average Percentage" 
                                                                    secondary={
                                                                        studentExamResults.length > 0 
                                                                            ? `${(studentExamResults.reduce((sum, result) => {
                                                                                const score = result.score || result.marks_obtained;
                                                                                const total = result.total_marks || result.max_marks;
                                                                                const percentage = score && total ? 
                                                                                    (score / total) * 100 : 0;
                                                                                return sum + percentage;
                                                                            }, 0) / studentExamResults.length).toFixed(2)}%`
                                                                            : 'N/A'
                                                                    } 
                                                                />
                                                            </ListItem>
                                                            <ListItem>
                                                                <ListItemText 
                                                                    primary="Highest Score" 
                                                                    secondary={
                                                                        studentExamResults.length > 0 
                                                                            ? `${Math.max(...studentExamResults.map(r => {
                                                                                const score = r.score || r.marks_obtained;
                                                                                const total = r.total_marks || r.max_marks;
                                                                                return score && total ? 
                                                                                    (score / total) * 100 : 0;
                                                                            }))}%`
                                                                            : 'N/A'
                                                                    } 
                                                                />
                                                            </ListItem>
                                                        </List>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                )}

                                {/* Applied Jobs Tab */}
                                {studentDetailsTabValue === 3 && (
                                    <Box sx={{ p: 3 }}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <WorkIcon sx={{ mr: 1 }} />
                                                    Applied Jobs ({studentJobApplications.length})
                                                </Typography>
                                                
                                                {studentJobApplications.length > 0 ? (
                                                    <TableContainer>
                                                        <Table>
                                                                                                                                <TableHead>
                                                                        <TableRow>
                                                                            <TableCell>Job Title</TableCell>
                                                                            <TableCell>Company</TableCell>
                                                                            <TableCell>Application Date</TableCell>
                                                                            <TableCell>Job Status</TableCell>
                                                                        </TableRow>
                                                                    </TableHead>
                                                            <TableBody>
                                                                {studentJobApplications.map((application) => (
                                                                    <TableRow key={application.id}>
                                                                        <TableCell>
                                                                            <Typography variant="subtitle2" fontWeight={500}>
                                                                                {application.job_posting?.title || 'N/A'}
                                                                            </Typography>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {application.job_posting?.company?.name || 'N/A'}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {formatDate(application.application_date)}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Chip 
                                                                                label={application.status} 
                                                                                color={getStatusColor(application.status)} 
                                                                                size="small" 
                                                                            />
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                ) : (
                                                    <Typography variant="body2" color="text.secondary">
                                                        No job applications found
                                                    </Typography>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </Box>
                                )}
                            </Paper>
                        </Box>
                    ) : null}
                </DialogContent>
                
                <DialogActions sx={{ p: 3, pt: 1 }}>
                    <Button 
                        onClick={handleCloseStudentDetailsDialog}
                        sx={{ 
                            textTransform: 'none',
                            borderRadius: 2,
                            px: 3
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Company Details Dialog */}
            <Dialog 
                open={companyDetailsDialog.open} 
                onClose={handleCloseCompanyDetails} 
                maxWidth="md" 
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        boxShadow: '0 24px 38px 3px rgba(0,0,0,0.14), 0 9px 46px 8px rgba(0,0,0,0.12), 0 11px 15px -7px rgba(0,0,0,0.2)',
                    }
                }}
            >
                <DialogTitle 
                    sx={{ 
                        background: 'linear-gradient(135deg, #0f1f3d 0%, #1e3c72 100%)',
                        color: 'white',
                        py: 3,
                        position: 'relative',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '4px',
                            background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                        }
                    }}
                >
                    <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 40, height: 40 }}>
                            <BusinessIcon />
                        </Avatar>
                        <Box>
                            <Typography variant="h5" fontWeight="600">
                                Company Details
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                                {companyDetailsDialog.company?.name || 'Company Information'}
                            </Typography>
                        </Box>
                    </Box>
                </DialogTitle>
                
                <DialogContent sx={{ p: 0 }}>
                    <Box sx={{ p: 4 }}>
                        {companyDetailsDialog.company && (
                            <>
                                {/* Basic Information */}
                                <Paper 
                                    elevation={0} 
                                    sx={{ 
                                        p: 3, 
                                        mb: 3, 
                                        border: '1px solid #e2e8f0',
                                        borderRadius: 2,
                                        background: '#ffffff',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                    }}
                                >
                                    <Box display="flex" alignItems="center" gap={2} mb={3}>
                                        <Avatar sx={{ background: 'linear-gradient(135deg, #0f1f3d 0%, #1e3c72 100%)', width: 32, height: 32 }}>
                                            <BusinessIcon fontSize="small" />
                                        </Avatar>
                                        <Typography variant="h6" fontWeight="600" color="#0f1f3d">
                                            Basic Information
                                        </Typography>
                                    </Box>
                                    
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Company Name
                                                </Typography>
                                                <Typography variant="body1" fontWeight={500}>
                                                    {companyDetailsDialog.company.name || 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Website
                                                </Typography>
                                                <Typography variant="body1">
                                                    {companyDetailsDialog.company.website ? (
                                                        <a href={companyDetailsDialog.company.website} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'none' }}>
                                                            {companyDetailsDialog.company.website}
                                                        </a>
                                                    ) : 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Company Size
                                                </Typography>
                                                <Typography variant="body1">
                                                    {companyDetailsDialog.company.company_size || 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Industry
                                                </Typography>
                                                <Typography variant="body1">
                                                    {companyDetailsDialog.company.industry || 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Description
                                                </Typography>
                                                <Typography variant="body1">
                                                    {companyDetailsDialog.company.description || 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Paper>

                                {/* Company Details */}
                                <Paper 
                                    elevation={0} 
                                    sx={{ 
                                        p: 3, 
                                        mb: 3, 
                                        border: '1px solid #e2e8f0',
                                        borderRadius: 2,
                                        background: '#ffffff',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                    }}
                                >
                                    <Box display="flex" alignItems="center" gap={2} mb={3}>
                                        <Avatar sx={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', width: 32, height: 32 }}>
                                            🏢
                                        </Avatar>
                                        <Typography variant="h6" fontWeight="600" color="#059669">
                                            Company Details
                                        </Typography>
                                    </Box>
                                    
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Company Address
                                                </Typography>
                                                <Typography variant="body1">
                                                    {companyDetailsDialog.company.company_address || 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    City
                                                </Typography>
                                                <Typography variant="body1">
                                                    {companyDetailsDialog.company.city || 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    State
                                                </Typography>
                                                <Typography variant="body1">
                                                    {companyDetailsDialog.company.state || 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Country
                                                </Typography>
                                                <Typography variant="body1">
                                                    {companyDetailsDialog.company.country || 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    About Company
                                                </Typography>
                                                <Typography variant="body1">
                                                    {companyDetailsDialog.company.about_company || 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    LinkedIn URL
                                                </Typography>
                                                <Typography variant="body1">
                                                    {companyDetailsDialog.company.linkedin_url ? (
                                                        <a href={companyDetailsDialog.company.linkedin_url} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'none' }}>
                                                            {companyDetailsDialog.company.linkedin_url}
                                                        </a>
                                                    ) : 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Social Media Links
                                                </Typography>
                                                <Typography variant="body1">
                                                    {companyDetailsDialog.company.social_media_links || 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Paper>

                                {/* Contact Information */}
                                <Paper 
                                    elevation={0} 
                                    sx={{ 
                                        p: 3, 
                                        mb: 3, 
                                        border: '1px solid #e2e8f0',
                                        borderRadius: 2,
                                        background: '#ffffff',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                    }}
                                >
                                    <Box display="flex" alignItems="center" gap={2} mb={3}>
                                        <Avatar sx={{ background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)', width: 32, height: 32 }}>
                                            📞
                                        </Avatar>
                                        <Typography variant="h6" fontWeight="600" color="#dc2626">
                                            Contact Information
                                        </Typography>
                                    </Box>
                                    
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Contact Person Name
                                                </Typography>
                                                <Typography variant="body1">
                                                    {companyDetailsDialog.company.contact_person_name || 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Contact Email
                                                </Typography>
                                                <Typography variant="body1">
                                                    {companyDetailsDialog.company.contact_email_new ? (
                                                        <a href={`mailto:${companyDetailsDialog.company.contact_email_new}`} style={{ color: '#1976d2', textDecoration: 'none' }}>
                                                            {companyDetailsDialog.company.contact_email_new}
                                                        </a>
                                                    ) : 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Contact Number
                                                </Typography>
                                                <Typography variant="body1">
                                                    {companyDetailsDialog.company.contact_number ? (
                                                        <a href={`tel:${companyDetailsDialog.company.contact_number}`} style={{ color: '#1976d2', textDecoration: 'none' }}>
                                                            {companyDetailsDialog.company.contact_number}
                                                        </a>
                                                    ) : 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Alternate Contact Number
                                                </Typography>
                                                <Typography variant="body1">
                                                    {companyDetailsDialog.company.alternate_contact_number ? (
                                                        <a href={`tel:${companyDetailsDialog.company.alternate_contact_number}`} style={{ color: '#1976d2', textDecoration: 'none' }}>
                                                            {companyDetailsDialog.company.alternate_contact_number}
                                                        </a>
                                                    ) : 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Legacy Contact Person
                                                </Typography>
                                                <Typography variant="body1">
                                                    {companyDetailsDialog.company.contact_person || 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Legacy Contact Email
                                                </Typography>
                                                <Typography variant="body1">
                                                    {companyDetailsDialog.company.contact_email ? (
                                                        <a href={`mailto:${companyDetailsDialog.company.contact_email}`} style={{ color: '#1976d2', textDecoration: 'none' }}>
                                                            {companyDetailsDialog.company.contact_email}
                                                        </a>
                                                    ) : 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Legacy Contact Phone
                                                </Typography>
                                                <Typography variant="body1">
                                                    {companyDetailsDialog.company.contact_phone ? (
                                                        <a href={`tel:${companyDetailsDialog.company.contact_phone}`} style={{ color: '#1976d2', textDecoration: 'none' }}>
                                                            {companyDetailsDialog.company.contact_phone}
                                                        </a>
                                                    ) : 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Legacy Address
                                                </Typography>
                                                <Typography variant="body1">
                                                    {companyDetailsDialog.company.address || 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Paper>

                                {/* Status */}
                                <Paper 
                                    elevation={0} 
                                    sx={{ 
                                        p: 3, 
                                        mb: 3, 
                                        border: '1px solid #e2e8f0',
                                        borderRadius: 2,
                                        background: '#ffffff',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                    }}
                                >
                                    <Box display="flex" alignItems="center" gap={2} mb={3}>
                                        <Avatar sx={{ background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)', width: 32, height: 32 }}>
                                            📊
                                        </Avatar>
                                        <Typography variant="h6" fontWeight="600" color="#f59e0b">
                                            Status Information
                                        </Typography>
                                    </Box>
                                    
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Status
                                                </Typography>
                                                <Chip 
                                                    label={companyDetailsDialog.company.is_active ? 'Active' : 'Inactive'} 
                                                    color={companyDetailsDialog.company.is_active ? 'success' : 'default'} 
                                                    size="small" 
                                                />
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Created Date
                                                </Typography>
                                                <Typography variant="body1">
                                                    {companyDetailsDialog.company.created_at ? 
                                                        new Date(companyDetailsDialog.company.created_at).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        }) : 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </>
                        )}
                    </Box>
                </DialogContent>
                
                <DialogActions sx={{ p: 3, pt: 1 }}>
                    <Button 
                        onClick={handleCloseCompanyDetails}
                        sx={{ 
                            textTransform: 'none',
                            borderRadius: 2,
                            px: 3
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Job Posting Details Dialog */}
            <Dialog 
                open={jobPostingDetailsDialog.open} 
                onClose={handleCloseJobPostingDetails} 
                maxWidth="lg" 
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        boxShadow: '0 24px 38px 3px rgba(0,0,0,0.14), 0 9px 46px 8px rgba(0,0,0,0.12), 0 11px 15px -7px rgba(0,0,0,0.2)',
                    }
                }}
            >
                <DialogTitle 
                    sx={{ 
                        background: 'linear-gradient(135deg, #0f1f3d 0%, #1e3c72 100%)',
                        color: 'white',
                        py: 3,
                        position: 'relative',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '4px',
                            background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                        }
                    }}
                >
                    <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 40, height: 40 }}>
                            <WorkIcon />
                        </Avatar>
                        <Box>
                            <Typography variant="h5" fontWeight="600">
                                Job Posting Details
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                                {jobPostingDetailsDialog.jobPosting?.title || 'Job Information'}
                            </Typography>
                        </Box>
                    </Box>
                </DialogTitle>
                
                <DialogContent sx={{ p: 0 }}>
                    <Box sx={{ p: 4 }}>
                        {jobPostingDetailsDialog.jobPosting && (
                            <>
                                {/* Basic Job Information */}
                                <Paper 
                                    elevation={0} 
                                    sx={{ 
                                        p: 3, 
                                        mb: 3, 
                                        border: '1px solid #e2e8f0',
                                        borderRadius: 2,
                                        background: '#ffffff',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                    }}
                                >
                                    <Box display="flex" alignItems="center" gap={2} mb={3}>
                                        <Avatar sx={{ background: 'linear-gradient(135deg, #0f1f3d 0%, #1e3c72 100%)', width: 32, height: 32 }}>
                                            <WorkIcon fontSize="small" />
                                        </Avatar>
                                        <Typography variant="h6" fontWeight="600" color="#0f1f3d">
                                            Basic Job Information
                                        </Typography>
                                    </Box>
                                    
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Job Title
                                                </Typography>
                                                <Typography variant="body1" fontWeight={500}>
                                                    {jobPostingDetailsDialog.jobPosting.title || 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Company
                                                </Typography>
                                                <Typography variant="body1" fontWeight={500}>
                                                    {jobPostingDetailsDialog.jobPosting.company?.name || 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Job Type
                                                </Typography>
                                                <Typography variant="body1">
                                                    {jobPostingDetailsDialog.jobPosting.job_type || 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Location
                                                </Typography>
                                                <Typography variant="body1">
                                                    {jobPostingDetailsDialog.jobPosting.location || 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Experience Required
                                                </Typography>
                                                <Typography variant="body1">
                                                    {jobPostingDetailsDialog.jobPosting.experience_required ? 
                                                        `${jobPostingDetailsDialog.jobPosting.experience_required} years` : 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Vacancies
                                                </Typography>
                                                <Typography variant="body1">
                                                    {jobPostingDetailsDialog.jobPosting.vacancies || 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12}>
                                            {/* <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    J
                                                </Typography>
                                                <Typography variant="body1">
                                                    {jobPostingDetailsDialog.jobPosting.description || 'N/A'}
                                                </Typography>
                                            </Box> */}
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                   Job Description and Requirements
                                                </Typography>
                                                <Typography variant="body1">
                                                    {jobPostingDetailsDialog.jobPosting.requirements || 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Paper>

                                {/* Salary */}
                                <Paper 
                                    elevation={0} 
                                    sx={{ 
                                        p: 3, 
                                        mb: 3, 
                                        border: '1px solid #e2e8f0',
                                        borderRadius: 2,
                                        background: '#ffffff',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                    }}
                                >
                                    <Box display="flex" alignItems="center" gap={2} mb={3}>
                                        <Avatar sx={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', width: 32, height: 32 }}>
                                            💰
                                        </Avatar>
                                        <Typography variant="h6" fontWeight="600" color="#059669">
                                            Salary
                                        </Typography>
                                    </Box>
                                    
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Salary Range
                                                </Typography>
                                                <Typography variant="body1">
                                                    {jobPostingDetailsDialog.jobPosting.salary_min && jobPostingDetailsDialog.jobPosting.salary_max ? 
                                                        `₹${jobPostingDetailsDialog.jobPosting.salary_min}L - ₹${jobPostingDetailsDialog.jobPosting.salary_max}L` : 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Paper>

                                {/* Eligibility Criteria */}
                                <Paper 
                                    elevation={0} 
                                    sx={{ 
                                        p: 3, 
                                        mb: 3, 
                                        border: '1px solid #e2e8f0',
                                        borderRadius: 2,
                                        background: '#ffffff',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                    }}
                                >
                                    <Box display="flex" alignItems="center" gap={2} mb={3}>
                                        <Avatar sx={{ background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)', width: 32, height: 32 }}>
                                            📋
                                        </Avatar>
                                        <Typography variant="h6" fontWeight="600" color="#f59e0b">
                                            Eligibility Criteria
                                        </Typography>
                                    </Box>
                                    
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    B.Tech Percentage (Min)
                                                </Typography>
                                                <Typography variant="body1">
                                                                    {jobPostingDetailsDialog.jobPosting.btech_percentage_min ?
                `${jobPostingDetailsDialog.jobPosting.btech_percentage_min}%` : 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    M.Tech Percentage (Min)
                                                </Typography>
                                                <Typography variant="body1">
                                                                    {jobPostingDetailsDialog.jobPosting.mtech_percentage_min ?
                `${jobPostingDetailsDialog.jobPosting.mtech_percentage_min}%` : 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    B.Tech Year of Passout (Min)
                                                </Typography>
                                                <Typography variant="body1">
                                                    {jobPostingDetailsDialog.jobPosting.btech_year_of_passout_min || 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    B.Tech Year of Passout (Max)
                                                </Typography>
                                                <Typography variant="body1">
                                                    {jobPostingDetailsDialog.jobPosting.btech_year_of_passout_max || 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    M.Tech Year of Passout (Min)
                                                </Typography>
                                                <Typography variant="body1">
                                                    {jobPostingDetailsDialog.jobPosting.mtech_year_of_passout_min || 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    M.Tech Year of Passout (Max)
                                                </Typography>
                                                <Typography variant="body1">
                                                    {jobPostingDetailsDialog.jobPosting.mtech_year_of_passout_max || 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Backlogs Allowed
                                                </Typography>
                                                <Typography variant="body1">
                                                    {jobPostingDetailsDialog.jobPosting.backlogs_allowed || 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Mandatory Original Documents
                                                </Typography>
                                                <Typography variant="body1">
                                                    {jobPostingDetailsDialog.jobPosting.mandatory_original_documents || 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Eligible Courses
                                                </Typography>
                                                <Typography variant="body1">
                                                    {(() => {
                                                        const courses = jobPostingDetailsDialog.jobPosting.eligible_courses;
                                                        if (!courses) return 'N/A';
                                                        
                                                        let coursesArray = [];
                                                        if (typeof courses === 'string') {
                                                            try {
                                                                coursesArray = JSON.parse(courses);
                                                            } catch (e) {
                                                                coursesArray = [];
                                                            }
                                                        } else if (Array.isArray(courses)) {
                                                            coursesArray = courses;
                                                        }
                                                        
                                                        return coursesArray.length > 0 ? coursesArray.join(', ') : 'N/A';
                                                    })()}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Specializations
                                                </Typography>
                                                <Typography variant="body1">
                                                    {(() => {
                                                        const specializations = jobPostingDetailsDialog.jobPosting.specializations;
                                                        if (!specializations) return 'N/A';
                                                        
                                                        let specializationsArray = [];
                                                        if (typeof specializations === 'string') {
                                                            try {
                                                                specializationsArray = JSON.parse(specializations);
                                                            } catch (e) {
                                                                specializationsArray = [];
                                                            }
                                                        } else if (Array.isArray(specializations)) {
                                                            specializationsArray = specializations;
                                                        }
                                                        
                                                        return specializationsArray.length > 0 ? specializationsArray.join(', ') : 'N/A';
                                                    })()}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12}>
                                            {/* <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Skills Required
                                                </Typography>
                                                <Typography variant="body1">
                                                    {(() => {
                                                        const skills = jobPostingDetailsDialog.jobPosting.skills_required;
                                                        if (!skills) return 'N/A';
                                                        
                                                        let skillsArray = [];
                                                        if (typeof skills === 'string') {
                                                            try {
                                                                skillsArray = JSON.parse(skills);
                                                            } catch (e) {
                                                                skillsArray = [];
                                                            }
                                                        } else if (Array.isArray(skills)) {
                                                            skillsArray = skills;
                                                        }
                                                        
                                                        return skillsArray.length > 0 ? skillsArray.join(', ') : 'N/A';
                                                    })()}
                                                </Typography>
                                            </Box> */}
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Additional Criteria
                                                </Typography>
                                                <Typography variant="body1">
                                                    {jobPostingDetailsDialog.jobPosting.additional_criteria || 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Paper>

                                {/* Recruitment Process */}
                                <Paper 
                                    elevation={0} 
                                    sx={{ 
                                        p: 3, 
                                        mb: 3, 
                                        border: '1px solid #e2e8f0',
                                        borderRadius: 2,
                                        background: '#ffffff',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                    }}
                                >
                                    <Box display="flex" alignItems="center" gap={2} mb={3}>
                                        <Avatar sx={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)', width: 32, height: 32 }}>
                                            🎯
                                        </Avatar>
                                        <Typography variant="h6" fontWeight="600" color="#8b5cf6">
                                            Recruitment Process
                                        </Typography>
                                    </Box>
                                    
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Mode of Recruitment
                                                </Typography>
                                                <Typography variant="body1">
                                                    {jobPostingDetailsDialog.jobPosting.mode_of_recruitment || 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Interview Mode
                                                </Typography>
                                                <Typography variant="body1">
                                                    {jobPostingDetailsDialog.jobPosting.interview_mode || 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Interview Date
                                                </Typography>
                                                <Typography variant="body1">
                                                    {jobPostingDetailsDialog.jobPosting.interview_date ? 
                                                        new Date(jobPostingDetailsDialog.jobPosting.interview_date).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        }) : 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Application Deadline
                                                </Typography>
                                                <Typography variant="body1">
                                                    {jobPostingDetailsDialog.jobPosting.application_deadline ? 
                                                        new Date(jobPostingDetailsDialog.jobPosting.application_deadline).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        }) : 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Recruitment Process Steps
                                                </Typography>
                                                <Typography variant="body1">
                                                    {jobPostingDetailsDialog.jobPosting.recruitment_process_steps || 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Venue / Link
                                                </Typography>
                                                <Typography variant="body1">
                                                    {jobPostingDetailsDialog.jobPosting.venue_link ? (
                                                        jobPostingDetailsDialog.jobPosting.venue_link.startsWith('http') ? (
                                                            <a href={jobPostingDetailsDialog.jobPosting.venue_link} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'none' }}>
                                                                {jobPostingDetailsDialog.jobPosting.venue_link}
                                                            </a>
                                                        ) : jobPostingDetailsDialog.jobPosting.venue_link
                                                    ) : 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Paper>

                                {/* Additional Information */}
                                <Paper 
                                    elevation={0} 
                                    sx={{ 
                                        p: 3, 
                                        mb: 3, 
                                        border: '1px solid #e2e8f0',
                                        borderRadius: 2,
                                        background: '#ffffff',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                    }}
                                >
                                    <Box display="flex" alignItems="center" gap={2} mb={3}>
                                        <Avatar sx={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', width: 32, height: 32 }}>
                                            📄
                                        </Avatar>
                                        <Typography variant="h6" fontWeight="600" color="#ef4444">
                                            Additional Information
                                        </Typography>
                                    </Box>
                                    
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Bond / Service Agreement Details
                                                </Typography>
                                                <Typography variant="body1">
                                                    {jobPostingDetailsDialog.jobPosting.bond_service_agreement || 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Paper>

                                {/* Status Information */}
                                <Paper 
                                    elevation={0} 
                                    sx={{ 
                                        p: 3, 
                                        mb: 3, 
                                        border: '1px solid #e2e8f0',
                                        borderRadius: 2,
                                        background: '#ffffff',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                    }}
                                >
                                    <Box display="flex" alignItems="center" gap={2} mb={3}>
                                        <Avatar sx={{ background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)', width: 32, height: 32 }}>
                                            📊
                                        </Avatar>
                                        <Typography variant="h6" fontWeight="600" color="#6b7280">
                                            Status Information
                                        </Typography>
                                    </Box>
                                    
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Status
                                                </Typography>
                                                <Chip 
                                                    label={jobPostingDetailsDialog.jobPosting.status === 'open' ? 'Open' : 
                                                           jobPostingDetailsDialog.jobPosting.status === 'closed' ? 'Closed' : 
                                                           jobPostingDetailsDialog.jobPosting.status === 'on_hold' ? 'On Hold' : 
                                                           jobPostingDetailsDialog.jobPosting.status || 'Unknown'} 
                                                    color={jobPostingDetailsDialog.jobPosting.status === 'open' ? 'success' : 
                                                           jobPostingDetailsDialog.jobPosting.status === 'closed' ? 'error' : 
                                                           jobPostingDetailsDialog.jobPosting.status === 'on_hold' ? 'warning' : 'default'} 
                                                    size="small" 
                                                />
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Created Date
                                                </Typography>
                                                <Typography variant="body1">
                                                    {jobPostingDetailsDialog.jobPosting.created_at ? 
                                                        new Date(jobPostingDetailsDialog.jobPosting.created_at).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        }) : 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </>
                        )}
                    </Box>
                </DialogContent>
                
                <DialogActions sx={{ p: 3, pt: 1 }}>
                    <Button 
                        onClick={handleCloseJobPostingDetails}
                        sx={{ 
                            textTransform: 'none',
                            borderRadius: 2,
                            px: 3
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert 
                    onClose={() => setSnackbar({ ...snackbar, open: false })} 
                    severity={snackbar.severity}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AdminPlacement; 