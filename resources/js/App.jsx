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
import MyProfile from './components/MyProfile';
import UserDashboard from './pages/UserDashboard';
import PermissionUserExam from './components/PermissionUserExam';
import UserExamModuel from './components/UserExamModuel';
import FeedbackPanel from './components/FeedbackPanel';
import ReviewPage from './pages/ReviewPage';
import ResultComponent from './components/exam/ResultComponent';
import JobBoard from './components/jobBoard/JobBoard.jsx';
import JobProfile from './components/jobBoard/JobProfile.jsx';
import CreateJob from './components/jobBoard/CreateJob.jsx';
import ApplyJob from './components/jobBoard/ApplyJob.jsx';

function App() {
  return (
    <div className="">
      <ToastContainer />
      <Routes>
        <Route path="/:id/exams/" element={<AdminDashboard />} />
        <Route path="/:id/exams/ExamForm" element={<ExamScheduling />} />
        <Route path="/:id/exams/addquestion" element={<QuestionBankComponent />} />
        <Route path="/:id/exams/addQuestionBank" element={<AddQuestionBank />} />
        <Route path="/:id/exams/manageQuestions" element={<ManageQuestionsComponent />} />
        <Route path="/:id/payment-details" element={<PaymentDetails />} />
        <Route path="/:id/examinations" element={<UserDashboard />} />
        <Route path="/user/:userId/exam/:examId" element={<PermissionUserExam />} />
        <Route path="/user/:userId/exam/:examId/assessment/:examAttemptId" element={<UserExamModuel />} />
        <Route path="/:id/examinations/user/:userId/exam/:examId/review" element={<ReviewPage />} />
        <Route path="/user/:userId/exam/:examId/result" element={<ResultComponent />} />
        <Route path="/:id/feedback" element={<FeedbackPanel />} />
        <Route path="/:id/job-boards" element={<JobBoard />} />
        <Route path="/:id/my-job-profiles" element={<JobProfile />} />
        <Route path="/:id/my-jobs" element={<ApplyJob />} />
        <Route path="/:id/recruter-jobs" element={<CreateJob />} />
        <Route path="/:user/my-profile" element={<MyProfile />} />
        <Route path="*" element={<div>404 - Page Not Found</div>} /> {/* Catch-all */}
      </Routes>
    </div>
  );
}

export default App;