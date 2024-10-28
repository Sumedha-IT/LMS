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


import UserDashboard from './pages/UserDashboard';
import PermissionUserExam from './components/PermissionUserExam';
import UserExamModuel from './components/UserExamModuel';
import FeedbackPanel from './components/FeedbackPanel';

import ReviewPage from './pages/ReviewPage';
import ResultComponent from './components/exam/ResultComponent';


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
        <Route path="/administrator/:id/payment-details" element={<PaymentDetails/>} />

        <Route path="/administrator/:id/examinations" element={<UserDashboard />} />
        <Route path="/user/:userId/exam/:examId" element={<PermissionUserExam />} />
        <Route path="/user/:userId/exam/:examId/assessment/:examAttemptId" element={<UserExamModuel />} />
        <Route path="/administrator/:id/examinations/user/:userId/exam/:examId/review" element={<ReviewPage />} />
        <Route path="/user/:userId/exam/:examId/result" element={<ResultComponent />} />

        <Route path="/administrator/:id/feedback" element={<FeedbackPanel />} />

      </Routes>

    </div>
  );
}

export default App;
