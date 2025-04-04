

import { Box, Button, Grid, LinearProgress, Paper, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"
import { FileText } from "lucide-react"
import Circularprogress from "./Ui/Circularprogress";

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

export default function StudentJourney() {
  return (
    <Box sx={{ p: 3, position: "relative", bgcolor: "white", borderRadius: 2, boxShadow: 1, marginTop: 5 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 500, color: "#424242" }}>
          Student Journey
        </Typography>
        <Button
          variant="outlined"
          sx={{
            borderColor: "#E53510",
            color: "#E53510",
            borderRadius: 2,
            px: 2,
            "&:hover": {
              borderColor: "#E53510",
              backgroundColor: "rgba(229, 53, 16, 0.04)",
            },
          }}
        >
          Ongoing Assignments
        </Button>
      </Box>

      <div className=" flex justify-between w-full">
        {/* Physical Design Section */}
      <Typography variant="h6" sx={{ fontWeight: 500, color: "#424242", mb: 1 }}>
        Physical Design
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: 500, color: "#424242", mb: 1 }}>
      Total Modules 5
      </Typography>
      </div>

      {/* Progress Section */}
      <Box sx={{ mb: 8, mt: 6 }}>
        {/* Module Completed Card - Positioned ABOVE the progress bar */}
        <Paper
          elevation={1}
          sx={{
            position: "absolute",
            top: 55, // Move up above the progress bar
            left: "60%",
            transform: "translateX(-50%)",
            p: 1.5,
            textAlign: "center",
            borderRadius: 2,
            zIndex: 1,
            mb: 2,
          }}
        >
          <Typography variant="body2" color="textSecondary">
            Module
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Completed
          </Typography>
          <Typography variant="h6" sx={{ color: "#E53510", fontWeight: 500 }}>
            <div className=" rounded-md mt-1 bg-[#E53510] bg-opacity-10 w-full"> 60%</div>
          </Typography>
        </Paper>

        {/* Progress Bar - Now below the Module Completed card */}
        <StyledLinearProgress variant="determinate" value={60} sx={{ mt: 2 }} />

        {/* Total Modules */}
       
      </Box>

      {/* Module Cards */}
      {/* <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <ModuleCard>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Documenticon color="#FF5722" />
              <Typography variant="body1" sx={{ ml: 2, fontWeight: 500, color: "#424242" }}>
                CMOS Fundamentals (CF)
              </Typography>
            </Box>
            <Circularprogress value={90} />
          </ModuleCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <ModuleCard>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Documenticon color="#FF5722" />
              <Typography variant="body1" sx={{ ml: 2, fontWeight: 500, color: "#424242" }}>
                Scripting Language (SL)
              </Typography>
            </Box>
            <Circularprogress value={90} />
          </ModuleCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <ModuleCard>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Documenticon color="#FF5722" />
              <Typography variant="body1" sx={{ ml: 2, fontWeight: 500, color: "#424242" }}>
                Digital Design Flow (DDF)
              </Typography>
            </Box>
            <Circularprogress value={90} />
          </ModuleCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <ModuleCard>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Documenticon color="#FF5722" />
              <Typography variant="body1" sx={{ ml: 2, fontWeight: 500, color: "#424242" }}>
                SSTA
              </Typography>
            </Box>
            <Circularprogress value={0} />
          </ModuleCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <ModuleCard>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Documenticon color="#FF5722" />
              <Typography variant="body1" sx={{ ml: 2, fontWeight: 500, color: "#424242" }}>
                PNR
              </Typography>
            </Box>
            <Circularprogress value={0} />
          </ModuleCard>
        </Grid>
      </Grid> */}



<div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-5">
      {[
        { title: "CMOS Fundamentals (CF)", progress: 90 },
        { title: "Scripting Language (SL)", progress: 90 },
        { title: "Digital Design Flow (DDF)", progress: 90 },
        { title: "SSTA", progress: 0 },
        { title: "PNR", progress: 0 },
      ].map((module, index) => (
        <div key={index} className="flex bg-[#F5F5F5] rounded-lg shadow-sm w-full relative p-3">
          {/* Icon Section - Positioned to touch left edge */}
          <div className="absolute -left-3 top-1/2 transform -translate-y-1/2 bg-white border-[#E53510] border-l-2 rounded-full w-12 h-12 flex items-center justify-center">
            <FileText color="black" size={20} />
          </div>

          {/* Content Section */}
          <div className="flex flex-1 pl-12 justify-between items-center">
            <span className="text-gray-800 font-medium">{module.title}</span>
            <Circularprogress value={module.progress} />
          </div>
        </div>
      ))}
    </div>
    </Box>
  )
}

