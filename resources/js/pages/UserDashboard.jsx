import { Box, Paper, Tab, Tabs, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import TabPanel, { a11yProps } from '../common/TabPanel';
import UserExamTable from '../components/UserExamTable';
import { useGetStudentDataQuery } from '../store/service/user/UserService';

const UserDashboard = () => {
    const [mainTab, setMainTab] = useState(0); // For Exams and Attempted Exams tabs
    const { data } = useGetStudentDataQuery({ userId: 7 });


    useEffect(() => {
        if (data) {
            localStorage.setItem('userdetails', JSON.stringify(data?.data));
        }
    }, [data]);


    const handleMainTabChange = (event, newValue) => {
        setMainTab(newValue);
        console.log("newValue", newValue);
    }


    return (
        <Box sx={{ width: '100%', backgroundColor: '#f4f5f7', p: 2, borderRadius: 1 }}>
            {/* Heading */}
            <Typography
                variant="h4"
                sx={{
                    color: '#f97316', // Orange color for the heading
                    fontWeight: 'bold',
                    mb: 3,
                    fontSize: { xs: '18px', sm: '20px', md: '23px', xl: '27px' }
                }}
            >
                <Box component="span" sx={{ color: '#032246' }}>  My </Box>Exams
            </Typography>


            {/* Main Tabs */}
            <Paper square>
                <Tabs
                    value={mainTab}
                    onChange={handleMainTabChange}
                    aria-label="Main Tabs"
                    sx={{
                        backgroundColor: '#f4f5f7',
                        '& .MuiTabs-indicator': {
                            backgroundColor: '#f97316', // Orange color for active tab indicator
                        },
                        '& .css-19wsa2m-MuiButtonBase-root-MuiTab-root.Mui-selected': {
                            color: "#f97316"
                        },
                        '& .Mui-selected': {
                            backgroundColor: 'white',
                            color: '#f97316',
                            borderRadius: '5px 5px 0 0',
                        },
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            color: '#032246', // Orange color for inactive tabs
                            fontWeight: 'bold',
                            borderRadius: '5px 5px 0 0',
                        },
                    }}
                >

                    <Tab label="Upcoming Exams" {...a11yProps(0)} sx={{ fontSize: { xs: '11px', sm: '12px', md: '14px', xl: '15px' } }} />
                    <Tab label="Attempted Exams" {...a11yProps(1)} sx={{ fontSize: { xs: '11px', sm: '12px', md: '14px', xl: '15px' } }} />
                </Tabs>
            </Paper>

            {/* TabPanel switching based on mainTab value */}
            <TabPanel value={mainTab} index={0}>
                <UserExamTable Value={mainTab} /> {/* The UserExamTable will handle the exam table data */}
            </TabPanel>

            <TabPanel value={mainTab} index={1}>
                {/* <Typography variant="body1">
                    This is the Past Exams section.
                </Typography> */}
                <UserExamTable Value={mainTab} />
            </TabPanel>
        </Box>
    );
};

export default UserDashboard;
