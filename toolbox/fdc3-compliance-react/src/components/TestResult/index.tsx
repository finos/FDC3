import React from "react"
import { CheckRounded, CloseRounded, PlayArrowRounded } from "@mui/icons-material"
import { Box, Typography } from "@mui/material"

interface IProps {
  test: ITest
}

interface ITest {
  title: string
  state: string
  error: string
  [key: string]: any
}

const statusIcons = (): { [key: string]: React.ReactElement } => ({
  running: <PlayArrowRounded color="secondary" fontSize="small"/>,
  passed: <CheckRounded color="success" fontSize="small"/>,
  failed: <CloseRounded color="error" fontSize="small"/>,
})

export const TestResult = ({ test }: IProps) => {
  const { title, state, err } = test

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        alignItems: 'center',
        gridGap: 2,
      }}
    >
      <Box
        sx={{
          p: 1,
        }}
      >
        {statusIcons()[state]}
      </Box>

      <Typography
        sx={{
          lineHeight: 1.2,
        }}
      >
        {title}
      </Typography>

      {err && (
        <Box
          sx={{
            py: 1,
            px: 2,
            border: 2,
            borderColor: 'error.main',
            borderRadius: 2,
            gridColumn: 2,
          }}
        >
          <Typography
            sx={{
              color: 'error.main',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              fontSize: 12,
            }}
          >{err.message}</Typography>
        </Box>
      )}
    </Box>
  )
}