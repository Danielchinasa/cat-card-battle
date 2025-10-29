import type { StorageState, GameProgress } from '@/types/storage'
import { defaultStorageState, defaultGameProgress } from '@/types/storage'

const STORAGE_KEY = 'cat-card-battle-state'

/**
 * Safe localStorage abstraction with TypeScript support
 * Handles errors gracefully and provides type safety
 */
export class GameStorage {
  /**
   * Save game state to localStorage
   * @param state - The complete game state to save
   * @returns boolean indicating success
   */
  static saveState(state: StorageState): boolean {
    try {
      const serializedState = JSON.stringify(state)
      localStorage.setItem(STORAGE_KEY, serializedState)
      return true
    } catch (error) {
      console.warn('❌ Failed to save game state to localStorage:', error)
      return false
    }
  }

  /**
   * Load game state from localStorage
   * @returns The loaded state or default state if load fails
   */
  static loadState(): StorageState {
    try {
      const serializedState = localStorage.getItem(STORAGE_KEY)

      if (!serializedState) {
        return defaultStorageState
      }

      const parsedState = JSON.parse(serializedState) as StorageState

      // Validate the structure and migrate if needed
      const validatedState = this.validateAndMigrateState(parsedState)
      return validatedState
    } catch (error) {
      console.warn('❌ Failed to load game state from localStorage:', error)
      return defaultStorageState
    }
  }

  /**
   * Update only the game progress portion of the state
   * @param progressUpdate - Partial game progress to update
   * @returns boolean indicating success
   */
  static updateGameProgress(progressUpdate: Partial<GameProgress>): boolean {
    try {
      const currentState = this.loadState()
      const updatedState: StorageState = {
        ...currentState,
        gameProgress: {
          ...currentState.gameProgress,
          ...progressUpdate,
          lastPlayedAt: new Date().toISOString(),
        },
      }

      return this.saveState(updatedState)
    } catch (error) {
      console.warn('Failed to update game progress:', error)
      return false
    }
  }

  /**
   * Clear all saved data
   * @returns boolean indicating success
   */
  static clearState(): boolean {
    try {
      localStorage.removeItem(STORAGE_KEY)
      return true
    } catch (error) {
      console.warn('Failed to clear game state:', error)
      return false
    }
  }

  /**
   * Check if localStorage is available
   * @returns boolean indicating availability
   */
  static isStorageAvailable(): boolean {
    try {
      const testKey = '__storage_test__'
      localStorage.setItem(testKey, 'test')
      localStorage.removeItem(testKey)
      return true
    } catch {
      return false
    }
  }

  /**
   * Validate and migrate state structure for backwards compatibility
   * @param state - The state to validate
   * @returns Validated and migrated state
   */
  private static validateAndMigrateState(state: unknown): StorageState {
    // If the state doesn't have the expected structure, return default
    if (!state || typeof state !== 'object') {
      return defaultStorageState
    }

    const stateObj = state as Record<string, unknown>

    // Check if we have the basic structure
    if (!stateObj.gameProgress || typeof stateObj.gameProgress !== 'object') {
      return defaultStorageState
    }

    // Ensure all required fields exist with proper defaults
    const migratedProgress: GameProgress = {
      ...defaultGameProgress,
      ...(stateObj.gameProgress as Record<string, unknown>),
    }

    // Validate userCollection is an array
    if (!Array.isArray(migratedProgress.userCollection)) {
      migratedProgress.userCollection = []
    }

    // Validate enums and primitive types
    if (
      !['instructions', 'pack-selection', 'tutorial', 'battle'].includes(
        migratedProgress.currentScreen,
      )
    ) {
      migratedProgress.currentScreen = 'instructions'
    }

    return {
      gameProgress: migratedProgress,
      version: (stateObj.version as string) || '1.0.0',
    }
  }
}

// Convenience functions for easier usage
export const saveGameState = GameStorage.saveState
export const loadGameState = GameStorage.loadState
export const updateGameProgress = GameStorage.updateGameProgress
export const clearGameState = GameStorage.clearState
export const isStorageAvailable = GameStorage.isStorageAvailable
