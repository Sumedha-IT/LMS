
import React, { useEffect, useState } from 'react';
import { Tabs, Tab, Box, Paper } from '@mui/material';
import TabPanel, { a11yProps } from '../common/TabPanel';
import TestDataComponent from './TestDataComponent';
import ExamScheduling from './ExamScheduling';
import { useGetExamDataByIdMutation } from '../store/service/admin/AdminService';
import { useSearchParams } from 'react-router-dom';

const QuestionBankComponent = () => {
    const [mainTab, setMainTab] = useState(0); // For Curriculum and Test tabs
    const [subTab, setSubTab] = useState(1); // For Add Basic Details and Test Data
    const [examData, setExamData] = useState({})
    const handleMainTabChange = (event, newValue) => setMainTab(newValue);
    const handleSubTabChange = (event, newValue) => setSubTab(newValue);
    const [searchParams] = useSearchParams();

    const [getExamDataById] = useGetExamDataByIdMutation();

    useEffect(() => {
        const examID = searchParams.get('examId');
        if (examID) {
            localStorage.setItem("examId", examID)
            getExamData(examID)
        }
    }, [])

    const getExamData = async (id) => {
        try {
            let result = await getExamDataById(id);
            const { data } = result;
            setExamData(data?.data)
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <Box sx={{ width: '100%', backgroundColor: '#f4f5f7', p: 2, borderRadius: 1 }}>
            {/* Main Tabs */}
            <Paper square>
                <Tabs
                    value={mainTab}
                    onChange={handleMainTabChange}
                    aria-label="Main Tabs"
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
                    <Tab label="Curriculum" {...a11yProps(0)} />
                    <Tab label="Test" {...a11yProps(1)} />
                </Tabs>
            </Paper>

            {/* TabPanel switching based on mainTab value */}
            <TabPanel value={mainTab} index={0}>
                <Tabs
                    value={subTab}
                    onChange={handleSubTabChange}
                    aria-label="Sub Tabs"
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
                    <Tab label="Add Basic Details" {...a11yProps(0)} />
                    <Tab label="Test Data" {...a11yProps(1)} />
                </Tabs>

                {/* Conditional rendering based on subTab value */}
                <TabPanel value={subTab} index={0}>
                    {/* <BasicDetailsComponent /> */}
                    <ExamScheduling ExamData={examData} />
                </TabPanel>

                <TabPanel value={subTab} index={1}>
                    <TestDataComponent Meta={examData?.meta} />
                </TabPanel>
            </TabPanel>

            <TabPanel value={mainTab} index={1}>
                <p>This is the Curriculum section.</p>
            </TabPanel>
        </Box>
    );
};

export default QuestionBankComponent;






