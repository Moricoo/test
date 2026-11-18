import { describe, expect, it } from 'vitest'
import {
  CATEGORIES,
  FEATURED_GAME_ID,
  GAMES,
  gamesInCategory,
  gamesMatching,
  getGame,
} from './catalog'

describe('catalog', () => {
  it('has unique game ids and a valid featured game', () => {
    const ids = GAMES.map((game) => game.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(getGame(FEATURED_GAME_ID)).toBeDefined()
  })

  it('gives every launch game an existing category and complete store metadata', () => {
    const slugs = new Set(CATEGORIES.map((category) => category.slug))
    for (const game of GAMES) {
      expect(game.categories.length).toBeGreaterThan(0)
      for (const slug of game.categories) expect(slugs.has(slug)).toBe(true)
      expect(game.description.length).toBeGreaterThan(0)
      expect(game.features.length).toBeGreaterThan(0)
      expect(game.controls.length).toBeGreaterThan(0)
      expect(game.rating).toBeGreaterThanOrEqual(0)
      expect(game.rating).toBeLessThanOrEqual(5)
      const total = game.ratings.reduce((sum, row) => sum + row.percent, 0)
      expect(total).toBe(100)
    }
  })

  it('has at least one launch game in every category', () => {
    for (const category of CATEGORIES) {
      expect(gamesInCategory(category.slug).length).toBeGreaterThan(0)
    }
  })

  it('searches names, tags, categories and developers', () => {
    expect(gamesMatching('2048').map((game) => game.id)).toContain('2048')
    expect(gamesMatching('贪吃蛇').map((game) => game.id)).toContain('snake')
    expect(gamesMatching('益智').map((game) => game.id)).toContain('2048')
    expect(gamesMatching('小玩工作室')).toHaveLength(GAMES.length)
    expect(gamesMatching('不存在的游戏')).toHaveLength(0)
  })
})
