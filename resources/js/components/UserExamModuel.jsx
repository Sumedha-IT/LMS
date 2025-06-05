import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, Typography, IconButton, Drawer } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu'; // Toggle button icon
import Countdown from 'react-countdown';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetExamQuestionsMutation, useGetReviewExamQuestionMutation } from '../store/service/user/UserService';
import QuestionPanel from './exam/QuestionPanel';
import ResultComponent from './exam/ResultComponent';
import ResultStatus from './exam/ResultStatus';
import StatusPanel from './exam/StatusPanel';
import SubmissionPage from '../common/SubmissionPage';
import QuitConfirmation from '../common/QuitConfirmation';
import { useDispatch, useSelector } from 'react-redux';
import { getQuestionsData } from '../store/slices/userSlice/UserExamSlice'
import LoadingFallback from './DashBoard/LoadingFallback';

const UserExamModule = () => {
    const dispatch = useDispatch();
    const QuestionsData = useSelector(state => state?.UserExamReducer?.QuestionsData);
    const [questions, setQuestions] = useState([]);
    const [activeQuestion, setActiveQuestion] = useState();
    const [startTime, setStartTime] = useState(null);
    const [isSubmit, setIsSubmit] = useState(false);
    const [openStatusPanel, setOpenStatusPanel] = useState(false);
    const [quitConfirmation, setQuitConfirmation] = useState(false);
    const [examDuration, setExamDuration] = useState("00:00");
    const [timeLeft, setTimeLeft] = useState(() => localStorage.getItem('timeLeft') || "00:00"); // Initialize from localStorage
    const [isTimeOver, setIsTimeOver] = useState(() => JSON.parse(localStorage.getItem('isTimeOver')) || false); // Initialize from localStorage
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [buttonDisable, setButtonDisable] = useState(false);
    const [isReviewMode, setIsReviewMode] = useState(false);
    const [partIds, setPartIds] = useState([])
    const [activePartId, setActivePartId] = useState("")
    const [isSubmission, setIsSubmission] = useState(false)
    const [submitButton, setSubmitButton] = useState(false)
    const [getExamQuestions] = useGetExamQuestionsMutation();
    const { userId, examId, examAttemptId } = useParams();
    const [getReviewExamQuestion] = useGetReviewExamQuestionMutation();
    const examDetails = JSON.parse(localStorage.getItem('examDetails'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getData();
    }, [page]);

    useEffect(() => {
        if (activeQuestion) {
            const activeQuestionData = questions.find((ques) => ques.id === activeQuestion.id);
            setActiveQuestion(activeQuestionData)
        }
    }, [dispatch, questions])

    // Main function to fetch questions data
    const getData = async (partId = "") => {
        if (QuestionsData[partId]) {
            setActivePartId(partId)
            setQuestions(QuestionsData[partId]);
            let activeIndex = QuestionsData[partId].findIndex(q => ((!q.answered && q.answer === null) || q.answer !== null))
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
            } finally {
                setLoading(false);
            }
        }
    }

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            // Only show confirmation dialog if not in submission/completed state
            if (!isSubmit) {
                event.preventDefault();
                event.returnValue = '';  // This triggers the browser's confirmation dialog
            }
        };

        // Add the event listener for the beforeunload event
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            // Cleanup the event listener when the component is unmounted
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isSubmit]);

    useEffect(() => {
        setButtonDisable(false)

        const currentTime = new Date();

        if (examDetails) {
            const [endHours, endMinutes] = examDetails.ends_at.split(':').map(Number);

            const examEndTime = new Date();
            examEndTime.setHours(endHours);
            examEndTime.setMinutes(endMinutes);
            examEndTime.setSeconds(0);

            const timeLeftInMs = examEndTime.getTime() - currentTime.getTime();
            if (timeLeftInMs > 0) {
                setExamDuration(timeLeftInMs);
                setTimeLeft(timeLeftInMs); // Set time left
                setStartTime(currentTime);
                localStorage.setItem('timeLeft', timeLeftInMs); // Persist time left in localStorage
            } else {
                console.log('Exam has already ended.');
            }
        }
    }, []);

    const getExamEndTime = () => {
        if (startTime && examDuration) {
            return new Date(startTime.getTime() + examDuration);
        }
        return null;
    };

    // Updated handleAnswer to dispatch changes to Redux
    const handleAnswer = (questionId, selectedOption) => {
        const data = questions.find((q) => q.id === questionId)
        let updatedQuestions = []

        if (data.saved) {
            if (data?.answer?.selectedOption !== selectedOption) {
                updatedQuestions = questions.map(q =>
                    q.id === questionId ? { ...q, selectedOption, answered: true, saved: false, statusCode: "" } : q
                );
            } else {
                updatedQuestions = questions.map(q =>
                    q.id === questionId ? { ...q, selectedOption, answered: true, saved: true, statusCode: "" } : q
                );
            }
        } else {
            updatedQuestions = questions.map(q =>
                q.id === questionId ? { ...q, selectedOption, answered: true, statusCode: "" } : q
            );
            if (data?.answer?.selectedOption === selectedOption) {
                updatedQuestions = updatedQuestions.map(q =>
                    q.id === questionId ? { ...q, selectedOption, answered: true, saved: true, statusCode: "" } : q
                );
            }

        }
        setQuestions(updatedQuestions);
        dispatch(getQuestionsData({ ...QuestionsData, [activePartId]: updatedQuestions }));
    };

    // Updated handleMarkForReview to dispatch changes to Redux
    const handleMarkForReview = (questionId) => {
        const updatedQuestions = questions.map(q =>
            q.id === questionId ? { ...q, markedForReview: true } : q
        );
        setQuestions(updatedQuestions);
        dispatch(getQuestionsData({ ...QuestionsData, [activePartId]: updatedQuestions })); // Update Redux
        handleNextQuestion(questionId + 1, updatedQuestions);

    };

    // Updated handleClearResponse to dispatch changes to Redux
    const handleClearResponse = (questionId) => {
        const updatedQuestions = questions.map(q =>
            q.id === questionId ? { ...q, selectedOption: null, answered: false, saved: false, answer: null, statusCode: "" } : q
        );
        setQuestions(updatedQuestions);

        // Update Redux with cleared response
        dispatch(getQuestionsData({ ...QuestionsData, [activePartId]: updatedQuestions }));
    };

    // Updated handleNextQuestion to work with updated questions passed as argument
    const handleNextQuestion = (nextQuestionId, questionsData = questions) => {

        const nextQuestion = questionsData.find(q => q.id === nextQuestionId);
        if (nextQuestion) {
            setButtonDisable(false);
            const updatedQuestions = questionsData.map(q =>
                q.id === nextQuestionId ? { ...q, visited: true } : q.id === nextQuestionId - 1 ? { ...q, saved: true } : q
            );
            setQuestions(updatedQuestions);
            dispatch(getQuestionsData({ ...QuestionsData, [activePartId]: updatedQuestions }));
            setActiveQuestion(nextQuestion);
        } else {
            const updatedQuestions = questionsData.map(q =>
                q.id === nextQuestionId - 1 ? { ...q, saved: true } : q
            );
            setQuestions(updatedQuestions);
            dispatch(getQuestionsData({ ...QuestionsData, [activePartId]: updatedQuestions }));
            // Disable the "Next" button if no more questions are found

            setActiveQuestion(updatedQuestions.find(q => q.id === nextQuestionId - 1));
            setButtonDisable(true);
        }
    };

    const handleQuitConfirmations = () => {
        setQuitConfirmation(true)
        setIsSubmission(false)
    }

    // handleSubmitQuiz remains unchanged for now
    const handleSubmitQuiz = () => {
        const answers = questions.map(q => ({
            id: q.id,
            selectedOption: q.selectedOption
        }));
        setOpenStatusPanel(false);
        setIsSubmit(false);
        localStorage.removeItem('examStartTime');
        setIsSubmission(!isSubmission);
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
                setActivePartId(obj.partId)
            }
        } catch (e) {
            console.log(e);
        }
    };

    const renderer = ({ hours, minutes, seconds, completed }) => {
        if (isTimeOver || completed) {
            return <span>00:00</span>; // Display 00:00 when exam is over
        } else {
            return <span>{hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</span>;
        }
    };

    const toggleStatusPanel = (open) => () => {
        setOpenStatusPanel(open);
    };

    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: `calc(100vh - 60px)`
            }}>
                <LoadingFallback />
            </Box>
        );
    }

    return (
        <>
            {/* {questions ? */}
            <Box sx={{
                width: '100%', bgcolor: '#f4f5f7',
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
                            Time Left:
                            {startTime && (
                                <Countdown
                                    date={getExamEndTime()}
                                    renderer={renderer}
                                    onComplete={handleSubmitQuiz}
                                />
                            )}
                        </Typography>
                    </Box>
                    <Button onClick={() => {
                        if (isSubmit) {
                            window.close()
                        } else {
                            handleQuitConfirmations();
                        }
                    }} sx={{ position: 'absolute', top: 0, right: 0 }}>
                        <CloseIcon sx={{ color: 'white' }} />
                    </Button>
                </Box>
                {/* Main Content Section */}
                <Grid container spacing={0} sx={{ height: `calc(100vh - 90px)`, '@media (min-width: 0px) and (max-width: 599px)': { height: `calc(100vh - 63px)` }, '@media (min-width: 599px) and (max-width: 1100px)': { height: `calc(100vh - 42px)` } }}>
                    <Grid item xs={12} sm={8} md={9} sx={{ p:0}}>
                        {quitConfirmation ? <QuitConfirmation setQuitConfirmation={setQuitConfirmation} setIsSubmission={setIsSubmission}
                            setIsSubmit={setIsSubmit} setTimeLeft={setTimeLeft}
                            setIsTimeOver={setIsTimeOver} /> : <>
                            {
                                isSubmission ? (
                                    <SubmissionPage style="background-color:red;" userId={userId} examId={examId} examAttemptId={examAttemptId} setIsSubmit={setIsSubmit} setIsSubmission={setIsSubmission} setSubmitButton={setSubmitButton} setTimeLeft={setTimeLeft}
                                        setIsTimeOver={setIsTimeOver}/>
                                ) : isSubmit ? (
                                    <ResultComponent userId={userId} examId={examId} examAttemptId={examAttemptId} handleReviewQuestion={handleReviewQuestion} />
                                ) : (
                                    <QuestionPanel
                                        question={activeQuestion}
                                        onAnswer={handleAnswer}
                                        onNext={handleNextQuestion}
                                        onMarkForReview={handleMarkForReview}
                                        onClearResponse={handleClearResponse}
                                        handleReviewQuestion={handleReviewQuestion}
                                        questions={questions}
                                        isReviewMode={isReviewMode}
                                        partIds={partIds}
                                        getSection={getData}
                                        buttonDisable={buttonDisable}
                                        activePartId={activePartId}
                                    />
                                )}
                        </>}
                    </Grid>

                    {/* Right: Status Panel (Visible on larger screens, toggle on small screens) */}
                    <Grid item sm={4} md={3} sx={{ bgcolor: 'white', p: 0, borderLeft: '1px solid #e0e0e0', display: { xs: 'none', sm: 'block' } }}>
                        {(isSubmit && !isSubmission) || isReviewMode ? (
                            <ResultStatus onSubmitQuiz={handleSubmitQuiz} userId={userId} setIsSubmit={setIsSubmit} examId={examId} submitButton={submitButton} showReport={isReviewMode} setShowReport={setIsReviewMode} />
                        ) : (
                            <StatusPanel
                                questions={questions}
                                activeQuestion={activeQuestion}
                                onQuestionChange={handleNextQuestion}
                                onSubmitQuiz={handleSubmitQuiz}
                                isSubmission={isSubmission}

                            />
                        )}
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
                        {isSubmit && !isSubmission ? (
                            <ResultStatus onSubmitQuiz={handleSubmitQuiz} userId={userId} examId={examId} setIsSubmit={setIsSubmit} submitButton={submitButton} showReport={isReviewMode} setShowReport={setIsReviewMode} />
                        ) : (
                            <StatusPanel
                                questions={questions}
                                activeQuestion={activeQuestion}
                                onQuestionChange={handleNextQuestion}
                                onSubmitQuiz={handleSubmitQuiz}
                            />
                        )}

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

export default UserExamModule;
