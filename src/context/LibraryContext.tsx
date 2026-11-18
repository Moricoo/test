import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

const FAVORITES_KEY = 'miniplay:favorites'
const RECENT_KEY = 'miniplay:recent'
const BEST_KEY = 'miniplay:best'

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    const parsed: unknown = JSON.parse(raw)
    return parsed as T
  } catch {
    return fallback
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage can be unavailable (private mode, quota). The in-memory state
    // still works for the current session.
  }
}

export interface RecentPlay {
  id: string
  at: number
}

export interface LibraryValue {
  favorites: string[]
  isFavorite: (id: string) => boolean
  toggleFavorite: (id: string) => void
  recent: RecentPlay[]
  markPlayed: (id: string) => void
  best: Record<string, number>
  recordScore: (id: string, score: number) => void
}

const LibraryContext = createContext<LibraryValue | null>(null)

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(() =>
    readJson<string[]>(FAVORITES_KEY, []),
  )
  const [recent, setRecent] = useState<RecentPlay[]>(() =>
    readJson<RecentPlay[]>(RECENT_KEY, []),
  )
  const [best, setBest] = useState<Record<string, number>>(() =>
    readJson<Record<string, number>>(BEST_KEY, {}),
  )

  useEffect(() => writeJson(FAVORITES_KEY, favorites), [favorites])
  useEffect(() => writeJson(RECENT_KEY, recent), [recent])
  useEffect(() => writeJson(BEST_KEY, best), [best])

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((current) =>
      current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id],
    )
  }, [])

  const markPlayed = useCallback((id: string) => {
    setRecent((current) => [
      { id, at: Date.now() },
      ...current.filter((entry) => entry.id !== id),
    ].slice(0, 6))
  }, [])

  const recordScore = useCallback((id: string, score: number) => {
    setBest((current) => {
      const previous = current[id] ?? 0
      if (score <= previous) return current
      return { ...current, [id]: score }
    })
  }, [])

  const value = useMemo<LibraryValue>(
    () => ({
      favorites,
      isFavorite: (id) => favorites.includes(id),
      toggleFavorite,
      recent,
      markPlayed,
      best,
      recordScore,
    }),
    [best, favorites, markPlayed, recent, recordScore, toggleFavorite],
  )

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
}

export function useLibrary(): LibraryValue {
  const value = useContext(LibraryContext)
  if (!value) throw new Error('useLibrary must be used inside LibraryProvider')
  return value
}
