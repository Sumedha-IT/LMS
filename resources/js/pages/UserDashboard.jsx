import { Box, Button, Tab, Tabs, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import TabPanel, { a11yProps } from '../common/TabPanel';
import UserExamTable from '../components/UserExamTable';
import userId, { useGetStudentDataQuery } from '../store/service/user/UserService';

const UserDashboard = () => {
    const [mainTab, setMainTab] = useState(0);
    const { data } = useGetStudentDataQuery({ userId: userId });

    useEffect(() => {
        if (data) {
            localStorage.setItem('userdetails', JSON.stringify(data?.data));
        }
    }, [data]);

    const handleMainTabChange = (event, newValue) => {
        setMainTab(newValue);
    }

    return (
        <Box sx={{ width: '100%', p: 3, backgroundColor: '#f8f9fa' }}>
            <Box sx={{ mb: 4 }}>
                <Tabs
                    value={mainTab}
                    onChange={handleMainTabChange}
                    aria-label="exam tabs"
                    sx={{
                        '& .MuiTabs-indicator': { display: 'none' },
                        '& .MuiTab-root': {
                            color: '#666',
                            backgroundColor: '#e9ecef',
                            borderRadius: '8px',
                            mx: 1,
                            textTransform: 'none',
                            fontSize: '16px',
                            fontWeight: 500,
                            '&.Mui-selected': {
                                color: '#fff',
                                backgroundColor: '#f4511e',
                            },
                        },
                    }}
                >
                    <Tab 
                        label="Upcoming Exams" 
                        {...a11yProps(0)}
                        sx={{ minWidth: '180px' }}
                    />
                    <Tab 
                        label="Attempted Exams" 
                        {...a11yProps(1)}
                        sx={{ minWidth: '180px' }}
                    />
                </Tabs>
            </Box>

            <TabPanel value={mainTab} index={0}>
                <UserExamTable Value={mainTab} userId={userId} />
            </TabPanel>

            <TabPanel value={mainTab} index={1}>
                <UserExamTable Value={mainTab} userId={userId} />
            </TabPanel>
        </Box>
    );
};

export default UserDashboard;
