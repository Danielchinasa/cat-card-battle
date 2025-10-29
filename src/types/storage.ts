import type { CatCard } from './game'

export interface GameProgress {
  // UI state tracking
  hasSeenInstructions: boolean
  hasCompletedTutorial: boolean
  currentScreen: 'instructions' | 'pack-selection' | 'tutorial' | 'battle'

  // Pack and cards data
  hasOpenedFirstPack: boolean
  selectedPackId: number | null
  userCollection: CatCard[]

  // Additional game flags for future features
  totalPacksOpened: number
  lastPlayedAt: string // ISO timestamp
}

export interface StorageState {
  gameProgress: GameProgress
  version: string // For future migration handling
}

// Default game state
export const defaultGameProgress: GameProgress = {
  hasSeenInstructions: false,
  hasCompletedTutorial: false,
  currentScreen: 'instructions',
  hasOpenedFirstPack: false,
  selectedPackId: null,
  userCollection: [],
  totalPacksOpened: 0,
  lastPlayedAt: new Date().toISOString(),
}

export const defaultStorageState: StorageState = {
  gameProgress: defaultGameProgress,
  version: '1.0.0',
}
