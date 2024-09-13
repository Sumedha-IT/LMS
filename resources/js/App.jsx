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
        <Route path="/administrator/1/examination/" element={<AdminDashboard />} />
        <Route path="/ExamForm" element={<ExamScheduling />} />
        <Route path="/addquestion" element={<QuestionBankComponent />} />
        <Route path="/addQuestionBank" element={<AddQuestionBank />} />
        <Route path="/manageQuestions" element={<ManageQuestionsComponent />} />

      </Routes>

    </div>
  );
}

export default App;
