import React from 'react'
import { Stack } from "@mui/material"
import { Test } from "mocha"
import { TestResult } from "../TestResult"

interface IProps {
  tests: Test[]
}

export const TestResults = ({ tests }: IProps) => {
  return (
    <Stack gap={2}>
      {tests.map((test, index) => (
        <TestResult key={index} test={test}/>
      ))}
    </Stack>
  )
}