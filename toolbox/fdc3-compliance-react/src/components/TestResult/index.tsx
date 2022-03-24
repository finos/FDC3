import React, { memo } from "react"
import { CheckRounded, CloseRounded, PlayArrowRounded } from "@mui/icons-material"
import { Box, Typography } from "@mui/material"
import { Test } from "mocha"

interface IProps {
  test: Test
}

const statusIcons = (): { [key: string]: React.ReactElement } => ({
  running: <PlayArrowRounded color="secondary" fontSize="small"/>,
  passed: <CheckRounded color="success" fontSize="small"/>,
  failed: <CloseRounded color="error" fontSize="small"/>,
})

export const TestResult = memo(({ test }: IProps) => {
  const { parent, title, state, err } = test

  console.log(test)

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        alignItems: 'flex-start',
        gridGap: 2,
      }}
    >
      <Box
        sx={{
          p: 1,
        }}
      > 
        {state ? (
          statusIcons()[state]
        ) : (
          statusIcons()['running']
        )}
      </Box>
      
      <Box>
        {parent &&
          <Typography
            sx={{
              fontFamily: 'Source Code Pro, monospace',
              fontSize: 12,
              fontWeight: 'bold',
              color: '#5b606f',
              lineHeight: 1.2,
            }}
          >
            {parent.title}
          </Typography>
        }

        <Typography
          sx={{
            lineHeight: 1.2,
          }}
        >
          {title}
        </Typography>
      </Box>

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
})

TestResult.displayName = 'TestResult';