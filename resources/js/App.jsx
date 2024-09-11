import './components/HelloReact.jsx';


import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ExamScheduling from './components/ExamSchedulingForm';
import Questionnaire from './components/Questionnaire';
import ExamPaper from './components/ExamPaper';

function AdminDashboard() {
  const [step, setStep] = useState(1); // Step 1 for ExamScheduling, 2 for Questionnaire, 3 for ExamPaper
  const [examDetails, setExamDetails] = useState(null);
  const [questionBank, setQuestionBank] = useState([]);

  const handleExamSchedule = (details) => {
    setExamDetails(details);
    setStep(2); // Move to step 2 when exam scheduling is done
  };

  const handleQuestionnaireSubmit = (selectedQuestionIds) => {
    setQuestionBank(selectedQuestionIds);
    setStep(3); // Move to step 3 when questionnaire is submitted
  };

  return (
    <div className="bg-gray-100 flex justify-center items-center min-h-screen px-8">
      <motion.div
        initial={{ justifyItems: 'center' }}
        animate={{ justifyItems: 'center' }}
        transition={{ duration: 0.5 }}
        className="grid w-full max-w-7xl gap-8"
      >
        {step === 1 && (
          <motion.div
            initial={{ opacity: 1, x: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="col-span-1 justify-self-center"
          >
            <ExamScheduling onExamSchedule={handleExamSchedule} />
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="col-span-1 justify-self-center items-center"
          >
            <Questionnaire
              examDetails={examDetails}
              setQuestionBank={handleQuestionnaireSubmit}
            />
          </motion.div>
        )}

        {step === 3 && questionBank.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="col-span-1 justify-self-center items-center"
          >
            <ExamPaper questionId={questionBank[0]} />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default AdminDashboard;
