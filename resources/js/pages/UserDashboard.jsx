import { Box, Button, Tab, Tabs, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import TabPanel, { a11yProps } from '../common/TabPanel';
import UserExamTable from '../components/UserExamTable';
import userId, { useGetStudentDataQuery } from '../store/service/user/UserService';
import PerformanceChart from '../components/DashBoard/PerformanceChart';

import Leaderboard from '../components/DashBoard/Leaderboard';
import AssignmentsReport from '../components/DashBoard/AssignmentsReport';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Menu, MenuItem } from '@mui/material';

const UserDashboard = () => {
    const [mainTab, setMainTab] = useState(0);
    const [showExams, setShowExams] = useState(false);
    const { data } = useGetStudentDataQuery({ userId: userId });
    const [filter, setFilter] = useState('all');
    const [anchorEl, setAnchorEl] = useState(null);
    const [filterActive, setFilterActive] = useState(false);

    useEffect(() => {
        if (data) {
            localStorage.setItem('userdetails', JSON.stringify(data?.data));
        }
    }, [data]);

    const handleMainTabChange = (event, newValue) => {
        setMainTab(newValue);
        if (newValue === 0) {
            setFilterActive(false);
        }
    }

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setAnchorEl(null);
    };
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const handleAllExamsClick = () => {
        setFilterActive(true);
        setMainTab(1);
    };

    if (!showExams) {
        return (
            <section className='w-full flex flex-col gap-8 p-2 min-h-screen bg-white'>
                <div className="w-full flex gap-2">
                    {/* Upcoming Exams Card */}
                    <div className="w-8/12 text-white pl-10 py-2 rounded-xl flex justify-between items-center border border-white/30 shadow-lg"
                        style={{
                            background: 'linear-gradient(135deg, #0f1f3d 0%, #1e3c72 100%)',
                        }}
                    >
                        <div className="space-y-4 max-w-[70%]">
                            <h2 className="text-2xl font-bold">Check your Upcoming Exams Here.</h2>
                            <p className="text-sm font-normal opacity-90">
                                You have upcoming exams scheduled. Stay prepared and plan your study schedule in advance! Click below to
                                view the exam details.
                            </p>
                            <div className="flex flex-wrap gap-3 pt-2">
                                <button
                                    className="rounded-full px-5 py-2 text-sm font-medium shadow"
                                    style={{
                                        background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                                        color: '#fff',
                                        border: 'none',
                                        transition: 'all 0.3s',
                                        boxShadow: '0 2px 8px 0 rgba(235,103,7,0.10)'
                                    }}
                                    onClick={() => setShowExams(true)}
                                >
                                    View Exam
                                </button>
                            </div>
                        </div>
                        <div className="max-w-[40%]">
                            <img
                                src="/images/Calender.png"
                                alt="Calendar illustration"
                                className="object-contain"
                            />
                        </div>
                    </div>

                    {/* Attempted Exams Card */}
                    <div className="w-4/12 border border-white/30 shadow-lg p-1 flex-col rounded-xl flex justify-between items-center backdrop-blur-md"
                        style={{
                            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                        }}
                    >
                        <div className="flex">
                            <div className="space-y-2 pl-3 w-[60%] py-5">
                                <h2 className="text-xl font-bold text-white">Attempted Exams Summary</h2>
                                <p className="text-sm text-white/80">
                                    You've completed some of your exams. Click below to review your results and performance summary
                                </p>
                            </div>
                            <div className="w-[40%] h-full flex items-center justify-center">
                                <img
                                    src="/images/image%2067.png"
                                    alt="Student illustration"
                                    className="object-contain"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "/images/placeholder.jpg";
                                        console.log("Image failed to load, using fallback");
                                    }}
                                />
                            </div>
                        </div>
                        <div className='w-full items-center flex justify-center border-t-[0.5px] py-2 border-white/40'>
                            <button
                                className="rounded-full px-5 py-2 text-sm font-medium shadow"
                                style={{
                                    background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                                    color: '#fff',
                                    border: 'none',
                                    transition: 'all 0.3s',
                                    boxShadow: '0 2px 8px 0 rgba(235,103,7,0.10)'
                                }}
                                onClick={() => {
                                    setShowExams(true);
                                    setMainTab(1);
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
                                background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                            },
                        },
                    }}
                >
                    <Tab
                        label="Upcoming Exams"
                        {...a11yProps(0)}
                        sx={{ minWidth: '180px' }}
                    />
                    {!filterActive ? (
                        <Button
                            variant="contained"
                            onClick={handleAllExamsClick}
                            sx={{
                                minWidth: '180px',
                                ml: 2,
                                background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                                color: 'white',
                                borderRadius: '8px',
                                textTransform: 'none',
                                fontSize: '16px',
                                fontWeight: 500,
                                '&:hover': {
                                    background: 'linear-gradient(270deg, #e42b12 0%, #eb6707 100%)',
                                },
                            }}
                        >
                            All Exams
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            onClick={handleMenuOpen}
                            endIcon={<ArrowDropDownIcon />}
                            sx={{
                                minWidth: '180px',
                                ml: 2,
                                background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                                color: 'white',
                                borderRadius: '8px',
                                textTransform: 'none',
                                fontSize: '16px',
                                fontWeight: 500,
                                '&:hover': {
                                    background: 'linear-gradient(270deg, #e42b12 0%, #eb6707 100%)',
                                },
                            }}
                        >
                            {filter === 'all' ? 'All Exams' : filter === 'attempted' ? 'Attempted Exams' : 'Not Attempted Exams'}
                        </Button>
                    )}
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem onClick={() => handleFilterChange('all')}>All Exams</MenuItem>
                        <MenuItem onClick={() => handleFilterChange('attempted')}>Attempted Exams</MenuItem>
                        <MenuItem onClick={() => handleFilterChange('not-attempted')}>Not Attempted Exams</MenuItem>
                    </Menu>
                </Tabs>
            </Box>

            <TabPanel value={mainTab} index={0}>
                <UserExamTable Value={mainTab} userId={userId} filter={filter} />
            </TabPanel>

            <TabPanel value={mainTab} index={1}>
                <UserExamTable Value={mainTab} userId={userId} filter={filter} />
            </TabPanel>
        </Box>
    );
};

export default UserDashboard;