import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { CatCard } from '@/types/game'
import type { GameProgress } from '@/types/storage'
import { GameStorage, updateGameProgress } from '@/utils/storage'
import { defaultGameProgress } from '@/types/storage'

export const useGameStore = defineStore('game', () => {
  // Load initial state from localStorage
  const initialState = GameStorage.loadState()

  // Reactive state
  const progress = ref<GameProgress>({ ...initialState.gameProgress })

  // Computed getters
  const hasSeenInstructions = computed(() => progress.value.hasSeenInstructions)
  const hasCompletedTutorial = computed(() => progress.value.hasCompletedTutorial)
  const currentScreen = computed(() => progress.value.currentScreen)
  const hasOpenedFirstPack = computed(() => progress.value.hasOpenedFirstPack)
  const selectedPackId = computed(() => progress.value.selectedPackId)
  const userCollection = computed(() => progress.value.userCollection)
  const totalPacksOpened = computed(() => progress.value.totalPacksOpened)
  const lastPlayedAt = computed(() => progress.value.lastPlayedAt)

  // Actions that also persist to localStorage
  function setHasSeenInstructions(seen: boolean) {
    progress.value.hasSeenInstructions = seen
    updateGameProgress({ hasSeenInstructions: seen })
  }

  function setHasCompletedTutorial(completed: boolean) {
    progress.value.hasCompletedTutorial = completed
    updateGameProgress({ hasCompletedTutorial: completed })
  }

  function setCurrentScreen(screen: GameProgress['currentScreen']) {
    progress.value.currentScreen = screen
    updateGameProgress({ currentScreen: screen })
  }

  function setHasOpenedFirstPack(opened: boolean) {
    progress.value.hasOpenedFirstPack = opened
    updateGameProgress({ hasOpenedFirstPack: opened })
  }

  function setSelectedPackId(packId: number | null) {
    progress.value.selectedPackId = packId
    updateGameProgress({ selectedPackId: packId })
  }

  function addCardsToCollection(cards: CatCard[]) {
    // Add new cards to collection (avoiding duplicates by id)
    const existingIds = new Set(progress.value.userCollection.map((card) => card.id))
    const newCards = cards.filter((card) => !existingIds.has(card.id))

    progress.value.userCollection = [...progress.value.userCollection, ...newCards]
    progress.value.totalPacksOpened += 1

    updateGameProgress({
      userCollection: progress.value.userCollection,
      totalPacksOpened: progress.value.totalPacksOpened,
    })
  }

  function clearCollection() {
    progress.value.userCollection = []
    updateGameProgress({ userCollection: [] })
  }

  function resetProgress() {
    progress.value = { ...defaultGameProgress }
    GameStorage.clearState()
  }

  // Load fresh state from localStorage (useful for debugging or manual refresh)
  function refreshFromStorage() {
    const freshState = GameStorage.loadState()
    progress.value = { ...freshState.gameProgress }
  }

  // Helper to check if user has cards in collection
  const hasAnyCards = computed(() => progress.value.userCollection.length > 0)

  // Helper to get cards by rarity
  function getCardsByRarity(rarity: CatCard['rarity']) {
    return progress.value.userCollection.filter((card) => card.rarity === rarity)
  }

  return {
    // State
    progress: computed(() => progress.value),

    // Getters
    hasSeenInstructions,
    hasCompletedTutorial,
    currentScreen,
    hasOpenedFirstPack,
    selectedPackId,
    userCollection,
    totalPacksOpened,
    lastPlayedAt,
    hasAnyCards,

    // Actions
    setHasSeenInstructions,
    setHasCompletedTutorial,
    setCurrentScreen,
    setHasOpenedFirstPack,
    setSelectedPackId,
    addCardsToCollection,
    clearCollection,
    resetProgress,
    refreshFromStorage,
    getCardsByRarity,
  }
})
