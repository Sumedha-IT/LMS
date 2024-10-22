
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu'; // Toggle button icon
import { Box, Button, Drawer, Grid, IconButton, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import QuestionPanel from '../components/exam/QuestionPanel';
import ResultComponent from '../components/exam/ResultComponent';
import ResultStatus from '../components/exam/ResultStatus';
import { useGetExamQuestionsMutation, useGetReviewExamQuestionMutation } from '../store/service/user/UserService';
import { getQuestionsData } from '../store/slices/userSlice/UserExamSlice';


const ReviewPage = () => {
    const dispatch = useDispatch();
    const QuestionsData = useSelector(state => state?.UserExamReducer?.QuestionsData);
    const [questions, setQuestions] = useState([]);
    const [activeQuestion, setActiveQuestion] = useState();
    const [isSubmit, setIsSubmit] = useState(true);
    const [openStatusPanel, setOpenStatusPanel] = useState(false);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [buttonDisable, setButtonDisable] = useState(false);
    const [isReviewMode, setIsReviewMode] = useState(false);
    const [partIds, setPartIds] = useState([])
    const [activePartId, setActivePartId] = useState("")
    const [getExamQuestions] = useGetExamQuestionsMutation();
    const { userId, examId, examAttemptId } = useParams();
    const [getReviewExamQuestion] = useGetReviewExamQuestionMutation();
    const examDetails = JSON.parse(localStorage.getItem('reviewDetails'));
    const navigate = useNavigate();








    // useEffect(() => {
    //     getData();
    // }, [page]);

    // Main function to fetch questions data
    const getData = async (partId = "") => {
        if (QuestionsData[partId]) {
            setActivePartId(partId)
            setQuestions(QuestionsData[partId]);
            let activeIndex = QuestionsData[partId].findIndex(q => !q.answered)
            setActiveQuestion(QuestionsData[partId][activeIndex]); // Set the first question as active
        } else {
            try {
                let result = await getExamQuestions({ userId, examAttemptId, partId, page, rowsPerPage });
                const { data } = result;
                setPartIds(data?.partIds);
                if (data && data?.data?.length > 0) {
                    const updatedQuestions = data?.data?.map((q, index) =>
                        index === 0 ? { ...q, visited: true } : q
                    );
                    if (partId === '') {
                        partId = data?.partIds[0]
                        setActivePartId(partId)
                    } else {
                        setActivePartId(partId)
                    }
                    let StoreData = { ...QuestionsData, [partId]: updatedQuestions }
                    // Step 3: Dispatch the fetched data to the Redux store
                    dispatch(getQuestionsData(StoreData));

                    // Update the local state
                    setQuestions(updatedQuestions);
                    setActiveQuestion(updatedQuestions[0]);
                }
            } catch (e) {
                console.error('Error fetching questions:', e);
            }
        }
    }




    // Updated handleNextQuestion to work with updated questions passed as argument
    const handleNextQuestion = (nextQuestionId, questionsData = questions) => {

        const nextQuestion = questionsData.find(q => q.id === nextQuestionId);
        if (nextQuestion) {
            setButtonDisable(false);
            const updatedQuestions = questionsData.map(q =>
                q.id === nextQuestionId ? { ...q, visited: true } : q
            );
            setQuestions(updatedQuestions);
            dispatch(getQuestionsData({ ...QuestionsData, [activePartId]: updatedQuestions }));
            setActiveQuestion(nextQuestion);
        } else {
            // Disable the "Next" button if no more questions are found
            setButtonDisable(true);
        }
    };


    // handleReviewQuestion remains unchanged for now
    const handleReviewQuestion = async (obj) => {
        setIsReviewMode(true);
        setIsSubmit(false);
        setButtonDisable(false);

        try {
            const resultData = await getReviewExamQuestion(obj);
            const { data } = resultData;
            if (data && data.data.length > 0) {
                const updatedQuestions = data.data.map((q, index) =>
                    index === 0 ? { ...q, visited: true } : q
                );
                setQuestions(updatedQuestions);
                setActiveQuestion(data.data[0]);
                setPartIds(data?.partIds);
                setActivePartId(obj.partId)
            }
        } catch (e) {
            console.log(e);
        }
    };


    const toggleStatusPanel = (open) => () => {
        setOpenStatusPanel(open);
    };

    return (
        <>
            {/* {questions ? */}
            <Box sx={{
                width: '100%', bgcolor: '#f4f5f7', height: '100vh', '@media (min-width: 0px) and (max-width: 425px)': {
                    height: '100vh', // change height for this range
                },
            }}>
                {/* Header Section */}
                <Box sx={{ bgcolor: '#f97316' }}>
                    <Box sx={{
                        bgcolor: '#f97316', display: {
                            sm: 'flex',
                        }, alignItems: 'center', p: 1, justifyContent: "space-between", width: "60%",
                    }}>
                        <Typography sx={{ fontSize: { xs: '15px', md: '17px', lg: '20px' }, color: 'white', ml: '1.5px', fontWeight: 'bold' }}>
                            {examDetails?.title}
                        </Typography>
                        <Typography sx={{ fontSize: { xs: '15px', md: '17px', lg: '20px' }, color: 'white', fontWeight: 'bold' }}>
                            Time Taken: {examDetails?.duration}
                        </Typography>
                    </Box>
                    <Button onClick={() => { navigate('/user'); }} sx={{ position: 'absolute', top: 0, right: 0 }}>
                        <CloseIcon sx={{ color: 'white' }} />
                    </Button>
                </Box>
                {/* Main Content Section */}
                <Grid container spacing={0} sx={{ height: `calc(100vh - 49px)`, '@media (min-width: 0px) and (max-width: 599px)': { height: `calc(100vh - 63px)` }, '@media (min-width: 599px) and (max-width: 1100px)': { height: `calc(100vh - 42px)` } }}>
                    <Grid item xs={12} sm={ 8} md={ 9} sx={{ p: 0}}>
                        {isSubmit ? (
                            <ResultComponent userId={userId} examId={examId} handleReviewQuestion={handleReviewQuestion} />
                        ) : (
                            <QuestionPanel
                                question={activeQuestion}
                                onNext={handleNextQuestion}
                                handleReviewQuestion={handleReviewQuestion}
                                questions={questions}
                                isReviewMode={isReviewMode}
                                partIds={partIds}
                                getSection={getData}
                                buttonDisable={buttonDisable}
                                activePartId={activePartId}
                            />
                        )}

                    </Grid>

                    {/* Right: Status Panel (Visible on larger screens, toggle on small screens) */}
                    <Grid item sm={4}md={3} sx={{ bgcolor: 'white', p: 0, borderLeft: '1px solid #e0e0e0', display: { xs: 'none', sm: 'block' }}}>

                        <ResultStatus userId={userId} examId={examId} setIsSubmit={setIsSubmit} isSubmit={isSubmit} showReport={isReviewMode} setShowReport={setIsReviewMode} />

                    </Grid>
                </Grid>

                {/* Toggle Button for Status Panel on Small Screens */}
                <Box sx={{
                    display: { xs: 'block', sm: 'none' }, position: 'fixed', bottom: 16, right: 16, '@media (min-width: 350px) and (max-width: 463px)': {
                        bottom: '65px',
                    }
                }}>
                    <IconButton onClick={toggleStatusPanel(true)} sx={{ bgcolor: '#f97316', color: 'white' }}>
                        <MenuIcon />
                    </IconButton>
                </Box>

                {/* Drawer for Status Panel on Small Screens */}
                <Drawer
                    anchor="right"
                    open={openStatusPanel}
                    onClose={toggleStatusPanel(false)}
                    sx={{ display: { xs: 'block', md: 'none' } }}>
                    <IconButton onClick={toggleStatusPanel(false)} sx={{ position: 'fixed', color: 'black', p: '3px' }}>
                        <CloseIcon sx={{ fontWeight: '700', borderRadius: '2px' }} />
                    </IconButton>
                    <Box sx={{ width: 300, p: 2, height: '100%' }}>

                        <ResultStatus userId={userId} examId={examId} setIsSubmit={setIsSubmit} isSubmit={isSubmit} showReport={isReviewMode} setShowReport={setIsReviewMode} />


                    </Box>
                </Drawer>
            </Box>
            {/* : <>
                    <Box sx={{
                        display: 'flex', justifyContent: 'center', alignItems: 'center', height: `calc(100vh - 60px)`
                    }}>
                        <CircularProgress />
            </Box>
                </>} */}
        </>
    );
};

export default ReviewPage;
