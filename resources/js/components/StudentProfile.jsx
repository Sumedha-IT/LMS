import { Box, Button, Card, CardContent, CardMedia, Chip, IconButton, LinearProgress, SvgIcon, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import PhoneIcon from '@mui/icons-material/Phone';
import MailIcon from '@mui/icons-material/Mail';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import EditIcon from '@mui/icons-material/Edit'; //Import Edit icon
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import SchoolIcon from '@mui/icons-material/School';
import InfoIcon from '@mui/icons-material/Info';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import AddCertification from './jobBoard/AddCertification';
import AddPersonalDetail from './jobBoard/AddPersonalDetail';
import AddSocialLink from './jobBoard/AddSocialLink';
import StudentProfileEdit from './jobBoard/StudentProfileEdit';
import AddProject from './jobBoard/AddProject';
import FolderIcon from '@mui/icons-material/Folder';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AddWorkExperience from './jobBoard/AddWorkExperience';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LinkIcon from '@mui/icons-material/Link';
import AddEducation from './jobBoard/AddEducation';
import AddAward from './jobBoard/AddAward';
import parse from 'html-react-parser';
import AddOtherDetails from './jobBoard/AddOtherDetails';
const StudentProfile = ({ data, onDataChange, changeTap }) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isPopUpPersonal, setIsPopUpPersonal] = useState(false);
    const [isPopUpSocial, setIsPopupSocial] = useState(false)
    const [socialMediaName, setSociaMedialName] = useState({})
    const [isPopupStudent, setIsPopupStudent] = useState(false)
    const [isPopupProject, setIsPopupProject] = useState(false)
    const [isPopupWork, setIsPopupWork] = useState(false)
    const [isPopupEducation, setIsPopupEducation] = useState(false)
    const [awardPopup, setAwardPopup] = useState(false)
    const [studentData, setStudentData] = useState([])
    const [certificateData, setCertificateData] = useState([])
    const [experienceData, setExperienceData] = useState([])
    const [educationData, setEducationData] = useState([])
    const [projectData, setProjectData] = useState([])
    const [awardData, setAwardData] = useState([])
    const [otherData, setOtherData] = useState([])
    const [otherPopup, setOtherPopup] = useState(false)

    useEffect(() => {
        if (data) {
            setStudentData(data.data);
        }
    }, [data]);
    const handleAddCertification = (e, data) => {
        setIsPopupOpen(true);
        setCertificateData(data)
    }
    const handleAddPersonalDetails = () => {
        setIsPopUpPersonal(true);
    }
    const handleAddSocial = (socialMediaUrl) => {
        setIsPopupSocial(true);
        setSociaMedialName(socialMediaUrl)
    }

    const handleEditStudent = () => {
        setIsPopupStudent(true)
    }
    const handleAddExperirnce = (data) => {
        setIsPopupWork(true)
        setExperienceData(data)
    }
    const handleAddEducations = (data) => {
        setIsPopupEducation(true)
        setEducationData(data)
    }
    const handleAddProject = (data) => {
        setIsPopupProject(true)
        setProjectData(data)
    }
    const handleProfileUpdate = (profile) => {
        let newData = { ...studentData, profile }
        setStudentData(newData);
        onDataChange();
    };
    const handleExperienceUpdate = (profileExperiences) => {
        const updatedData = {
            ...studentData,
            profileExperiences: studentData.profileExperiences.some(experience => experience.id === profileExperiences.id)
                ? studentData.profileExperiences.map(experience =>
                    experience.id === profileExperiences.id ? { ...experience, ...profileExperiences } : experience
                )
                : [...studentData.profileExperiences, profileExperiences]
        };
        setStudentData(updatedData);
    }
    const handleEductionsUpdate = (profileEducations) => {
        const updatedData = {
            ...studentData,
            profileEducations: studentData.profileEducations.some(education => education.id === profileEducations.id)
                ? studentData.profileEducations.map(education =>
                    education.id === profileEducations.id ? { ...education, ...profileEducations } : education
                )
                : [...studentData.profileEducations, profileEducations]
        };

        setStudentData(updatedData);
    }
    const handleProjectUpdate = (projects) => {
        const updatedData = {
            ...studentData,
            projects: studentData.projects.some(project => project.id === projects.id)
                ? studentData.projects.map(project =>
                    project.id === projects.id ? { ...project, ...projects } : project
                )
                : [...studentData.projects, projects]
        };

        setStudentData(updatedData);
    }
    const handleAwardsUpdate = (awards) => {
        const updatedData = {
            ...studentData,
            awards: studentData.awards.some(award => award.id === awards.id)
                ? studentData.awards.map(award =>
                    award.id === awards.id ? { ...award, ...awards } : award
                )
                : [...studentData.awards, awards]
        };

        setStudentData(updatedData);
    }
    const handleCertificateUpdate = (certificates) => {
        const updatedData = {
            ...studentData,
            certificates: studentData.certificates.some(certificate => certificate.id === certificates.id)
                ? studentData.certificates.map(certificate =>
                    certificate.id === certificates.id ? { ...certificate, ...certificates } : certificate
                )
                : [...studentData.certificates, certificates]
        };

        setStudentData(updatedData);
    }
    const handleAddAward = (changeAward) => {
        setAwardData(changeAward)
        setAwardPopup(true)
    }
    const handleAddOthers = (otherData) => {
        setOtherData(otherData)
        setOtherPopup(true)
    }
    const [showFullText, setShowFullText] = useState(false);

    const getDisplayedText = (text) => {
        if (!text) return '';
        const words = text.split(' ');
        if (words.length > 10 && !showFullText) {
            return words.slice(0, 10).join(' ') + '...';
        }
        return text;
    };
    const convertHtmlToText = (html) => {
        // Use DOMParser to convert HTML to text content
        console.log(html, "xdsjdij")
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        console.log(doc, "xdsjdij")
        const renderNode = (node) => {
            console.log(node)
            switch (node.nodeName.nodeName) {
                case 'BODY':
                    return <Typography variant="body1" sx={{ fontWeight: 600 }}> {node.textContent} </Typography>;
                case 'P':
                    return <Typography variant="body1" sx={{ fontWeight: 600 }}> {node.textContent} </Typography>;
                case 'UL':
                    return (
                        <ul>
                            {Array.from(node.children).map((child, index) => (
                                <li key={index}>{renderNode(child)} </li>
                            ))}
                        </ul>
                    );
                case 'LI':
                    return <Typography variant="body2">{node.textContent} </Typography>;
                case 'B':
                    return <b>{node.textContent} </b>;
                case 'I':
                    return <i>{node.textContent} </i>;
                case 'H1':
                    return <Typography variant="h1">{node.textContent} </Typography>;
                case 'H2':
                    return <Typography variant="h2">{node.textContent} </Typography>;
                // Add more cases as needed for other tags
                default:
                    return <span>{node.textContent}</span>;  // Default rendering for unsupported tags
            }
        };
        return renderNode(doc.body);
    }

    const awardsText = convertHtmlToText(studentData?.profile?.achievements);

    return (
        <Box display="flex" width="100%" mt={2} >
            <Box sx={{ flex: 2, mr: 1 }} >
                <Card sx={{ display: 'flex', flexDirection: 'column', position: 'relative', mb: 2 }}>
                    <CardContent sx={{ display: 'flex' }}>

                        <CardContent>
                            <Typography variant="h4" component="div" gutterBottom>
                                {studentData?.profile?.name || "NAN"}
                            </Typography>

                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <PhoneIcon fontSize="small" sx={{ mr: 1 }} />
                                    <Typography variant="body2">   +91{studentData?.profile?.phone || "00000000"} </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <MailIcon fontSize="small" sx={{ mr: 1 }} />
                                    <Typography variant="body2"> {studentData?.profile?.email || "EMAIL"}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
                                    <Typography variant="body2">{studentData?.profile?.currentLocation || "NAN"}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <WorkIcon fontSize="small" sx={{ mr: 1 }} />
                                    <Typography variant="body2">{+(studentData?.profile?.totalExperience) || 0} Years</Typography>
                                </Box>

                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: "center", gap: 1, mt: 2 }}>
                                <Typography variant="h6" >About Me :</Typography>
                                <Typography>
                                    {getDisplayedText(studentData?.profile?.aboutMe)}</Typography>
                                {studentData?.profile?.aboutMe && studentData.profile.aboutMe.split(' ').length > 10 && (
                                    <Button
                                        variant="text"
                                        color="primary"
                                        sx={{ padding: 0 }}
                                        onClick={() => setShowFullText(!showFullText)} // Toggle showFullText on button click
                                    >
                                        {showFullText ? 'See less' : 'See more'}
                                    </Button>
                                )}
                            </Box>
                        </CardContent>
                    </CardContent>

                    {studentData?.profile ? (<IconButton aria-label="edit-profile" sx={{ position: 'absolute', top: 8, right: 8 }} onClick={handleEditStudent}>
                        <EditIcon />
                    </IconButton>) : null}
                    <StudentProfileEdit
                        studentProfileData={studentData?.profile || []}
                        open={isPopupStudent}
                        onClose={() => setIsPopupStudent(false)}
                        onProfileUpdate={handleProfileUpdate}
                    />
                </Card>
                <Card sx={{ padding: 3, mb: 2 }}>
                    <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="h6" component="div">
                                {Math.floor(studentData?.profileScore)}% Profile Completed
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={studentData?.profileScore || 0}
                            sx={{ height: 10, borderRadius: 5, backgroundColor: '#e0e0e0', mt: 1 }}
                        />
                    </Box>

                    {studentData?.profileScore === 100 ? null :
                        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                            {studentData?.completeDetails?.profileDetails === 0 && (
                                <Card sx={{ padding: 3 }}>
                                    <Typography variant="h6">Profile Details</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Complete your profile details to give recruiters a complete picture of your background.
                                    </Typography>
                                    <Button variant="contained" sx={{ mt: 2 }} onClick={handleEditStudent}>
                                        Add Profile Details
                                    </Button>
                                    <Chip label={`Add ${Math.floor(studentData.percentageContribution)}%`} color="primary" sx={{ mt: 2, ml: 1 }} />
                                </Card>
                            )}

                            {studentData?.completeDetails?.certificates === 0 && (
                                <Card sx={{ padding: 3 }}>
                                    <Typography variant="h6">Certificates</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Adding your Certificates will help recruiters connect with you better.
                                    </Typography>
                                    <Button variant="contained" sx={{ mt: 2 }} onClick={(e) => handleAddCertification(e, [])}>
                                        Add Certificates Details
                                    </Button>
                                    <Chip label={`Add ${Math.floor(studentData.percentageContribution)}%`} color="primary" sx={{ mt: 2, ml: 1 }} />

                                </Card>
                            )}

                            {studentData?.completeDetails?.profileExperiences === 0 && (
                                <Card sx={{ padding: 3 }}>
                                    <Typography variant="h6">Work Experience</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Add your work experience to showcase your professional background and skills.
                                    </Typography>
                                    <Button variant="contained" sx={{ mt: 2 }} onClick={() => handleAddExperirnce([])}>
                                        Add Experience
                                    </Button>
                                    <Chip label={`Add ${Math.floor(studentData.percentageContribution)}%`} color="primary" sx={{ mt: 2, ml: 1 }} />

                                </Card>
                            )}
                            {studentData?.completeDetails?.profileEducations === 0 && (
                                <Card sx={{ padding: 3 }}>
                                    <Typography variant="h6">Educations</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Include your Educations to boost profile.
                                    </Typography>
                                    <Button variant="contained" sx={{ mt: 2 }} onClick={() => handleAddEducations([])}>
                                        Add Educations
                                    </Button>
                                    <Chip label={`Add ${Math.floor(studentData.percentageContribution)}%`} color="primary" sx={{ mt: 2, ml: 1 }} />

                                </Card>
                            )}
                            {studentData?.completeDetails?.projects === 0 && (
                                <Card sx={{ padding: 3 }}>
                                    <Typography variant="h6">Projects</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Include your projects to boost your resume's credibility and showcase your expertise.
                                    </Typography>
                                    <Button variant="contained" sx={{ mt: 2 }} onClick={handleAddProject}>
                                        Add Projects
                                    </Button>
                                    <Chip label={`Add ${Math.floor(studentData.percentageContribution)}%`} color="primary" sx={{ mt: 2, ml: 1 }} />

                                </Card>
                            )}
                            {studentData?.completeDetails?.resume === 0 && (
                                <Card sx={{ padding: 3 }}>
                                    <Typography variant="h6">Resume</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Include your resume will help recruiters connect with you better..
                                    </Typography>
                                    <Button variant="contained" sx={{ mt: 2 }} onClick={() => changeTap(null, 1)}>
                                        Add Resume
                                    </Button>
                                    <Chip label={`Add ${Math.floor(studentData.percentageContribution)}%`} color="primary" sx={{ mt: 2, ml: 1 }} />

                                </Card>
                            )}
                        </Box>

                    }

                </Card>
                <Card sx={{ padding: 3, mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <SvgIcon component={BusinessCenterOutlinedIcon} sx={{ fontSize: 30, mr: 1 }} />
                            <Typography variant="h6">Work Experience</Typography>
                        </Box>
                        <IconButton aria-label="Add Work Experience" onClick={() => handleAddExperirnce([])}>
                            <AddIcon sx={{ border: 1, borderRadius: 3, color: "black" }} />
                        </IconButton>
                    </Box>
                    {studentData?.profileExperiences ? (
                        <Box sx={{ mt: 3 }}>
                            {studentData.profileExperiences.map((experience, index) => (
                                <Box sx={{ mt: 3 }} key={index}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{experience.organisation}</Typography>
                                        <IconButton aria-label="Edit Work Experience" onClick={() => handleAddExperirnce(experience)}>
                                            <EditIcon sx={{ fontSize: 20 }} />
                                        </IconButton>

                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>{experience.jobRole} • &nbsp;</Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>{experience.jobType}</Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">{experience.startedAt} - {experience.endsAt}</Typography>
                                </Box>
                            ))}
                        </Box>
                    ) : null}
                    <AddWorkExperience
                        experienceData={experienceData}
                        open={isPopupWork}
                        onClose={() => setIsPopupWork(false)}
                        onExperienceUpdate={handleExperienceUpdate}
                        onDataChange={onDataChange}
                    />
                </Card>
                <Card sx={{ padding: 3, mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <SvgIcon component={SchoolIcon} sx={{ fontSize: 30, mr: 1 }} />
                            <Typography variant="h6">Education</Typography>
                        </Box>
                        <IconButton aria-label="Add Education" onClick={() => handleAddEducations([])}>
                            <AddIcon sx={{ border: 1, borderRadius: 3, color: "black" }} />
                        </IconButton>
                    </Box>
                    {studentData?.profileEducations ? (
                        <Box sx={{ mt: 3 }}>
                            {studentData.profileEducations.map((education, index) => (
                                <Box sx={{ mt: 3 }} key={index}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{education.institute} </Typography>
                                        <IconButton aria-label="Edit education" onClick={() => handleAddEducations(education)}>
                                            <EditIcon sx={{ fontSize: 20 }} />
                                        </IconButton>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>{education.degreeType} •  &nbsp;</Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>{education.course}  •  &nbsp;</Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>Percentage : {education.result} /100</Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">{education.startedAt} - {education.endsAt}</Typography>
                                </Box>
                            ))}
                        </Box>
                    ) : null}
                    <AddEducation
                        educationData={educationData}
                        open={isPopupEducation}
                        onClose={() => setIsPopupEducation(false)}
                        onEductionsUpdate={handleEductionsUpdate}
                        onDataChange={onDataChange}
                    />
                </Card>
                <Card sx={{ padding: 3, mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <SvgIcon component={FolderIcon} sx={{ fontSize: 30, mr: 1 }} />
                            <Typography variant="h6">Projects</Typography>
                        </Box>
                        <IconButton aria-label="Add Projects" onClick={handleAddProject}>
                            <AddIcon sx={{ border: 1, borderRadius: 3, color: "black" }} />
                        </IconButton>
                    </Box>
                    {studentData?.projects ? (
                        <Box sx={{ mt: 3 }}>
                            {studentData.projects.map((project, index) => (
                                <Box sx={{ mt: 3 }} key={index}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{project.name} </Typography>
                                        <IconButton aria-label="Edit project" onClick={() => handleAddProject(project)}>
                                            <EditIcon sx={{ fontSize: 20 }} />
                                        </IconButton>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>{project.description} </Typography>

                                    </Box>
                                    <Typography variant="body2" color="text.secondary">{project.startedAt} - {project.endsAt}</Typography>
                                </Box>
                            ))}
                        </Box>
                    ) :
                        <Box display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            sx={{ textAlign: 'center' }}
                        >
                            <CardMedia
                                component="img"
                                image="https://files.lineupx.com/660bdfb2f2dcdcf3660eff8f/lineupx-candidate-recruiter-resume/9919181254.png"
                                alt="Profile"
                                sx={{ borderRadius: '50%', width: "30%" }}
                            />

                            <Button
                                onClick={handleAddProject}
                                variant="outlined"  // Using outlined variant for better border visibility
                                sx={{
                                    marginTop: 2,
                                    borderColor: 'black', // Set the border color (you can use theme colors)
                                    borderWidth: 2,  // Adjust border width
                                    borderRadius: 2,  // Optional: adjust the border radius to make the corners rounded
                                    color: 'black',  // Button text color
                                    padding: '8px 20px', // Adjust padding for button size

                                }}>Add Projects</Button>
                        </Box>}
                    <AddProject
                        projectData={projectData}
                        open={isPopupProject}
                        onClose={() => setIsPopupProject(false)}
                        onProjectUpdate={handleProjectUpdate}
                        onDataChange={onDataChange}
                    />
                </Card>
                <Card sx={{ padding: 3, mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <SvgIcon component={EmojiEventsIcon} sx={{ fontSize: 30, mr: 1 }} />
                            <Typography variant="h6">Awards and Achievement</Typography>
                        </Box>
                        {/* <IconButton aria-label="Add Awards" onClick={() => handleAddAward("")}>
                            <AddIcon sx={{ border: 1, borderRadius: 3, color: "black" }} />
                        </IconButton> */}
                    </Box>

                    {studentData?.profile?.achievements ? (<>
                        <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
                            <div>
                                {parse(studentData?.profile?.achievements)}
                            </div>
                            {/* <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{awardsText} </Typography> */}
                            <IconButton aria-label="Edit project" onClick={() => handleAddAward(studentData?.profile?.achievements)}>
                                <EditIcon sx={{ fontSize: 20 }} />
                            </IconButton>
                            {/* </Box> */}
                        </Box>
                    </>

                    ) : (
                        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" sx={{ textAlign: 'center' }}>
                            <CardMedia
                                component="img"
                                image="https://files.lineupx.com/660bdfb2f2dcdcf3660eff8f/lineupx-candidate-recruiter-resume/9919181254.png"
                                alt="Profile"
                                sx={{ borderRadius: '50%', width: "30%" }}
                            />
                            <Button
                                onClick={handleAddAward}
                                variant="outlined"
                                sx={{
                                    marginTop: 2,
                                    borderColor: 'black',
                                    borderWidth: 2,
                                    borderRadius: 2,
                                    color: 'black',
                                    padding: '8px 20px',
                                }}
                            >
                                Add Awards and Achievements
                            </Button>
                        </Box>
                    )}

                    <AddAward
                        awards={awardData}
                        open={awardPopup}
                        onClose={() => setAwardPopup(false)}
                        awardsUpdate={handleProfileUpdate}
                    />
                </Card>

                <Card sx={{ padding: 3, mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <SvgIcon component={InfoIcon} sx={{ fontSize: 30, mr: 1 }} />
                            <Typography variant="h6">Other Details</Typography>
                        </Box>
                        {/* <IconButton aria-label="Add Awards" onClick={handleAddOthers}>
                            <EditIcon />
                        </IconButton> */}
                    </Box>
                    {studentData?.profile?.achievements ? (<>
                        <Box sx={{ mt: 3 }}>

                            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                                <Typography variant="body2" > {studentData?.profile?.otherDetails}</Typography>
                                <IconButton aria-label="Edit project" onClick={() => handleAddOthers(studentData?.profile?.otherDetails)}>
                                    <EditIcon sx={{ fontSize: 20 }} />
                                </IconButton>
                            </Box>
                        </Box>
                    </>) : (
                        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" sx={{ textAlign: 'center' }}>
                            <CardMedia
                                component="img"
                                image="https://files.lineupx.com/660bdfb2f2dcdcf3660eff8f/lineupx-candidate-recruiter-resume/9919181254.png"
                                alt="Profile"
                                sx={{ borderRadius: '50%', width: "30%" }}
                            />
                            <Button
                                onClick={handleAddOthers}
                                variant="outlined"
                                sx={{
                                    marginTop: 2,
                                    borderColor: 'black',
                                    borderWidth: 2,
                                    borderRadius: 2,
                                    color: 'black',
                                    padding: '8px 20px',
                                }}
                            >
                                Other Details
                            </Button>
                        </Box>
                    )}
                    <AddOtherDetails
                        otherDetails={otherData}
                        open={otherPopup}
                        onClose={() => setOtherPopup(false)}
                        otherUpdate={handleProfileUpdate}
                    />
                </Card>
            </Box>
            <Box sx={{ flex: 1 }}>
                <Card sx={{ padding: 1, mb: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        {/* Icon and Header Text */}
                        <Box display="flex" alignItems="center">
                            <MilitaryTechIcon />
                            <Typography variant="h6" >
                                Certifications
                            </Typography>
                        </Box>
                        {/* Edit Icon */}
                        <IconButton aria-label="add certification" onClick={(e) => handleAddCertification(e, [])}>
                            <AddIcon />
                        </IconButton>
                    </Box>

                    {/* Certifications Data Section */}
                    {studentData?.certificates ? (
                        <Box sx={{ marginBottom: 2 }}>
                            {studentData.certificates.map((certificate, index) => (
                                <Box key={index} sx={{ marginBottom: 2 }}>
                                    <Box display="flex" alignItems="center" justifyContent="space-between">
                                        <Typography variant="body1">{certificate.name}</Typography>
                                        <IconButton aria-label="edit certification">
                                            <EditIcon onClick={(e) => handleAddCertification(e, certificate)} />
                                        </IconButton>
                                    </Box>
                                    <Box display="flex" justifyContent="space-between" sx={{ marginTop: 1 }}>
                                        <Typography variant="body2" sx={{ color: 'gray' }}>
                                            {certificate.fromDate} - {certificate.toDate} {/* Use certificate data */}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    ) : null}
                    <AddCertification
                        certificateData={certificateData}
                        open={isPopupOpen}
                        onClose={() => setIsPopupOpen(false)}
                        onCertificateUpdate={handleCertificateUpdate}
                        onDataChange={onDataChange}
                    />
                </Card>
                <Card sx={{ padding: 1, mb: 2 }}>

                    {/* Header Section */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                        <Box display="flex" alignItems="center">
                            {/* Military Icon */}
                            <MilitaryTechIcon />
                            <Typography variant="h6" sx={{ ml: 1 }}>
                                Social Links
                            </Typography>
                        </Box>
                    </Box>

                    {/* Social Links Data Section */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {studentData?.profile?.socialLinks?.map((socialLink, index) => (
                            <Box key={index} display="flex" alignItems="center" justifyContent="space-between" border={1} borderRadius={3} mx={1}>
                                <Box display="flex" alignItems="center" ml={1}>
                                    {socialLink.type === "linkedIn" ? <LinkedInIcon /> : <LinkIcon />}
                                    <Typography variant="body2" sx={{ ml: 1 }}>
                                        {socialLink.url || (socialLink.type === "linkedIn" ? 'LinkedIn' : 'Other Links')}
                                    </Typography>
                                </Box>
                                <IconButton
                                    aria-label={socialLink.url ? `edit ${index === 0 ? 'linkedin' : 'other'} link` : `add ${index === 0 ? 'linkedin' : 'other'} link`}
                                    onClick={() => handleAddSocial(socialLink)}
                                >
                                    {socialLink.url ? <EditIcon /> : <AddIcon />}
                                </IconButton>
                            </Box>
                        ))}

                        {/* Add social link popup */}
                        <AddSocialLink
                            open={isPopUpSocial}
                            onClose={() => {
                                setIsPopupSocial(false);
                                setSociaMedialName("");
                            }}
                            socialName={socialMediaName}
                            onDataChange={onDataChange}
                        />
                    </Box>

                </Card>
                <Card sx={{ padding: 1, mb: 2 }}>
                    {/* Header Section */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                        <Box display="flex" alignItems="center">
                            {/* Person Icon */}
                            <PersonIcon sx={{ fontSize: 24, color: '#150e47' }} />
                            <Typography variant="h6" sx={{ ml: 1 }}>
                                Personal Details
                            </Typography>
                        </Box>
                        <IconButton aria-label="edit personal details" onClick={handleAddPersonalDetails}>
                            <EditIcon />
                        </IconButton>
                    </Box>

                    {/* Personal Data Section */}
                    <Box>
                        {/* Date of Birth */}
                        <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                                Date of Birth
                            </Typography>
                            <Typography variant="body2" color="text.primary">
                                {studentData?.profile?.birthday || "YYYY-MM-DD"}
                            </Typography>
                        </Box>

                        {/* Address */}
                        <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                                Address
                            </Typography>
                            <Typography variant="body2" color="text.primary" sx={{ wordBreak: 'break-word' }}>
                                {studentData?.profile?.address || ""}
                            </Typography>
                        </Box>

                        {/* Languages Known */}
                        <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                                Languages Known
                            </Typography>
                            <Typography variant="body2" color="text.primary">
                                {studentData?.profile?.languagesKnown.map((e, key) => (
                                    <span key={key}>{e} </span>
                                ))}
                            </Typography>
                        </Box>

                        {/* Country */}
                        <Box display="flex" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                                Country
                            </Typography>
                            <Typography variant="body2" color="text.primary">
                                {studentData?.profile?.country || ""}
                            </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                                State
                            </Typography>
                            <Typography variant="body2" color="text.primary">
                                {studentData?.profile?.state || ""}
                            </Typography>
                        </Box>
                    </Box>
                    <AddPersonalDetail
                        studentProfileData={studentData?.profile}
                        open={isPopUpPersonal}
                        onClose={() => setIsPopUpPersonal(false)}
                        onProfileUpdate={handleProfileUpdate}
                    />
                </Card>
            </Box >
        </Box >
    )
}

export default StudentProfile
