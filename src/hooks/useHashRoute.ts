import { useCallback, useEffect, useState, type PointerEvent as ReactPointerEvent } from 'react'

export function readHash(): string {
  const raw = window.location.hash.replace(/^#/, '')
  if (!raw) return '/'
  return raw.startsWith('/') ? raw : `/${raw}`
}

export interface Route {
  /** Path without the query string, always starting with a slash. */
  path: string
  query: URLSearchParams
}

function parse(hash: string): Route {
  const [path, queryString = ''] = hash.split('?')
  return {
    path: path || '/',
    query: new URLSearchParams(queryString),
  }
}

export function useRoute(): Route {
  const [hash, setHash] = useState(() =>
    typeof window === 'undefined' ? '/' : readHash(),
  )

  useEffect(() => {
    const onChange = () => setHash(readHash())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return parse(hash)
}

export function navigate(to: string): void {
  const next = to.startsWith('/') ? to : `/${to}`
  if (readHash() === next) {
    window.dispatchEvent(new HashChangeEvent('hashchange'))
    return
  }
  window.location.hash = next
}

export function href(to: string): string {
  return `#${to.startsWith('/') ? to : `/${to}`}`
}

/** Resets scroll on navigation, mirroring an app's page transition. */
export function useScrollReset(dependency: string): void {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [dependency])
}

/** Direction helper shared by the 2048 and Snake boards. */
export type Direction = 'up' | 'down' | 'left' | 'right'

export function useSwipe(
  onSwipe: (direction: Direction) => void,
  enabled = true,
): {
  onPointerDown: (event: ReactPointerEvent) => void
  onPointerUp: (event: ReactPointerEvent) => void
  onPointerCancel: () => void
} {
  const [start, setStart] = useState<{ x: number; y: number } | null>(null)
  const threshold = 24

  const onPointerDown = useCallback(
    (event: ReactPointerEvent) => {
      if (!enabled) return
      setStart({ x: event.clientX, y: event.clientY })
    },
    [enabled],
  )

  const onPointerUp = useCallback(
    (event: ReactPointerEvent) => {
      if (!enabled || !start) return
      const dx = event.clientX - start.x
      const dy = event.clientY - start.y
      setStart(null)
      if (Math.max(Math.abs(dx), Math.abs(dy)) < threshold) return
      if (Math.abs(dx) > Math.abs(dy)) {
        onSwipe(dx > 0 ? 'right' : 'left')
      } else {
        onSwipe(dy > 0 ? 'down' : 'up')
      }
    },
    [enabled, onSwipe, start],
  )

  return {
    onPointerDown,
    onPointerUp,
    onPointerCancel: () => setStart(null),
  }
}
