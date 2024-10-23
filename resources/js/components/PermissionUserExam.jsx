import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Checkbox,
    FormControlLabel,
    Avatar,
    Divider,
    Button,
    CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetAttemptedIdQuery } from '../store/service/user/UserService';

const PermissionUserExam = () => {
    const [isChecked, setIsChecked] = useState(false);
    const navigate = useNavigate();
    const { userId, examId } = useParams();

    // Fetch the exam attempt details
    const { data, isLoading, isError, error } = useGetAttemptedIdQuery({ userId, examId });

    // States for storing fetched data
    const [examDetails, setExamDetails] = useState({});
    const [userDetails, setUsermDetails] = useState({});
    let examAttemptId;

    useEffect(() => {
        if (data) {
            setExamDetails(data.data.examDetails);
            setUsermDetails(data.data.userDetails);
            localStorage.setItem('userdetails', JSON.stringify(data?.data?.userDetails));
            localStorage.setItem('examDetails', JSON.stringify(data?.data?.examDetails));
            examAttemptId = data.data.examAttemptId;
        }
    }, [data]);

    const getInitials = (name) => {
        return name
            ? name.split(' ').map((word) => word[0]).join('').toUpperCase()
            : '';
    };

    // Handle checkbox toggle
    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };

    // Handle exam start
    const handleStartExam = () => {
        if (isChecked && data.data) {
            navigate(`${window.location.pathname}/assessment/${data.data.examAttemptId}`);
            // localStorage.setItem('timeLeft', data.data.timeLeft);
        }
    };

    // Handle going back to "/user"
    const handleGoBack = () => {
        navigate('/user'); // Redirect to "/user"
    };

    return (
        <>
            {isLoading && (
                <Box sx={{
                    display: 'flex', justifyContent: 'center', alignItems: 'center', height: `calc(100vh - 60px)`
                }}>
                    <CircularProgress />
                </Box>
            )}

            {isError && error?.status === 400 && (
                <Box sx={{
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: `calc(100vh - 60px)`
                }}>
                    <Typography variant="h6" sx={{ color: '#f97316', textAlign: 'center' }}>
                        {error.data.message}
                    </Typography>
                    <Button variant="contained" onClick={handleGoBack} sx={{ mt: 3, bgcolor: '#f97316' }}>
                        Go Back
                    </Button>
                </Box>
            )}

            {data && !isError && !isLoading && (
                <>
                    <Box sx={{ bgcolor: '#f97316', display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1 }}>
                        <Typography variant="h7" sx={{ color: "white", fontWeight: 'bold' }}>
                            {examDetails.title}
                        </Typography>
                        <Button onClick={() => navigate(-1)}>
                            <CloseIcon sx={{ color: 'white' }} />
                        </Button>
                    </Box>
                    <Box sx={{ width: '100%', bgcolor: '#f4f5f7', height: `calc(100vh - 52px)`, p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                {examDetails.title}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                    Total Duration:
                                </Typography>
                                <Typography sx={{ color: '#f97316', fontWeight: 'bold' }}>
                                    {examDetails.duration}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {userDetails.img ? (
                                    <Avatar src={userDetails.img} sx={{ width: 60, height: 60 }} />
                                ) : (
                                    <Avatar sx={{ width: 60, height: 60, backgroundColor: '#f97316', fontWeight: 'bold' }}>
                                        {getInitials(userDetails.name)}
                                    </Avatar>
                                )}
                                <Box className='text-black text-start ml-2 hidden sm:block'>
                                    <Typography className="text-[12px] xl:text-[14px] font-semibold 2xl:text-[16px]">
                                        {userDetails.name}
                                    </Typography>
                                    <Typography className="text-[10px] xl:text-[12px] 2xl:text-[12px] font-light">
                                        {userDetails.email}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        {/* Main Content */}
                        <Box sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center', mb: 2 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                    Instructions:
                                </Typography>
                            </Box>

                            <Typography
                                sx={{
                                    textAlign: examDetails?.instructions ? 'start' : 'center',
                                    color: examDetails?.instructions ? 'black' : '#777',
                                    minHeight: '340px',
                                    border: '1px dashed #ddd',
                                    p: 2,
                                    mb: 3
                                }}
                            >
                                {examDetails?.instructions || "Exam Instructions and Guidelines will go here."}
                            </Typography>

                            {/* Declaration checkbox */}
                            <Box sx={{ mt: 4 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                                    Declaration:
                                </Typography>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={isChecked}
                                            onChange={handleCheckboxChange}
                                            name="declaration"
                                            sx={{
                                                color: '#f97316',
                                                '&.Mui-checked': { color: '#f97316' },
                                            }}
                                        />
                                    }
                                    label="I have read all the instructions carefully and have understood them. I agree not to cheat or use unfair means in this examination. I understand that using unfair means of any sort for my own or someone else’s advantage will lead to my immediate disqualification. The decision of the administrator will be final in these matters and cannot be appealed."
                                />
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            {/* Footer buttons */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Button
                                    variant="contained"
                                    disabled={!isChecked} // Disable the button until the checkbox is checked
                                    sx={{
                                        bgcolor: isChecked ? '#f97316' : '#fbbf24',
                                        color: 'white',
                                        textTransform: 'none',
                                        borderRadius: '20px',
                                        px: 3,
                                        py: 1.5,
                                        fontWeight: 'bold',
                                        '&:hover': {
                                            bgcolor: isChecked ? '#f97316' : '#fbbf24',
                                        },
                                    }}
                                    onClick={handleStartExam}
                                >
                                    I am ready to begin
                                </Button>

                                {/* Go Back button */}
                                <Button
                                    variant="contained"
                                    sx={{
                                        bgcolor: '#808080',
                                        color: 'white',
                                        textTransform: 'none',
                                        borderRadius: '20px',
                                        px: 3,
                                        py: 1.5,
                                        fontWeight: 'bold',
                                        '&:hover': {
                                            bgcolor: '#666666',
                                        },
                                    }}
                                    onClick={handleGoBack} // Go back to /user
                                >
                                    Go Back
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </>
            )}
        </>
    );
};

export default PermissionUserExam;
