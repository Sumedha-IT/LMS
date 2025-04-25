import { Box, Button, Tab, Tabs, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import TabPanel, { a11yProps } from '../common/TabPanel';
import UserExamTable from '../components/UserExamTable';
import userId, { useGetStudentDataQuery } from '../store/service/user/UserService';
import PerformanceChart from '../components/DashBoard/PerformanceChart';

import Leaderboard from '../components/DashBoard/Leaderboard';
import AssignmentsReport from '../components/DashBoard/AssignmentsReport';

const UserDashboard = () => {
    const [mainTab, setMainTab] = useState(0);
    const [showExams, setShowExams] = useState(false);
    const { data } = useGetStudentDataQuery({ userId: userId });

    useEffect(() => {
        if (data) {
            localStorage.setItem('userdetails', JSON.stringify(data?.data));
        }
    }, [data]);

    const handleMainTabChange = (event, newValue) => {
        setMainTab(newValue);
    }

    if (!showExams) {
        return (
            <section className='w-full flex flex-col gap-8 p-2 min-h-screen'>
                <div className="w-full flex gap-2">
                    {/* Upcoming Exams Card */}
                    <div className="w-8/12 bg-[#F03A17] text-white pl-10 py-2 rounded-xl flex justify-between items-center">
                        <div className="space-y-4 max-w-[70%]">
                            <h2 className="text-2xl font-bold">Check your Upcoming Exams Here.</h2>
                            <p className="text-sm font-normal opacity-90">
                                You have upcoming exams scheduled. Stay prepared and plan your study schedule in advance! Click below to
                                view the exam details.
                            </p>
                            <div className="flex flex-wrap gap-3 pt-2">
                                <button className="bg-transparent hover:bg-white/10 transition-colors border border-white rounded-full px-5 py-2 text-sm font-medium">
                                    Set Reminder
                                </button>
                                <button 
                                    className="bg-white hover:bg-white/90 transition-colors text-[#F03A17] rounded-full px-5 py-2 text-sm font-medium"
                                    onClick={() => setShowExams(true)}
                                >
                                    View Exam
                                </button>
                            </div>
                        </div>
                        <div className="max-w-[40%]">
                            <img
                                src="/storage/Calender.png"
                                alt="Calendar illustration"
                                className="object-contain"
                            />
                        </div>
                    </div>

                    {/* Attempted Exams Card */}
                    <div className="w-4/12 bg-white border border-gray-100 shadow-sm p-1 flex-col rounded-xl flex justify-between items-center">
                        <div className="flex">
                            <div className="space-y-2 pl-3 w-[60%] py-5">
                                <h2 className="text-xl font-bold text-gray-700">Attempted Exams Summary</h2>
                                <p className="text-sm text-gray-500">
                                    You've completed some of your exams. Click below to review your results and performance summary
                                </p>
                            </div>
                            <div className="w-[40%] h-full flex items-center justify-center">
                                <img
                                    src="/storage/image.png"
                                    alt="Student illustration"
                                    className="object-contain"
                                />
                            </div>
                        </div>


                       <div className=' w-full items-center flex justify-center border-t-[0.5px] py-2 border-[#E53510]'>
                       <button 
                                    className="bg-[#F03A17] hover:bg-[#f03b17cc] transition-colors  text-white rounded-full px-5 py-2 text-sm font-medium"
                                    onClick={() => {
                                        setShowExams(true);
                                        setMainTab(1); // Switch to Attempted Exams tab
                                    }}
                                >
                                     View Result
                                </button>
                       </div>
                        
                    </div>
                </div>

                <div className='flex justify-between gap-2 w-full h-full'>
                    <div className='w-8/12'>
                        <PerformanceChart />
                    </div>
                    <div className='w-4/12'>
                        <Leaderboard />
                    </div>
                </div>
                <div className='w-full'>
                    <AssignmentsReport />
                </div>
            </section>
        );
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