import { Box, CircularProgress, Typography } from "@mui/material"

export default function CircularProgressWithLabel(props) {
  const { value } = props
  const color = value > 0 ? "#E53510" : "#9e9e9e"

  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress variant="determinate" value={100} size={40} thickness={4} sx={{ color: "#e0e0e0" }} />
      <CircularProgress
        variant="determinate"
        value={value}
        size={40}
        thickness={4}
        sx={{
          color: color,
          position: "absolute",
          left: 0,
        }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="caption" component="div" sx={{ fontWeight: "bold", color: color }}>
          {`${value}%`}
        </Typography>
      </Box>
    </Box>
  )
}

