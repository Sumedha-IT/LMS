import { Box, Button, Checkbox, Divider, FormControlLabel, FormGroup, IconButton, InputAdornment, MenuItem, Paper, TextField, Typography } from '@mui/material'
import SortRoundedIcon from '@mui/icons-material/SortRounded';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import React, { useEffect, useState } from 'react'
import JobDashboard from '../../pages/JobDashboard';
import { jobStatus, jobType, experienceRange, jobPostedIn, officePolicy, ctcRange } from "../../utils/jsonData"
import { useGetStudentJobDataQuery } from '../../store/service/user/UserService';
import { useNavigate, useParams } from 'react-router-dom';

const JobBoard = () => {
    const [tabValue, setTabValue] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [sortOpen, setSortOpen] = useState(false)
    const [selectedSort, setSelectedSort] = useState("");
    const { id } = useParams();
    const [clear, setClear] = useState(false)
    const [jobData, setJobData] = useState([]);
    const [jobTypeSelected, setJobTypeSelected] = useState("")
    const [experienceRangeSelected, setExperienceRangeSelected] = useState([])
    const [jobPostSelected, setJobPostSelected] = useState("")
    const [officePolicySelected, setOfficePoclicySelected] = useState("")
    const [ctcRangeSelected, setCtcRangeSelected] = useState("")
    const [search, setSearch] = useState("")
    const [apply,setApply] = useState(false)
    const { data, refetch } = useGetStudentJobDataQuery({
        page: page + 1,
        rowsPerPage: rowsPerPage,
        status: selectedSort,
        jobType: jobTypeSelected,
        minExperience: experienceRangeSelected[0]?.split("-")[0] || "",
        maxExperience: experienceRangeSelected[0]?.split("-")[1] || "",
        jobPosted: jobPostSelected,
        officePolicy: officePolicySelected,
        minSalary: ctcRangeSelected[0] || "",
        maxSalary: ctcRangeSelected[1] || "",
        search: search
    })
    useEffect(() => {
        refetch();
        if (data) {
            setJobData(data?.data);
            if(data.roleId === 4){
                setApply(true)
            }
        }
    }, [data]);
    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (newRowsPerPage) => {
        setRowsPerPage(newRowsPerPage);
        setPage(0); // Reset to the first page
    };
    const handleSortClick = () => {
        setSortOpen(!sortOpen);
    }

    const handleSortSelect = (sortOption) => {
        setSelectedSort(sortOption);
        setSortOpen(false); // Close the sorting options when a selection is made
    };
    // Handle clearing the sorting selection
    const handleClearSort = () => {
        setSelectedSort(""); // Reset the selected sorting option
        setSortOpen(false); // Optionally close the sorting menu as well   
    };
    const handleFilter = (e, item, update) => {
        if (update === "jobStatus") {
            setSelectedSort(item);
        }
        else if (update === "jobType") {
            setJobTypeSelected(item);
        }
        else if (update === "experienceRange") {
            console.log(item)
            setExperienceRangeSelected(item);
        }
        else if (update === "jobPostedIn") {
            setJobPostSelected(item);
        }
        else if (update === "officePolicy") {
            setOfficePoclicySelected(item);
        }
        else if (update === "ctcRange") {
            setCtcRangeSelected(item);
        }

        setClear(true)
    };
    const handleClearFilter = () => {

        setSelectedSort("")
        setJobTypeSelected("")
        setExperienceRangeSelected("")
        setJobPostSelected("")
        setOfficePoclicySelected("")
        setCtcRangeSelected("")

        setClear(false)
    }

    const handleSearchChange = (event) => {
        setSearch(event.target.value)
        // const searchData = data.data.filter((job) =>
        //     job?.name.toLowerCase().includes(value.toLowerCase())
        // );
        // setJobData(searchData)
    };
    const nav = useNavigate();
    const handleAddNewJobs = () => {
        nav(`/administrator/${id}/recruter-jobs`);

    };

   // const apply = jobData.every(job => !job.recruiterDetails);
    return (
        <div className="p-4">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                {/* <Typography variant="h5" >JOB BOARD</Typography> */}
                {/* if does not have recuiterDetails then show add new jobs */}
                {apply ? (<div>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddNewJobs}
                    >
                        + Add New Job
                    </Button>
                </div>) : null}
            </Box>
            <Box display="flex" width="100%" height="100vh">
                {/* First Box - takes 75% width (like col-9) */}
                <Paper sx={{ flex: 3, height: "100%", backgroundColor: '#f4f4f4', padding: 2, overflow: 'auto' }}>
                    <Box sx={{ width: '100%', backgroundColor: '#f4f5f7', borderRadius: 1 }}>
                        <Paper sx={{ display: "flex", mt: 2, padding: 1, alignItems: "center", position: "relative" }}>
                            {/* Sort Button */}
                            <IconButton sx={{ display: "flex", alignItems: "center", borderRadius: '0' }} onClick={handleSortClick}>
                                <SortRoundedIcon />
                                <Typography variant="body2" ml={1}>Sort by</Typography>
                            </IconButton>

                            {/* Display selected sort */}
                            {selectedSort && (
                                <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                                    <Typography variant="body2">{selectedSort}</Typography>
                                    <IconButton onClick={handleClearSort}>
                                        <CloseIcon />
                                    </IconButton>
                                </Box>
                            )}

                            {/* Show sorting options when sortOpen is true */}
                            {sortOpen && (
                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: "100%", // Ensure the dropdown appears below the button
                                        left: 0,
                                        zIndex: 10,
                                        backgroundColor: "white",
                                        boxShadow: 1,
                                        borderRadius: 1,
                                        padding: 1,
                                        width: '200px', // Fixed width for the dropdown
                                        maxHeight: '300px', // Max height to limit expansion
                                        overflowY: 'auto', // Enable scrolling if content overflows
                                    }}
                                >
                                    {jobStatus.map((item, index) => (
                                        <div key={item.value}>
                                            <MenuItem
                                                value={item.value}
                                                sx={{ '&:hover': { backgroundColor: '#f4f5f7' } }}
                                                onClick={() => handleSortSelect(item.label)}
                                            >
                                                <Typography variant="body2" sx={{ width: '100%' }}>
                                                    {item.label}
                                                </Typography>
                                            </MenuItem>
                                            {index < jobStatus.length - 1 && <Divider sx={{ my: 0.5 }} />} {/* Divider between items */}
                                        </div>
                                    ))}
                                </Box>
                            )}
                        </Paper>


                        <JobDashboard
                            data={jobData || []}
                            Applyed={false}
                            Apply={apply}
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
                            onApply = {()=>refetch()}

                        />



                    </Box>
                </Paper>
                {/* </Box> */}

                {/* Second Box - takes 25% width (like col-3) */}
                <Box sx={{ flex: 1, backgroundColor: '#f4f4f4', padding: 2, overflow: 'auto' }}>
                    {/* Search Bar */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                            fullWidth
                            placeholder="Search Jobs"
                            variant="outlined"
                            size="small"
                            // value={searchTerm}
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


                            {/* Job Status */}
                            <Typography variant="h6" mt={4}>Job Status</Typography>
                            <FormGroup sx={{ mb: 2 }}>
                                {jobStatus.map((item, index) => (
                                    <FormControlLabel
                                        key={index}
                                        control={
                                            <Checkbox
                                                checked={selectedSort === item.label} // Check if this checkbox is the selected one
                                                onChange={(e) => handleFilter(e, item.label, "jobStatus")} // Update the selected index on click
                                            />
                                        }
                                        label={item.label}
                                    />
                                ))}
                            </FormGroup>
                            <Divider sx={{ mb: 2 }} />
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
                            {/* Experience */}
                            <Typography variant="h6" mt={4}>Years of Experience</Typography>
                            <FormGroup sx={{ mb: 2 }}>
                                {experienceRange.map((item, index) => (
                                    <FormControlLabel
                                        key={index}
                                        control={<Checkbox
                                            checked={experienceRangeSelected === item.label}
                                            onChange={(e) => handleFilter(e, item.label, "experienceRange")}
                                        />}
                                        label={item.label}
                                    />))}
                            </FormGroup>
                            <Divider sx={{ mb: 2 }} />

                            {/* Job Posted In */}
                            <Typography variant="h6" mt={4}>Job Posted In</Typography>
                            <FormGroup sx={{ mb: 2 }}>
                                {jobPostedIn.map((item, index) => (
                                    <FormControlLabel
                                        key={index}
                                        control={<Checkbox
                                            checked={jobPostSelected === item.value}
                                            onChange={(e) => handleFilter(e, item.value, "jobPostedIn")}
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
                            <Divider sx={{ mb: 2 }} />

                            {/* CTC Range */}
                            <Typography variant="h6" mt={4}>CTC Range</Typography>
                            <FormGroup sx={{ mb: 2 }}>
                                {ctcRange.map((item, index) => (
                                    <FormControlLabel
                                        key={index}
                                        control={<Checkbox
                                            checked={ctcRangeSelected === item.value}
                                            onChange={(e) => handleFilter(e, item.value, "ctcRange")}
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

export default JobBoard