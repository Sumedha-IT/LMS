




import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import data from "../utils/question"; // Replace with the correct path to your question data

const Questionnaire = ({ examDetails, setQuestionBank }) => {
  const [questions, setQuestions] = useState(
    data.map((question) => ({
      ...question,
      include: false,
    }))
  );
  const [error, setError] = useState('');

  const handleMarksChange = (index, marks) => {
    const updatedQuestions = questions.map((q, i) =>
      i === index ? { ...q, marks: parseInt(marks, 10) || 0 } : q
    );
    setQuestions(updatedQuestions);
  };

  const handleIncludeChange = (index) => {
    const updatedQuestions = questions.map((q, i) => ({
      ...q,
      include: i === index ? !q.include : false, // Deselect others and toggle the selected one
    }));
    setQuestions(updatedQuestions);
  };

  const calculateTotalMarks = () => {
    return questions.reduce((total, question) =>
      question.include ? total + question.marks : total, 0
    );
  };

  const validateQuestionSelection = () => {
    const selectedCount = questions.filter(q => q.include).length;
    if (selectedCount === 0) {
      setError('At least one question must be selected.');
      return false;
    } else {
      setError('');
      return true;
    }
  };

  const handleSubmit = () => {
    const isValid = validateQuestionSelection();

    if (!isValid) {
      console.log("Error: ", error);
      return;
    }

    // Extract the ID of the selected question
    const selectedQuestionIds = questions
      .filter(q => q.include)
      .map(q => q.value);  // Use `q.id` to get the ID

    const totalMarks = calculateTotalMarks();

    // Pass only the selected question IDs to setQuestionBank
    setQuestionBank(selectedQuestionIds);
    // setExamScheduled(false)

    console.log("Selected Question IDs: ", selectedQuestionIds);
    console.log("Total Marks: ", totalMarks);
  };

  return (
    <div className="w-full max-w-2xl p-6 bg-white shadow-lg rounded-lg ml-8">
      <h2 className="text-2xl font-bold mb-4">Questionnaire</h2>
      <table className="table-auto w-full mb-4">
        <thead>
          <tr>
            <th className="px-4 py-2">Subject Name</th>
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Time Slot</th>
            <th className="px-4 py-2">Max Marks</th>
            <th className="px-4 py-2">Min Marks</th>
            <th className="px-4 py-2">No. of Questions</th>
          </tr>
        </thead>
        <tbody>
          <tr className="cursor-pointer hover:bg-gray-100">
            <td className="border px-4 text-center py-2">{examDetails.subjectName}</td>
            <td className="border px-4 text-center py-2">{examDetails.title}</td>
            <td className="border px-4 text-center py-2">{examDetails.timeSlot}</td>
            <td className="border px-4 text-center py-2">{examDetails.maxMarks}</td>
            <td className="border px-4 text-center py-2">{examDetails.minMarks}</td>
            <td className="border px-4 text-center py-2">{examDetails.numQuestions}</td>
          </tr>
        </tbody>
      </table>

      <div className="p-4 bg-gray-50 rounded-lg shadow-inner">
        <h3 className="text-lg font-semibold mb-4">Questions and Marks Allocation</h3>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-1">
            <span className="text-sm font-semibold">Include</span>
          </div>
          <div className="col-span-8">
            <span className="text-sm font-semibold">Questions</span>
          </div>
          <div className="col-span-3">
            <span className="text-sm font-semibold">Marks</span>
          </div>
        </div>
        {questions.map((question, index) => (
          <div key={index} className="grid grid-cols-12 gap-4 items-center mb-4">
            <Checkbox
              checked={question.include}
              onChange={() => handleIncludeChange(index)}
              className="col-span-1"
            />
            <span className="col-span-8">{question.text}</span>
            <TextField
              type="number"
              className="col-span-3"
              placeholder="Marks"
              value={question.marks}
              onChange={(e) => handleMarksChange(index, e.target.value)}
              disabled={!question.include}  // Disable marks input unless the question is selected
            />
          </div>
        ))}
        <div className="flex justify-between">
          <span>Total Marks:</span>
          <span>{calculateTotalMarks()}</span>
        </div>
        {error && (
          <div className="text-red-500 mt-2">{error}</div>
        )}
      </div>
      <Button color="primary" variant="contained" fullWidth type="submit" onClick={handleSubmit}>
        Set Questionaries
      </Button>
    </div>
  );
};

export default Questionnaire;
