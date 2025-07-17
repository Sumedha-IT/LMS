import { Box, Button, CardMedia, Checkbox, Divider, FormControlLabel, FormGroup, InputAdornment, Paper, Tab, Tabs, TextField, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import React, { useEffect, useState } from 'react'
import TabPanel, { a11yProps } from '../../common/TabPanel';
import JobDashboard from '../../pages/JobDashboard';
import { jobType, officePolicy } from "../../utils/jsonData"
import { useGetStudentApplyJobDataQuery } from '../../store/service/user/UserService';
import { useParams } from 'react-router-dom';

const ApplyJob = () => {
    const [tabValue, setTabValue] = useState(0, 0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selected, setSelected] = useState("applied");
    const [clear, setClear] = useState(false)
    const [applyJobData, setApplyJobData] = useState([]);
    const [jobTypeSelected, setJobTypeSelected] = useState("")
    const [officePolicySelected, setOfficePoclicySelected] = useState("")
    const [search, setSearch] = useState("")
    const { data, refetch } = useGetStudentApplyJobDataQuery({
        page: page + 1,
        rowsPerPage: rowsPerPage,
        status: selected,
        jobType: jobTypeSelected,
        officePolicy: officePolicySelected,
        search: search
    })
    useEffect(() => {
        if (data) {
            setApplyJobData(data.data);
        }
    }, [data]);
    useEffect(() => {
        refetch();
    }, [selected, refetch]);
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        if (newValue == 0) {
            setSelected("applied")
        }
        else if (newValue == 1) {
            setSelected("in_interview")
        }
        else if (newValue == 2) {
            setSelected("offered")
        }
        else if (newValue == 3) {
            setSelected("rejected")
        }
    };
    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (newRowsPerPage) => {
        setRowsPerPage(newRowsPerPage);
        setPage(0); // Reset to the first page
    };
    const handleFilter = (e, item, update) => {
        if (update === "jobType") {
            setJobTypeSelected(item);
        }
        else if (update === "officePolicy") {
            setOfficePoclicySelected(item);
        }
        setClear(true)
    };
    const handleClearFilter = () => {
        setJobTypeSelected("")
        setOfficePoclicySelected("")
        setClear(false)
    }

    const handleSearchChange = (event) => {
        setSearch(event.target.value)
    };
    const applyJob = applyJobData.filter(job => job.status === 'applied').length
    const inInterview = applyJobData.filter(job => job.status === 'in_interview').length
    const offered = applyJobData.filter(job => job.status === 'offered').length
    const rejected = applyJobData.filter(job => job.status === 'rejected').length
    return (
        <div className="p-4">
            {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" >MY JOBS</Typography>

            </Box> */}
            <Box display="flex" width="100%" height="100vh">
                <Paper sx={{ flex: 3, height: "100%", backgroundColor: '#f4f4f4', padding: 2, overflow: 'auto' }}>
                    <Box sx={{ width: '100%', backgroundColor: '#f4f5f7', borderRadius: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
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

                                <Tab label={`Applied Jobs ${applyJob == 0 ? "" : `(${applyJob})`}`}  {...a11yProps(0)} />
                                <Tab label={`In Interview ${inInterview == 0 ? "" : `(${inInterview})`}`} {...a11yProps(1)} />
                                <Tab label={`Offered ${offered === 0 ? "" : `(${offered})`}`} {...a11yProps(1)} />
                                <Tab label={`Rejected ${rejected === 0 ? "" : `(${rejected})`}`} {...a11yProps(1)} />
                            </Tabs>
                        </Box>

                        {/* Tab Content */}
                        <TabPanel value={tabValue} index={0}  >
                            {applyJobData.length > 0 ? (<JobDashboard
                                data={applyJobData || []}
                                Applyed={true}
                                totalRecords={data?.totalRecords || 0} // Total from API response
                                page={page}
                                rowsPerPage={rowsPerPage}
                                onPageChange={handlePageChange}
                                onRowsPerPageChange={handleRowsPerPageChange}
                                style={{
                                    container: { margin: '20px 0' },
                                    headerCell: { fontWeight: 'bold' },
                                    button: { padding: '5px 10px' },
                                }}

                            />) : (
                                <Box display="flex"
                                    flexDirection="column"
                                    justifyContent="center"
                                    alignItems="center"
                                    height={"100vh"}
                                    sx={{ textAlign: 'center' }}
                                >
                                    <CardMedia
                                        component="img"
                                        image="https://files.lineupx.com/660bdfb2f2dcdcf3660eff8f/lineupx-candidate-recruiter-resume/9919181254.png"
                                        alt="Profile"
                                        sx={{ borderRadius: '20%', width: "20%" }}
                                    />
                                    <Typography fontSize={30} mt={2}>You do not have any Applied Jobs!</Typography>
                                </Box>)}
                        </TabPanel>

                        <TabPanel value={tabValue} index={1}>
                            {applyJobData.length > 0 ? (<JobDashboard
                                data={applyJobData || []}
                                Applyed={true}
                                totalRecords={data?.totalRecords || 0} // Total from API response
                                page={page}
                                rowsPerPage={rowsPerPage}
                                onPageChange={handlePageChange}
                                onRowsPerPageChange={handleRowsPerPageChange}
                                style={{
                                    container: { margin: '20px 0' },
                                    headerCell: { fontWeight: 'bold' },
                                    button: { padding: '5px 10px' },
                                }}

                            />) : (
                                <Box display="flex"
                                    flexDirection="column"
                                    justifyContent="center"
                                    alignItems="center"
                                    height={"100vh"}
                                    sx={{ textAlign: 'center' }}
                                >
                                    <CardMedia
                                        component="img"
                                        image="https://files.lineupx.com/660bdfb2f2dcdcf3660eff8f/lineupx-candidate-recruiter-resume/9919181254.png"
                                        alt="Profile"
                                        sx={{ borderRadius: '20%', width: "20%" }}
                                    />
                                    <Typography fontSize={30} mt={2}>You do not have any Interview scheduled right now.</Typography>
                                </Box>)}
                        </TabPanel>
                        <TabPanel value={tabValue} index={2}>
                            {applyJobData.length > 0 ? (<JobDashboard
                                data={applyJobData || []}
                                Applyed={true}
                                totalRecords={data?.totalRecords || 0} // Total from API response
                                page={page}
                                rowsPerPage={rowsPerPage}
                                onPageChange={handlePageChange}
                                onRowsPerPageChange={handleRowsPerPageChange}
                                style={{
                                    container: { margin: '20px 0' },
                                    headerCell: { fontWeight: 'bold' },
                                    button: { padding: '5px 10px' },
                                }}

                            />) : (
                                <Box display="flex"
                                    flexDirection="column"
                                    justifyContent="center"
                                    alignItems="center"
                                    height={"100vh"}
                                    sx={{ textAlign: 'center' }}
                                >
                                    <CardMedia
                                        component="img"
                                        image="https://files.lineupx.com/660bdfb2f2dcdcf3660eff8f/lineupx-candidate-recruiter-resume/9919181254.png"
                                        alt="Profile"
                                        sx={{ borderRadius: '20%', width: "20%" }}
                                    />
                                    <Typography fontSize={30} mt={2}>You do not have any Offer!</Typography>
                                </Box>)}
                        </TabPanel>
                        <TabPanel value={tabValue} index={3}>
                            {applyJobData.length > 0 ? (<JobDashboard
                                data={applyJobData || []}
                                Applyed={true}
                                totalRecords={data?.totalRecords || 0} // Total from API response
                                page={page}
                                rowsPerPage={rowsPerPage}
                                onPageChange={handlePageChange}
                                onRowsPerPageChange={handleRowsPerPageChange}
                                style={{
                                    container: { margin: '20px 0' },
                                    headerCell: { fontWeight: 'bold' },
                                    button: { padding: '5px 10px' },
                                }}

                            />) : (
                                <Box display="flex"
                                    flexDirection="column"
                                    justifyContent="center"
                                    alignItems="center"
                                    height={"100vh"}
                                    sx={{ textAlign: 'center' }}
                                >
                                    <CardMedia
                                        component="img"
                                        image="https://files.lineupx.com/660bdfb2f2dcdcf3660eff8f/lineupx-candidate-recruiter-resume/9919181254.png"
                                        alt="Profile"
                                        sx={{ borderRadius: '20%', width: "20%" }}
                                    />
                                    <Typography fontSize={30} mt={2}>You have not been rejected yet!</Typography>
                                </Box>)}
                        </TabPanel>
                    </Box>
                </Paper>
                <Box sx={{ flex: 1, backgroundColor: '#f4f4f4', padding: 2, overflow: 'auto' }}>
                    {/* Search Bar */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                            fullWidth
                            placeholder="Search Jobs"
                            variant="outlined"
                            size="small"
                            onChange={handleSearchChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start" >
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                    <Paper sx={{ padding: 2, mt: 2 }}>
                        <Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                                    <FilterAltIcon sx={{ mr: 1 }} />
                                    Filter
                                </Typography>
                                {clear && <Button color='inherit' onClick={handleClearFilter} >Clear All</Button>}
                            </Box>
                            {/* Job Type */}
                            <Typography variant="h6" mt={4}>Job Type</Typography>
                            <FormGroup sx={{ mb: 2 }}>
                                {jobType.map((item, index) => (
                                    <FormControlLabel
                                        key={index}
                                        control={<Checkbox
                                            checked={jobTypeSelected === item.value}
                                            onChange={(e) => handleFilter(e, item.value, "jobType")}
                                        />}
                                        label={item.label}
                                    />))}

                            </FormGroup>
                            <Divider sx={{ mb: 2 }} />
                            {/* Office Policy */}
                            <Typography variant="h6" mt={4}>Office Policy</Typography>
                            <FormGroup sx={{ mb: 2 }}>
                                {officePolicy.map((item, index) => (
                                    <FormControlLabel
                                        key={index}
                                        control={<Checkbox
                                            checked={officePolicySelected === item.value}
                                            onChange={(e) => handleFilter(e, item.value, "officePolicy")}
                                        />}
                                        label={item.label}
                                    />))}
                            </FormGroup>
                        </Box>

                    </Paper>
                </Box>
            </Box >
        </div >
    )
}

export default ApplyJob
