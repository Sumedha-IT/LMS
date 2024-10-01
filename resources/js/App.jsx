import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import AddQuestionBank from './components/AddQuestionBank';
import ExamScheduling from './components/ExamScheduling';
import ManageQuestionsComponent from './components/ManageQuestionsComponent';
import QuestionBankComponent from './components/QuestionBankComponent';
import AdminDashboard from './pages/AdminDashboard';

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
      </Routes>

    </div>
  );
}

export default App;
