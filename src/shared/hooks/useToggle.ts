import { useCallback, useState } from 'react'

export function useToggle(initialValue = false): [boolean, () => void, (value?: boolean) => void] {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(() => {
    setValue(prev => !prev)
  }, [])

  const setToggle = useCallback((newValue?: boolean) => {
    if (newValue === undefined) {
      setValue(prev => !prev)
    } else {
      setValue(newValue)
    }
  }, [])

  return [value, toggle, setToggle]
}
