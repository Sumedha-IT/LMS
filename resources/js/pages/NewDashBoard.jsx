// "use client"

import CircularProgress from "../components/DashBoard/CircularProgress";

// import { useState } from "react"
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   Grid,
//   TextField,
//   Button,
//   MenuItem,
//   Tab,
//   Tabs,
//   LinearProgress,
//   CircularProgress,
// } from "@mui/material"
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
// import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers"
// import { BarChart } from "@mui/x-charts/BarChart"
// import { Person } from "@mui/icons-material"

// // Mock data for the charts
// const subjects = [
//   "Physics",
//   "Maths",
//   "Chemistry",
//   "Physics",
//   "Maths",
//   "Chemistry",
//   "Physics",
//   "Physics",
//   "Physics",
//   "Physics",
//   "Physics",
//   "Physics",
// ]
// const minimumMarks = [60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60]
// const obtainedMarks = [20, 40, 35, 22, 25, 50, 35, 20, 40, 25, 40, 55]

// const courses = ["Physics", "Mathematics", "Chemistry", "Biology"]
// const batches = ["Morning", "Afternoon", "Evening", "Weekend"]

// const NewDashBoard = () => {
//   const [course, setCourse] = useState("")
//   const [batch, setBatch] = useState("")
//   const [startDate, setStartDate] = useState(null)
//   const [endDate, setEndDate] = useState(null)
//   const [tabValue, setTabValue] = useState(0)

//   const handleTabChange = (event, newValue) => {
//     setTabValue(newValue)
//   }

//   return (
//     <Box className="p-4 bg-gray-50">
//       <Card
//         className="mb-4"
//         sx={{
//           backgroundColor: "#404040",
//           color: "white",
//           borderRadius: "8px",
//           position: "relative",
//           overflow: "visible",
//         }}
//       >
//         <CardContent className="flex justify-between items-center">
//           <Box className="flex space-x-8">
//             {/* Progress Indicators */}
//             <Box className="text-center">
//               <Box className="relative inline-block" sx={{ width: 80, height: 80 }}>
//                 <CircularProgress
//                   variant="determinate"
//                   value={100}
//                   size={80}
//                   thickness={4}
//                   sx={{ color: "rgba(255,255,255,0.2)" }}
//                 />
//                 <CircularProgress
//                   variant="determinate"
//                   value={50}
//                   size={80}
//                   thickness={4}
//                   sx={{
//                     color: "#ff4d4d",
//                     position: "absolute",
//                     left: 0,
//                     top: 0,
//                   }}
//                 />
//                 <Box
//                   sx={{
//                     position: "absolute",
//                     top: 0,
//                     left: 0,
//                     bottom: 0,
//                     right: 0,
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                   }}
//                 >
//                   <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
//                     50%
//                   </Typography>
//                 </Box>
//               </Box>
//               <Typography variant="caption" className="mt-1 block">
//                 ATTENDANCE
//               </Typography>
//             </Box>

//             <Box className="text-center">
//               <Box className="relative inline-block" sx={{ width: 80, height: 80 }}>
//                 <CircularProgress
//                   variant="determinate"
//                   value={100}
//                   size={80}
//                   thickness={4}
//                   sx={{ color: "rgba(255,255,255,0.2)" }}
//                 />
//                 <CircularProgress
//                   variant="determinate"
//                   value={80}
//                   size={80}
//                   thickness={4}
//                   sx={{
//                     color: "#ff4d4d",
//                     position: "absolute",
//                     left: 0,
//                     top: 0,
//                   }}
//                 />
//                 <Box
//                   sx={{
//                     position: "absolute",
//                     top: 0,
//                     left: 0,
//                     bottom: 0,
//                     right: 0,
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                   }}
//                 >
//                   <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
//                     80%
//                   </Typography>
//                 </Box>
//               </Box>
//               <Typography variant="caption" className="mt-1 block">
//                 TASKS COMPLETED
//               </Typography>
//             </Box>

//             <Box className="text-center">
//               <Box className="relative inline-block" sx={{ width: 80, height: 80 }}>
//                 <CircularProgress
//                   variant="determinate"
//                   value={100}
//                   size={80}
//                   thickness={4}
//                   sx={{ color: "rgba(255,255,255,0.2)" }}
//                 />
//                 <CircularProgress
//                   variant="determinate"
//                   value={40}
//                   size={80}
//                   thickness={4}
//                   sx={{
//                     color: "#ff4d4d",
//                     position: "absolute",
//                     left: 0,
//                     top: 0,
//                   }}
//                 />
//                 <Box
//                   sx={{
//                     position: "absolute",
//                     top: 0,
//                     left: 0,
//                     bottom: 0,
//                     right: 0,
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                   }}
//                 >
//                   <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
//                     4/10
//                   </Typography>
//                 </Box>
//               </Box>
//               <Typography variant="caption" className="mt-1 block">
//                 ONLINE ASSIGNMENTS
//               </Typography>
//             </Box>

//             <Box className="text-center">
//               <Box className="relative inline-block" sx={{ width: 80, height: 80 }}>
//                 <CircularProgress
//                   variant="determinate"
//                   value={100}
//                   size={80}
//                   thickness={4}
//                   sx={{ color: "rgba(255,255,255,0.2)" }}
//                 />
//                 <CircularProgress
//                   variant="determinate"
//                   value={40}
//                   size={80}
//                   thickness={4}
//                   sx={{
//                     color: "#ff4d4d",
//                     position: "absolute",
//                     left: 0,
//                     top: 0,
//                   }}
//                 />
//                 <Box
//                   sx={{
//                     position: "absolute",
//                     top: 0,
//                     left: 0,
//                     bottom: 0,
//                     right: 0,
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                   }}
//                 >
//                   <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
//                     4/10
//                   </Typography>
//                 </Box>
//               </Box>
//               <Typography variant="caption" className="mt-1 block">
//                 OFFLINE ASSIGNMENTS
//               </Typography>
//             </Box>
//           </Box>

//           {/* Student Avatar */}
//           <Box sx={{ position: "absolute", right: 20, top: -30 }}>
//             <img
//               src=""
//               alt="Student avatar"
//               className="h-32"
//               style={{ objectFit: "contain", objectPosition: "right top" }}
//             />
//           </Box>
//         </CardContent>
//       </Card>

//       {/* Filters */}
//       {/* <Card className="mb-4">
//         <CardContent>
//           <Grid container spacing={2} alignItems="center">
//             <Grid item xs={12} sm={2.5}>
//               <TextField
//                 select
//                 fullWidth
//                 label="Course"
//                 value={course}
//                 onChange={(e) => setCourse(e.target.value)}
//                 size="small"
//               >
//                 {courses.map((option) => (
//                   <MenuItem key={option} value={option}>
//                     {option}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </Grid>
//             <Grid item xs={12} sm={2.5}>
//               <TextField
//                 select
//                 fullWidth
//                 label="Batch"
//                 value={batch}
//                 onChange={(e) => setBatch(e.target.value)}
//                 size="small"
//               >
//                 {batches.map((option) => (
//                   <MenuItem key={option} value={option}>
//                     {option}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </Grid>
//             <Grid item xs={12} sm={2.5}>
//               <LocalizationProvider dateAdapter={AdapterDateFns}>
//                 <DatePicker
//                   label="Start Date"
//                   value={startDate}
//                   onChange={(newValue) => setStartDate(newValue)}
//                   slotProps={{ textField: { size: "small", fullWidth: true } }}
//                 />
//               </LocalizationProvider>
//             </Grid>
//             <Grid item xs={12} sm={2.5}>
//               <LocalizationProvider dateAdapter={AdapterDateFns}>
//                 <DatePicker
//                   label="End Date"
//                   value={endDate}
//                   onChange={(newValue) => setEndDate(newValue)}
//                   slotProps={{ textField: { size: "small", fullWidth: true } }}
//                 />
//               </LocalizationProvider>
//             </Grid>
//             <Grid item xs={12} sm={2}>
//               <Button
//                 variant="contained"
//                 fullWidth
//                 sx={{
//                   backgroundColor: "#ff4d4d",
//                   "&:hover": { backgroundColor: "#ff3333" },
//                   borderRadius: "20px",
//                 }}
//               >
//                 Filter
//               </Button>
//             </Grid>
//           </Grid>
//         </CardContent>
//       </Card> */}

//       {/* Assignments Performance */}
//       {/* <Card className="mb-4">
//         <CardContent>
//           <Typography variant="h6" className="mb-4">
//             Assignments Performance
//           </Typography>
//           <Box sx={{ height: 300 }}>
//             <BarChart
//               series={[
//                 { data: minimumMarks, label: "Minimum Marks", color: "#ffcccc" },
//                 { data: obtainedMarks, label: "Obtained Marks", color: "#ff4d4d" },
//               ]}
//               xAxis={[{ data: subjects, scaleType: "band" }]}
//               height={280}
//             />
//           </Box>
//         </CardContent>
//       </Card> */}

//       {/* Attendance and Announcements */}
//       {/* <Grid container spacing={3} className="mb-4">
//         <Grid item xs={12} md={4}>
//           <Card sx={{ height: "100%" }}>
//             <CardContent>
//               <Box className="flex justify-between items-center mb-4">
//                 <Typography variant="h6">My Attendance</Typography>
//                 <Typography variant="caption" sx={{ color: "#ff4d4d" }}>
//                   View More
//                 </Typography>
//               </Box>
//               <Box className="flex justify-center">
//                 <Box className="relative" sx={{ width: 150, height: 150 }}>
//                   <CircularProgress
//                     variant="determinate"
//                     value={100}
//                     size={150}
//                     thickness={8}
//                     sx={{ color: "rgba(0,0,0,0.1)" }}
//                   />
//                   <CircularProgress
//                     variant="determinate"
//                     value={48}
//                     size={150}
//                     thickness={8}
//                     sx={{
//                       color: "#ff4d4d",
//                       position: "absolute",
//                       left: 0,
//                       top: 0,
//                     }}
//                   />
//                   <Box
//                     sx={{
//                       position: "absolute",
//                       top: 0,
//                       left: 0,
//                       bottom: 0,
//                       right: 0,
//                       display: "flex",
//                       flexDirection: "column",
//                       alignItems: "center",
//                       justifyContent: "center",
//                     }}
//                   >
//                     <Person sx={{ color: "#ff4d4d", fontSize: 24 }} />
//                     <Typography variant="h4" component="div" sx={{ fontWeight: "bold" }}>
//                       120/250
//                     </Typography>
//                     <Typography variant="caption">Attendance</Typography>
//                   </Box>
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} md={8}>
//           <Card sx={{ height: "100%" }}>
//             <CardContent>
//               <Typography variant="h6" className="mb-4">
//                 Upcoming Announcements
//               </Typography>
//               <Box className="overflow-x-auto">
//                 <Box sx={{ minWidth: 600 }}>
//                   <Box className="flex border-b">
//                     <Box className="w-16 p-2 text-center">
//                       <Typography variant="body2" color="textSecondary"></Typography>
//                     </Box>
//                     {["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"].map((time) => (
//                       <Box key={time} className="flex-1 p-2 text-center border-l">
//                         <Typography variant="body2" color="textSecondary">
//                           {time}
//                         </Typography>
//                       </Box>
//                     ))}
//                   </Box>

//                   {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
//                     <Box key={day} className="flex border-b">
//                       <Box className="w-16 p-2 text-center">
//                         <Typography variant="body2">{day}</Typography>
//                       </Box>
//                       {["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"].map(
//                         (time, timeIndex) => (
//                           <Box key={`${day}-${time}`} className="flex-1 p-2 text-center border-l relative">
//                             {index === 2 && timeIndex === 2 && (
//                               <Box
//                                 sx={{
//                                   position: "absolute",
//                                   left: "10%",
//                                   right: "10%",
//                                   top: "50%",
//                                   transform: "translateY(-50%)",
//                                   backgroundColor: "#ff4d4d",
//                                   color: "white",
//                                   borderRadius: "20px",
//                                   padding: "4px 8px",
//                                 }}
//                               >
//                                 <Typography variant="caption">Meeting</Typography>
//                               </Box>
//                             )}
//                             {index === 3 && timeIndex === 5 && (
//                               <Box
//                                 sx={{
//                                   position: "absolute",
//                                   left: "10%",
//                                   right: "10%",
//                                   top: "50%",
//                                   transform: "translateY(-50%)",
//                                   backgroundColor: "#3399ff",
//                                   color: "white",
//                                   borderRadius: "20px",
//                                   padding: "4px 8px",
//                                 }}
//                               >
//                                 <Typography variant="caption">Webinar</Typography>
//                               </Box>
//                             )}
//                           </Box>
//                         ),
//                       )}
//                     </Box>
//                   ))}
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid> */}

//       {/* Student Journey */}
//       {/* <Card>
//         <CardContent>
//           <Typography variant="h6" className="mb-4">
//             Student Journey
//           </Typography>
//           <Tabs
//             value={tabValue}
//             onChange={handleTabChange}
//             className="mb-4"
//             TabIndicatorProps={{ style: { display: "none" } }}
//           >
//             <Tab
//               label="Ongoing Assignments"
//               sx={{
//                 borderRadius: "20px",
//                 border: "1px solid #ddd",
//                 marginRight: "8px",
//                 "&.Mui-selected": {
//                   backgroundColor: "#ff4d4d",
//                   color: "white",
//                   border: "1px solid #ff4d4d",
//                 },
//               }}
//             />
//             <Tab
//               label="Upcoming Assignments"
//               sx={{
//                 borderRadius: "20px",
//                 border: "1px solid #ddd",
//                 "&.Mui-selected": {
//                   backgroundColor: "#ff4d4d",
//                   color: "white",
//                   border: "1px solid #ff4d4d",
//                 },
//               }}
//             />
//           </Tabs>

//           <Box sx={{ mt: 4 }}>
//             <LinearProgress
//               variant="determinate"
//               value={60}
//               sx={{
//                 height: 10,
//                 borderRadius: 5,
//                 backgroundColor: "#ffcccc",
//                 "& .MuiLinearProgress-bar": {
//                   backgroundColor: "#ff4d4d",
//                 },
//               }}
//             />
//             <Box className="flex justify-end mt-2">
//               <Typography variant="body2">Total 8</Typography>
//             </Box>
//           </Box>
//         </CardContent>
//       </Card> */}
//     </Box>
//   )
// }

// export default NewDashBoard





const NewDashBoard = () => {
    return (
       <section className=" min-h-screen w-full p-2">
<div className="  min-h-[15.75rem] bg-[#404040] rounded-2xl flex  items-center px-10  w-full">
<div className=" flex justify-evenly w-[70%]">
    <CircularProgress value={4} max={10} label="Total Assignments" size={157} strokeWidth={12} showPercentage={true} />
    <CircularProgress value={4} max={10} label="Total Assignments" size={157} strokeWidth={12} showPercentage={true} />
    <CircularProgress value={4} max={10} label="Total Assignments" size={157} strokeWidth={12} showPercentage={false} />
    <CircularProgress value={4} max={10} label="Total Assignments" size={157} strokeWidth={12} showPercentage={false}/>
</div>
<div>
    <img src="./public/images/image 67.png" alt="Image"/>
</div>
</div>

       </section>
    );
}

export default NewDashBoard;