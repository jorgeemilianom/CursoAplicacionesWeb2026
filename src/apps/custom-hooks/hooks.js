import { useState, useEffect } from 'react'

export function useCounter(initial = 0) {
  const [count, setCount] = useState(initial)

  const increment = () => setCount(c => c + 1)
  const decrement = () => setCount(c => c - 1)
  const reset     = () => setCount(initial)

  return { count, increment, decrement, reset }
}

export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}

export function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}

export function useFetch(url) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  useEffect(() => {
    if (!url) return
    setLoading(true)
    setError(null)
    setData(null)
    const controller = new AbortController()

    fetch(url, { signal: controller.signal })
      .then(response => {

        if (!response.ok) throw new Error(`Error ${response.status}`)

        return response.json()
      })
      .then(setData)
      .catch(err => {
        setError(err.message)
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [url])

  return { 
    data, 
    loading, 
    error 
  }
}
