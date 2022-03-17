import React from "react";
import { CircularProgress, Typography } from "@mui/material"
import { Box } from "@mui/system"

interface IProps {
  stats: any
}

export const TestSummary = ({ stats }: IProps) => {
  const { passes = 0, failures = 0, tests = 1, duration } = stats
  const completion = ((passes + failures) / tests) * 100

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        alignItems: 'center',
      }}
    > 
      <Typography>Passed: {passes}</Typography>
      <Typography>Failed: {failures}</Typography>
      <Typography>Duration: {duration}</Typography>
      <Box
        sx={{
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <CircularProgress
          variant="determinate"
          value={completion}
          sx={{
            gridColumn: 1,
            gridRow: 1,
          }}
        />
        <Typography
          sx={{
            gridColumn: 1,
            gridRow: 1,
            fontSize: 10,
            fontWeight: 'bold',
          }}
        >
          {completion}%
        </Typography>
      </Box>
    </Box>
  )
}