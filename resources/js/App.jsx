import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import AddQuestionBank from './components/AddQuestionBank';
import ExamScheduling from './components/ExamScheduling';
import ManageQuestionsComponent from './components/ManageQuestionsComponent';
import QuestionBankComponent from './components/QuestionBankComponent';
import PaymentDetails from './components/PaymentDetails.jsx';
import AdminDashboard from './pages/AdminDashboard';
// import App from './App.jsx';


import UserDashboard from './pages/UserDashboard';
import PermissionUserExam from './components/PermissionUserExam';
import UserExamModuel from './components/UserExamModuel';
import FeedbackPanel from './components/FeedbackPanel';


import ReviewPage from './pages/ReviewPage';
import ResultComponent from './components/exam/ResultComponent';
// import PlacementCoordinator from './components/placement/PlacementCoordinator.jsx';
// import PlacementCoordinator from './components/placement/PlacementCoordinator.jsx';
import JobBoard from './components/jobBoard/JobBoard.jsx';
import JobProfile from './components/jobBoard/JobProfile.jsx';
import CreateJob from './components/jobBoard/CreateJob.jsx';
import ApplyJob from './components/jobBoard/ApplyJob.jsx';
import MyProfile from './components/MyProfile.jsx';
import NewDashBoard from './pages/NewDashBoard.jsx';
import MyCourses from './pages/MyCourses';
import Topics from './pages/Topics';
import Announcements from './pages/Announcements';

function App() {
  return (
    <div className="">
      <ToastContainer />
      <Routes>
        <Route path="/administrator/:id/exams/" element={<AdminDashboard />} />
        <Route path="/administrator/:id/exams/ExamForm" element={<ExamScheduling />} />
        <Route path="/administrator/:id/exams/addquestion" element={<QuestionBankComponent />} />
        <Route path="/administrator/:id/exams/addQuestionBank" element={<AddQuestionBank />} />
        <Route path="/administrator/:id/exams/manageQuestions" element={<ManageQuestionsComponent />} />
        <Route path="/administrator/:id/payment-details" element={<PaymentDetails />} />
        <Route path="/administrator/:id/examinations" element={<UserDashboard />} />
        <Route path="/administrator/:id/exams/" element={<AdminDashboard />} />
        <Route path="/administrator/:id/exams/ExamForm" element={<ExamScheduling />} />
        <Route path="/administrator/:id/exams/addquestion" element={<QuestionBankComponent />} />
        <Route path="/administrator/:id/exams/addQuestionBank" element={<AddQuestionBank />} />
        <Route path="/administrator/:id/exams/manageQuestions" element={<ManageQuestionsComponent />} />
        <Route path="/administrator/:id/payment-details" element={<PaymentDetails />} />
        <Route path="/administrator/:id/examinations" element={<UserDashboard />} />
        <Route path="/user/:userId/exam/:examId" element={<PermissionUserExam />} />
        <Route path="/user/:userId/exam/:examId/assessment/:examAttemptId" element={<UserExamModuel />} />
        <Route path="/administrator/:id/examinations/user/:userId/exam/:examId/review" element={<ReviewPage />} />
        <Route path="/administrator/:id/examinations/user/:userId/exam/:examId/review" element={<ReviewPage />} />
        <Route path="/user/:userId/exam/:examId/result" element={<ResultComponent />} />

        {/* <Route path='/administrator/:id/placement' element={<PlacementCoordinator />} /> */}
        <Route path="/administrator/:id/feedback" element={<FeedbackPanel />} />


        <Route path='/administrator/:id/job-boards' element={<JobBoard />} />
        <Route path='/administrator/:id/my-job-profiles' element={<JobProfile />} />
        <Route path='/administrator/:id/my-jobs' element={<ApplyJob />} />

        {/* recruiter */}
        <Route path='/administrator/:id/recruter-jobs' element={<CreateJob />} />

        {/* Myprofile */}
        <Route path="/administrator/:id/my-profile" element={<MyProfile />} />
        {/* <Route path="/:user/my-profile" element={<MyProfile />} /> */}

{/* Custome Dashboard */}
        <Route path="/administrator/:id/Student-Dashboard-Page" element={<NewDashBoard />} />

        {/* My Courses */}
        <Route path="/administrator/:id/my-courses" element={<MyCourses />} />

        {/* Announcements */}
        <Route path="/administrator/:id/student-announcements" element={<Announcements />} />

        {/* Remove Topics route as functionality is now in MyCourses */}
        {/* <Route path="/administrator/:id/topics/:curriculumId" element={<Topics />} /> */}
      </Routes>


    </div>
  );
}

export default App;