import { useRef, useState } from "react"

export const useTimer = () => {
  const [timer, setTimer] = useState(0)
  const countRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const start = () => {
    countRef.current = setInterval(() => {
      setTimer((currentTimer) => currentTimer + 1)
    }, 1)
  }

  const stop = () => {
    clearInterval(countRef.current as any)
  }

  const reset = () => {
    clearInterval(countRef.current as any)
    setTimer(0)
  }

  return {
    timer,
    start,
    stop,
    reset
  }
}