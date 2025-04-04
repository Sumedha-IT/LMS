"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Box, Card, Typography, IconButton, Avatar, ThemeProvider, createTheme } from "@mui/material"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

// Sample data for students
const students = [
  {
    id: 1,
    name: "Raghav Sharma",
    company: "Tech Mahindra",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    name: "Priya Patel",
    company: "Infosys",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    name: "Amit Kumar",
    company: "TCS",
    image: "/placeholder.svg?height=100&width=100",
  },
]

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#333333",
    },
    secondary: {
      main: "#ff8c00",
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
})

// Create motion components from Material UI components
const MotionBox = motion(Box)
const MotionTypography = motion(Typography)
const MotionAvatar = motion(Avatar)

export default function StudentPlacedCard() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0) // -1 for left, 1 for right

  const handlePrevious = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev === 0 ? students.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev === students.length - 1 ? 0 : prev + 1))
  }

  const currentStudent = students[currentIndex]

  // Variants for animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  }

  const cardVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    }),
  }

  const starVariants = {
    initial: { scale: 0.8, opacity: 0.5 },
    animate: {
      scale: [0.8, 1.2, 0.8],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      },
    },
  }

  return (
    <ThemeProvider theme={theme}>
      <MotionBox
        sx={{
          maxWidth: 320,
          margin: "0 auto",
        }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Card
          sx={{
            bgcolor: "primary.main",
            color: "white",
            padding: 2,
          }}
        >
          <MotionTypography
            variant="h6"
            component="h2"
            align="center"
            sx={{ mb: 2 }}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Student Placed
          </MotionTypography>

          <Card
            sx={{
              bgcolor: "white",
              position: "relative",
              overflow: "hidden",
              p: 2,
            }}
          >
            {/* Navigation buttons */}
            <Box sx={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", zIndex: 10 }}>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <IconButton
                  size="small"
                  onClick={handlePrevious}
                  sx={{
                    bgcolor: "rgba(0,0,0,0.1)",
                    "&:hover": { bgcolor: "rgba(0,0,0,0.2)" },
                  }}
                >
                  <ChevronLeft size={18} />
                </IconButton>
              </motion.div>
            </Box>

            <Box sx={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", zIndex: 10 }}>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <IconButton
                  size="small"
                  onClick={handleNext}
                  sx={{
                    bgcolor: "rgba(0,0,0,0.1)",
                    "&:hover": { bgcolor: "rgba(0,0,0,0.2)" },
                  }}
                >
                  <ChevronRight size={18} />
                </IconButton>
              </motion.div>
            </Box>

            <AnimatePresence mode="wait" custom={direction}>
              <MotionBox
                key={currentIndex}
                custom={direction}
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                sx={{ width: "100%", textAlign: "center" }}
              >
                {/* Stars animation */}
                <Box sx={{ height: 96, width: 96, mx: "auto", mb: 1 }}>
                  <MotionBox
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: "45%",
                      transform: "translate(-50%, -50%)",
                    }}
                    variants={starVariants}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: 0.1 }}
                  >
                    <Star size={20} fill="#ff8c00" color="#ff8c00" />
                  </MotionBox>

                  <MotionBox
                    sx={{
                      position: "absolute",
                      top: 6,
                      left: "35%",
                      transform: "translateY(-50%)",
                    }}
                    variants={starVariants}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: 0.3 }}
                  >
                    <Star size={16} fill="#ff8c00" color="#ff8c00" />
                  </MotionBox>

                  <MotionBox
                    sx={{
                      position: "absolute",
                      top: 6,
                      right: "35%",
                      transform: "translateY(-50%)",
                    }}
                    variants={starVariants}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: 0.5 }}
                  >
                    <Star size={16} fill="#ff8c00" color="#ff8c00" />
                  </MotionBox>

                  {/* Profile image */}
                  <MotionAvatar
                    src={currentStudent.image}
                    alt={currentStudent.name}
                    sx={{
                      width: 96,
                      height: 96,
                      border: "2px solid #e0e0e0",
                      mx: "auto",
                    }}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                </Box>

                {/* Student details */}
                <MotionTypography
                  variant="subtitle1"
                  component="h3"
                  sx={{ fontWeight: 500, color: "text.primary" }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {currentStudent.name}
                </MotionTypography>

                <MotionTypography
                  variant="body2"
                  color="text.secondary"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {currentStudent.company}
                </MotionTypography>
              </MotionBox>
            </AnimatePresence>
          </Card>
        </Card>
      </MotionBox>
    </ThemeProvider>
  )
}

