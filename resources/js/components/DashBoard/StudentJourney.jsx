import { Box, Button, Grid,CircularProgress, LinearProgress, Paper, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"
import { FileText } from "lucide-react"
import Circularprogress from "./Ui/Circularprogress";
import { useEffect,useState } from "react";
import { apiRequest } from "../../utils/api";
import { useLocation } from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie';

// Custom styled components
const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 29,
  borderRadius: 45,
  backgroundColor: "rgba(229, 53, 16, 0.25)", // #E53510 with 25% opacity
  "& .MuiLinearProgress-bar": {
    borderRadius: 45,
    backgroundColor: "#E53510", // Solid #E53510 with 100% opacity
  },
}))

const ModuleCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: "#f5f5f5",
  borderRadius: 8,
}))

export default function StudentJourney({onStartLearning, curriculums = [], courseName = '', loading = false}) {
  const location = useLocation();
  const trimmedPath = location.pathname
    .split('/')
    .slice(0, -1)
    .join('/') + '/';

  // Calculate overall completion percentage
  const calculateOverallCompletion = () => {
    if (!curriculums || curriculums.length === 0) return 0;
    let totalTopics = 0;
    let completedTopics = 0;
    curriculums.forEach(curriculum => {
      if (curriculum.topics && curriculum.topics.length > 0) {
        totalTopics += curriculum.topics.length;
        completedTopics += curriculum.topics.filter(topic => topic.is_completed).length;
      }
    });
    return totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
  };

  // Calculate completion percentage for a specific curriculum
  const calculateCurriculumCompletion = (topics) => {
    if (!topics || topics.length === 0) return 0;
    const completedTopics = topics.filter(topic => topic.is_completed).length;
    return Math.round((completedTopics / topics.length) * 100);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress sx={{ color: '#f97316' }} />
        <span className="ml-3 text-gray-600">Loading...</span>
      </div>
    );
  }

  const overallCompletion = calculateOverallCompletion();

  return (
    <Box sx={{ p: 3, position: "relative", bgcolor: "white", borderRadius: 2, boxShadow: 1, marginTop: 5 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography  variant="h5" sx={{ fontWeight: 500, color: "#424242" }}>
         <a href={`${trimmedPath}my-courses`}> Student Journey</a>
        </Typography>
        <Button
          onClick={onStartLearning}
          variant="contained"
          sx={{
            background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
            color: '#fff',
            borderRadius: 2,
            px: 3,
            fontWeight: 'bold',
            boxShadow: '0 4px 16px 0 rgba(30,60,114,0.18)',
            textTransform: 'none',
            '&:hover': {
              background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
              opacity: 0.95,
            },
          }}
        >
          Ongoing Assignments
        </Button>
      </Box>
      <div className="flex justify-between w-full">
        <Typography variant="h6" sx={{ fontWeight: 500, color: "#424242", mb: 1 }}>
          {courseName}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 500, color: "#424242", mb: 1 }}>
          Total Modules {curriculums.length}
        </Typography>
      </div>
      {/* Progress Section */}
      <Box sx={{ mb: 8, mt: 6 }}>
        <Paper
          elevation={1}
          sx={{
            position: "absolute",
            top: 90,
            left: `${overallCompletion}%`,
            transform: "translateX(-50%)",
            p: 1.5,
            textAlign: "center",
            borderRadius: 2,
            zIndex: 1,
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ color: "#E53510", fontWeight: 500 }}>
            <div className="rounded-md mt-1 bg-[#E53510] bg-opacity-10 w-full">
              {overallCompletion}%
            </div>
          </Typography>
        </Paper>
        <StyledLinearProgress variant="determinate" value={overallCompletion} sx={{ mt: 2 }} />
      </Box>
      {/* Module Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-5">
        {curriculums.map((curriculum, index) => {
          const completionPercentage = calculateCurriculumCompletion(curriculum.topics);
          return (
            <div key={index} className="flex bg-[#F5F5F5] rounded-lg shadow-sm w-full relative p-3">
              <div className="absolute -left-3 top-1/2 transform -translate-y-1/2 bg-white border-[#E53510] border-l-2 rounded-full w-12 h-12 flex items-center justify-center">
                <FileText color="black" size={20} />
              </div>
              <a href={`${trimmedPath}my-courses?curriculum=${curriculum.id}`} className="flex flex-1 pl-12 justify-between items-center">
                <span className="text-gray-800 font-medium">
                  {curriculum.name}
                </span>
                <Circularprogress value={completionPercentage}  color={completionPercentage === 100 ? "#E53510" : "#E53510"}/>
              </a>
            </div>
          );
        })}
      </div>
    </Box>
  );
}