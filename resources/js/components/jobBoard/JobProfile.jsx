import { Box, IconButton, Paper, Tab, Tabs, Typography } from '@mui/material'
import React, { useState } from 'react'
import TabPanel, { a11yProps } from '../../common/TabPanel';
import StudentProfile from '../StudentProfile';
import { useGetStudentJobProfileDataQuery } from '../../store/service/user/UserService';
import { useParams } from 'react-router-dom';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useAddStudentCertificateDataMutation } from '../../store/service/user/UserService';

const JobProfile = () => {
    const [tabValue, setTabValue] = useState(0);
    const [UploadResume] = useAddStudentCertificateDataMutation();
    const { id } = useParams();
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        refetch();
    };

    const { data, refetch, isLoading } = useGetStudentJobProfileDataQuery()
    const handleDataChange = () => {
        refetch(); // Re-fetch data when notified by the child
    };

    const handleFileChange = async (event) => {
        console.log("mohit  ", event.target)
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            const formData = new FormData();
            formData.append("name", selectedFile.name);
            formData.append("file", selectedFile);
            formData.append("isResume", 1)
            await UploadResume({ userId: id, formData }).unwrap();
            await refetch();
        }
    };
    const handleUpload = () => {
        document.getElementById('file-input').click();
    }


    return (
        <div className='p-4'>
            {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" >JOB PROFILE</Typography>
            </Box> */}
            {/* rgba(255, 255, 255, 0.314); */}
            <Box display="flex" width="100%" >
                <Paper sx={{ width: "100%", height: "100%", backgroundColor: '#f4f4f4', padding: 2, overflow: 'auto' }}>
                    <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                        {/* Top-Level Tabs (Add New Question Bank & Add From Existing Banks) */}
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            aria-label="Add Placement Tabs"
                            sx={{
                                backgroundColor: '#f4f5f7',
                                '& .Mui-selected': {
                                    backgroundColor: 'white',
                                    color: 'black',
                                    borderRadius: '5px 5px 0 0',
                                },
                                '& .MuiTab-root': {
                                    textTransform: 'none',
                                    color: '#007bff',
                                    fontWeight: 'bold',
                                    borderRadius: '5px 5px 0 0',
                                },
                            }}
                        >
                            <Tab label="Profile" {...a11yProps(0)} />
                            <Tab label="Resume" {...a11yProps(1)} />

                        </Tabs>
                    </Box>


                    <TabPanel value={tabValue} index={0}>
                        <Box p={1} bgcolor={"white"} mt={2}>
                            <Typography variant="h6" >Here, you can view &amp; edit your profile</Typography>
                        </Box>
                        <StudentProfile
                            data={data}
                            onDataChange={handleDataChange}
                            changeTap={handleTabChange}
                        />
                        {/* Table Component */}
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>

                        <Box p={1} bgcolor={"white"} mt={2}>
                            <Typography variant="h6" >Here, you can Upload Resume</Typography>
                        </Box>
                        {data ? (
                            <Box p={1} bgcolor={"white"} my={2} display={"flex"} justifyContent={"center"} flexDirection={"column"} >
                                <IconButton sx={{ display: 'flex', borderRadius: "0" }} onClick={handleUpload}>
                                    <UploadFileIcon />
                                    <Typography ml={2}>Resume Upload</Typography>

                                </IconButton>
                                <input
                                    id="file-input"
                                    type="file"
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}
                                    accept=".pdf,.docx,.doc"
                                />

                                {isLoading ? <p>Loading...</p> : (
                                    <Box>
                                        {data?.data?.profile?.resumeId ? (
                                            <iframe
                                                src={data?.data?.profile?.resumeUrl}
                                                title="Resume"
                                                width="100%"
                                                height="600px"   // Adjust the height as needed
                                                style={{ border: 'none' }}
                                            />
                                        ) : (
                                            <Typography>No Resume Found</Typography>
                                        )}
                                    </Box>
                                )}
                            </Box>) : null}
                        {/* Table Component */}
                    </TabPanel>

                </Paper>
            </Box>
        </div>
    )
}

export default JobProfile
