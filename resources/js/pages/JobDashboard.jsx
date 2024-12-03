import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    TablePagination,
    IconButton,
} from '@mui/material';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate, useParams } from 'react-router-dom';
import { useApplyJobMutation } from '../store/service/user/UserService';
import { toast } from 'react-toastify';
const JobDashboard = ({
    headers,
    data,
    Apply,
    Applyed,
    style = {
        container: {},
        paper: {},
        headerCell: {
            backgroundColor: '#f5f5f5',
            color: '#333',
            fontWeight: 'bold',
        },
        bodyCell: {
            color: '#333',
        },
        pagination: {
            backgroundColor: '#f5f5f5',
        },
    },
    totalRecords,
    page,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
    onApply
}) => {
    const [ApplyJob] = useApplyJobMutation();
    const nav = useNavigate();
    const { id } = useParams();
    const getExpireDate = (createdAT) => {
        const date = new Date(createdAT).getTime();
        const today = new Date().getTime();
        const timeDifference = (today - date) / (1000 * 3600 * 24);
        return timeDifference

    }
    const handleApply = async (jobApplyData) => {
        try {
            const result = await ApplyJob({ jobId: jobApplyData.id })
            console.log(result)
            if (result?.success === true || result?.data?.success === true) {
                toast.success(result.message || result.data.message);
                onApply();
            } else {
                toast.error(result.error?.message || result?.error?.data?.message);
            }

        } catch (error) {
            console.error("Error submitting form", error);
            toast.error("Failed to create job. Please try again.");
        }
    }
    const handleEditJob = (jobData) => {

        nav(`/administrator/${id}/recruter-jobs`, { state: { jobData } });
    }

    const statusColorChange = (value) => {
        if (value === "ACTIVE") {
            return <RadioButtonCheckedIcon sx={{ color: 'green', fontSize: 24 }} />
        }
        else if (value === "ONHOLD") {
            return <RadioButtonCheckedIcon sx={{ color: "blue", fontSize: 24 }} />
        }
        else {
            return <RadioButtonCheckedIcon sx={{ color: 'red', fontSize: 24 }} />
        }
    }
    return (
        <Paper sx={{ margin: '20px 0', boxShadow: 'none', ...style.paper }}>
           

            {data.length > 0 ? data?.map((row, rowIndex) => (
                <Card sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', borderRadius: 2, my: 2, boxShadow: 4 }} key={rowIndex}>
                    <CardContent sx={{ display: 'flex', justifyContent: "space-between" }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: 2 }}>
                                <WorkOutlineIcon sx={{ color: 'rgb(215, 223, 233)', fontSize: 50 }} />
                            </Box>
                            <Box>
                                <Typography variant="h6" sx={{ cursor: 'pointer' }}>
                                    {row.name || row?.jobDetails?.name}
                                </Typography>
                                <Typography variant="body1">
                                    {row.company || row.jobDetails?.company || "Anonymous"}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="body2" color="textSecondary">
                                            {row.location || row?.jobDetails?.location}
                                        </Typography>
                                        <b>•</b>
                                        <Chip label={row.jobType || row?.jobDetails?.jobType} size="small" color="primary" sx={{ fontSize: '0.75rem' }} />
                                        <b>•</b>
                                        <Typography variant="body2" color="textSecondary">
                                            INR {row.salary || row?.jobDetails?.salary} LPA
                                        </Typography>
                                        <b>•</b>
                                        <Typography variant="body2" color="textSecondary">
                                            {`${row.minExperience} - ${row.maxExperience}` || `${row?.jobDetails?.minExperience} - ${row?.jobDetails?.maxExperience}`} Year
                                        </Typography>
                                    </Box>
                                </Box>
                                <Typography variant="body2" color="textSecondary">
                                    {row.description || row?.jobDetails?.description}
                                </Typography>
                                <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                                    {statusColorChange(row?.status || row?.jobDetails?.status)}
                                    <Typography variant="body1" sx={{ marginLeft: 1 }}>
                                        {row.status.toUpperCase() || row?.jobDetails?.status.toUpperCase()}
                                    </Typography>
                                    <Box sx={{ display: "flex", ml: 3 }}>
                                        <HourglassBottomIcon sx={{ color: 'rgb(175, 186, 202)', fontSize: 24 }} />
                                        <Typography variant="body1" color="textSecondary" sx={{ marginLeft: 1 }}>
                                            Expired : {row.expiredAt || row?.jobDetails?.expiredAt}
                                        </Typography>
                                    </Box>
                                </Box>

                            </Box>
                        </Box>
                        {!Applyed ?
                            (!Apply ?
                                <Box sx={{ display: 'flex', flexDirection: "column", justifyContent: 'space-between', alignItems: 'center', padding: 2 }}>
                                    <Button variant="contained" color="primary" sx={{ fontSize: '0.875rem' }} onClick={() => handleApply(row)}>
                                        Apply Now
                                    </Button>
                                    <Typography variant="body1" >
                                        {Math.floor(getExpireDate(row?.createdAt || row?.jobDetails?.creteateAt))} days to go
                                    </Typography>
                                </Box> :
                                <IconButton sx={{ position: 'absolute', top: 8, right: 8 }} onClick={() => handleEditJob(row)}>
                                    <EditIcon />
                                </IconButton>) : null}
                    </CardContent>
                </Card>)) : <Typography sx={{ textAlign: 'center', padding: '20px' }}>
                No data Available
            </Typography>
            }

            {/* Pagination Component */}
            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={totalRecords}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={onPageChange}
                onRowsPerPageChange={(event) => onRowsPerPageChange(parseInt(event.target.value, 10))}
                sx={{ ...style.pagination }}
            />
        </Paper >
    );
}

export default JobDashboard
