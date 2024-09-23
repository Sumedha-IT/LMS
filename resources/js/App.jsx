import { Route, Routes } from 'react-router-dom';
import './App.css';
import AddQuestionBank from './components/AddQuestionBank';
import ExamScheduling from './components/ExamScheduling';
import ManageQuestionsComponent from './components/ManageQuestionsComponent';
import QuestionBankComponent from './components/QuestionBankComponent';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <div className="">
       <Routes>
        <Route path="/administrator/:id/examination/" element={<AdminDashboard />} />
        <Route path="/administrator/:id/examination/ExamForm" element={<ExamScheduling />} />
        <Route path="/administrator/:id/examination/addquestion" element={<QuestionBankComponent />} />
        <Route path="/administrator/:id/examination/addQuestionBank" element={<AddQuestionBank />} />
        <Route path="/administrator/:id/examination/manageQuestions" element={<ManageQuestionsComponent />} />
      </Routes>

    </div>
  );
}

export default App;
