import React, { useEffect } from "react";
import { CircularProgress, Typography } from "@mui/material"
import { Box } from "@mui/system"
import { Stats } from "mocha";
import { useTimer } from "../../hooks/useTimer";
import { TestsStatus } from "../AgentTests";

interface IProps {
  status: TestsStatus
  passes: number
  failures: number
  total: number
  stats: Stats | null
}

export const TestSummary = ({ status, passes, failures, total, stats }: IProps) => {
  const completion = Math.floor(((passes + failures) / total) * 100)
  const { timer, start, stop, reset } = useTimer()

  useEffect(() => {
    if (status === 'running') {
      reset()
      start()
    }
    if (status === 'idle') {
      stop()
    }
  }, [status])

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
      <Typography>Duration: {stats ? stats.duration : timer}ms</Typography>
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
          classes={{
            circle: "transition: 'none';"
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