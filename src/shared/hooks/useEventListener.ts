import type { RefObject} from 'react';
import { useEffect, useRef } from 'react'

export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element?: RefObject<HTMLElement> | null,
  options?: boolean | AddEventListenerOptions
): void {
  const savedHandler = useRef(handler)

  useEffect(() => {
    savedHandler.current = handler
  }, [handler])

  useEffect(() => {
    const targetElement = element?.current ?? window

    if (!targetElement?.addEventListener) {
      return
    }

    const eventListener = (event: Event) => {
      savedHandler.current(event as WindowEventMap[K])
    }

    targetElement.addEventListener(eventName, eventListener, options)

    return () => {
      targetElement.removeEventListener(eventName, eventListener, options)
    }
  }, [eventName, element, options])
}
