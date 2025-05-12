import React from 'react';
import { useNavigate } from 'react-router-dom';
import LearningJourney from '../components/DashBoard/LearningJourney';

const StudentJourney = () => {
  const navigate = useNavigate();
  
  const handleClose = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="container mx-auto">
      <LearningJourney onCloseLearning={handleClose} />
    </div>
  );
};

export default StudentJourney;
