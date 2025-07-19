import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Alert,
    CircularProgress,
    Avatar,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import {
    Person as PersonIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    School as SchoolIcon,
    Work as WorkIcon,
    LocationOn as LocationIcon,
    Edit as EditIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    Upload as UploadIcon,
    Download as DownloadIcon,
    CheckCircle as CheckCircleIcon,
    Warning as WarningIcon
} from '@mui/icons-material';

const StudentProfile = ({ studentId }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [editedProfile, setEditedProfile] = useState(null);
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    // Mock data - replace with actual API calls
    useEffect(() => {
        setTimeout(() => {
            const mockProfile = {
                id: studentId,
                name: 'John Doe',
                email: 'john.doe@example.com',
                phone: '+91 9876543210',
                qualification: 'B.Tech Computer Science',
                yearOfPassout: 2023,
                domain: 'Computer Science',
                experience: '0 years',
                designation: 'Student',
                subject: 'Computer Science',
                residentialAddress: '123 Main Street, Hyderabad, Telangana',
                parentName: 'Jane Doe',
                parentContact: '+91 9876543211',
                parentEmail: 'jane.doe@example.com',
                parentOccupation: 'Teacher',
                profileCompletion: 85,
                documents: {
                    resume: '/uploads/resume.pdf',
                    passportPhoto: '/uploads/photo.jpg',
                    markList: '/uploads/marklist.pdf',
                    aadhar: '/uploads/aadhar.pdf',
                    agreement: '/uploads/agreement.pdf'
                },
                academicDetails: {
                    tenthPercentage: 85,
                    twelfthPercentage: 78,
                    diplomaPercentage: null,
                    btechPercentage: 82,
                    mtechPercentage: null,
                    collegeName: 'ABC Engineering College',
                    internalMarks: 85
                }
            };
            setProfile(mockProfile);
            setEditedProfile(mockProfile);
            setLoading(false);
        }, 1000);
    }, [studentId]);

    const handleEdit = () => {
        setEditMode(true);
        setEditedProfile({ ...profile });
    };

    const handleSave = () => {
        setProfile(editedProfile);
        setEditMode(false);
        // Here you would typically make an API call to save the changes
    };

    const handleCancel = () => {
        setEditMode(false);
        setEditedProfile(profile);
    };

    const handleInputChange = (field, value) => {
        setEditedProfile({
            ...editedProfile,
            [field]: value
        });
    };

    const handleFileUpload = (fileType) => {
        setSelectedFile({ type: fileType, file: null });
        setUploadDialogOpen(true);
    };

    const getDocumentStatus = (documentPath) => {
        return documentPath ? 'Uploaded' : 'Not Uploaded';
    };

    const getDocumentColor = (documentPath) => {
        return documentPath ? 'success' : 'error';
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                    My Profile
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Manage your profile information for placement
                </Typography>
            </Box>

            {/* Profile Completion Status */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6">Profile Completion</Typography>
                        <Chip 
                            label={`${profile.profileCompletion}% Complete`}
                            color={profile.profileCompletion >= 90 ? "success" : "warning"}
                        />
                    </Box>
                    <Box display="flex" gap={2}>
                        <Button
                            variant="contained"
                            startIcon={<EditIcon />}
                            onClick={handleEdit}
                            disabled={editMode}
                        >
                            Edit Profile
                        </Button>
                        {editMode && (
                            <>
                                <Button
                                    variant="contained"
                                    color="success"
                                    startIcon={<SaveIcon />}
                                    onClick={handleSave}
                                >
                                    Save Changes
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<CancelIcon />}
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>
                            </>
                        )}
                    </Box>
                </CardContent>
            </Card>

            {/* Personal Information */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Personal Information
                            </Typography>
                            
                            <Box display="flex" alignItems="center" gap={2} mb={3}>
                                <Avatar sx={{ width: 80, height: 80 }}>
                                    <PersonIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6">{profile.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {profile.qualification}
                                    </Typography>
                                </Box>
                            </Box>

                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Full Name"
                                        value={editMode ? editedProfile.name : profile.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        disabled={!editMode}
                                        InputProps={{
                                            startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        value={editMode ? editedProfile.email : profile.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        disabled={!editMode}
                                        InputProps={{
                                            startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Phone"
                                        value={editMode ? editedProfile.phone : profile.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        disabled={!editMode}
                                        InputProps={{
                                            startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Residential Address"
                                        value={editMode ? editedProfile.residentialAddress : profile.residentialAddress}
                                        onChange={(e) => handleInputChange('residentialAddress', e.target.value)}
                                        disabled={!editMode}
                                        multiline
                                        rows={3}
                                        InputProps={{
                                            startAdornment: <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Academic Information
                            </Typography>
                            
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Qualification"
                                        value={editMode ? editedProfile.qualification : profile.qualification}
                                        onChange={(e) => handleInputChange('qualification', e.target.value)}
                                        disabled={!editMode}
                                        InputProps={{
                                            startAdornment: <SchoolIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Year of Passout"
                                        value={editMode ? editedProfile.yearOfPassout : profile.yearOfPassout}
                                        onChange={(e) => handleInputChange('yearOfPassout', e.target.value)}
                                        disabled={!editMode}
                                        type="number"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Domain"
                                        value={editMode ? editedProfile.domain : profile.domain}
                                        onChange={(e) => handleInputChange('domain', e.target.value)}
                                        disabled={!editMode}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Experience"
                                        value={editMode ? editedProfile.experience : profile.experience}
                                        onChange={(e) => handleInputChange('experience', e.target.value)}
                                        disabled={!editMode}
                                        InputProps={{
                                            startAdornment: <WorkIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                        }}
                                    />
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="subtitle1" gutterBottom>
                                Academic Details
                            </Typography>
                            
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="10th Percentage"
                                        value={profile.academicDetails.tenthPercentage}
                                        disabled
                                        type="number"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="12th Percentage"
                                        value={profile.academicDetails.twelfthPercentage}
                                        disabled
                                        type="number"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="B.Tech Percentage"
                                        value={profile.academicDetails.btechPercentage}
                                        disabled
                                        type="number"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="College Name"
                                        value={profile.academicDetails.collegeName}
                                        disabled
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Documents Section */}
            <Card sx={{ mt: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Required Documents
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                        Upload all required documents for placement eligibility
                    </Typography>

                    <Grid container spacing={2}>
                        {Object.entries(profile.documents).map(([docType, path]) => (
                            <Grid item xs={12} md={6} key={docType}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Box>
                                                <Typography variant="subtitle1" gutterBottom>
                                                    {docType.charAt(0).toUpperCase() + docType.slice(1)}
                                                </Typography>
                                                <Chip 
                                                    label={getDocumentStatus(path)}
                                                    color={getDocumentColor(path)}
                                                    size="small"
                                                />
                                            </Box>
                                            <Box display="flex" gap={1}>
                                                {path && (
                                                    <Button
                                                        size="small"
                                                        startIcon={<DownloadIcon />}
                                                        onClick={() => window.open(path, '_blank')}
                                                    >
                                                        View
                                                    </Button>
                                                )}
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    startIcon={<UploadIcon />}
                                                    onClick={() => handleFileUpload(docType)}
                                                >
                                                    {path ? 'Update' : 'Upload'}
                                                </Button>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
            </Card>

            {/* Parent Information */}
            <Card sx={{ mt: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Parent Information
                    </Typography>
                    
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Parent Name"
                                value={editMode ? editedProfile.parentName : profile.parentName}
                                onChange={(e) => handleInputChange('parentName', e.target.value)}
                                disabled={!editMode}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Parent Contact"
                                value={editMode ? editedProfile.parentContact : profile.parentContact}
                                onChange={(e) => handleInputChange('parentContact', e.target.value)}
                                disabled={!editMode}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Parent Email"
                                value={editMode ? editedProfile.parentEmail : profile.parentEmail}
                                onChange={(e) => handleInputChange('parentEmail', e.target.value)}
                                disabled={!editMode}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Parent Occupation"
                                value={editMode ? editedProfile.parentOccupation : profile.parentOccupation}
                                onChange={(e) => handleInputChange('parentOccupation', e.target.value)}
                                disabled={!editMode}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* File Upload Dialog */}
            <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Upload {selectedFile?.type}</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" paragraph>
                        Please select a file to upload for {selectedFile?.type}
                    </Typography>
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) => setSelectedFile({ ...selectedFile, file: e.target.files[0] })}
                        style={{ width: '100%' }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setUploadDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button 
                        variant="contained"
                        onClick={() => {
                            // Handle file upload logic here
                            setUploadDialogOpen(false);
                        }}
                        disabled={!selectedFile?.file}
                    >
                        Upload
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default StudentProfile; 