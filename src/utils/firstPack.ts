import { useGameStore } from '@/stores/gameStore'

export function isFirstPackClaimed(): boolean {
  const gameStore = useGameStore()
  return gameStore.hasOpenedFirstPack
}

export function claimFirstPack(): void {
  const gameStore = useGameStore()
  gameStore.setHasOpenedFirstPack(true)
}
