<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import InstructionsModal from '@/components/modals/InstructionsModal.vue'
import PackSelection from '@/components/game/PackSelection.vue'
import TutorialSection from '@/components/game/TutorialSection.vue'
import BattleScene from '@/components/game/BattleScene.vue'

const gameStore = useGameStore()

// Use computed properties based on the store state
const showModal = computed(() => gameStore.currentScreen === 'instructions')
const showPackSelection = computed(() => gameStore.currentScreen === 'pack-selection')
const showTutorial = computed(() => gameStore.currentScreen === 'tutorial')
const showBattle = computed(() => gameStore.currentScreen === 'battle')

// Debug logging
onMounted(() => {
  console.log('🎮 LandingPage mounted, current state:')
  console.log('- hasSeenInstructions:', gameStore.hasSeenInstructions)
  console.log('- currentScreen:', gameStore.currentScreen)
  console.log('- hasAnyCards:', gameStore.hasAnyCards)
  console.log('- hasCompletedTutorial:', gameStore.hasCompletedTutorial)

  // Fix screen logic based on saved state
  if (gameStore.hasCompletedTutorial && gameStore.currentScreen !== 'battle') {
    console.log('🔧 Fixing screen: tutorial completed, should be on battle')
    gameStore.setCurrentScreen('battle')
  }
})

const closeModal = () => {
  gameStore.setHasSeenInstructions(true)
  gameStore.setCurrentScreen('pack-selection')
}

const handleCardsRevealed = () => {
  gameStore.setCurrentScreen('tutorial')
}

const handleTutorialComplete = () => {
  gameStore.setHasCompletedTutorial(true)
  gameStore.setCurrentScreen('battle')
}

const testSave = () => {
  console.log('🧪 Testing manual save...')
  gameStore.setHasSeenInstructions(true)
  gameStore.setCurrentScreen('pack-selection')
}

const checkStorage = () => {
  const raw = localStorage.getItem('cat-card-battle-state')
  console.log('🔍 Raw localStorage:', raw)
  alert('Check console for localStorage data')
}
</script>

<template>
  <div class="min-h-screen relative overflow-hidden">
    <!-- Arena Battle Background -->
    <div class="absolute inset-0 bg-gradient-to-b from-purple-900 via-red-900 to-orange-800">
      <!-- Arena floor effect -->
      <div
        class="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-yellow-900/40 to-transparent"
      ></div>

      <!-- Spotlight effects -->
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-yellow-300/20 rounded-full blur-3xl"></div>
      <div class="absolute top-0 right-1/4 w-96 h-96 bg-red-300/20 rounded-full blur-3xl"></div>

      <!-- Arena elements -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-1/4 left-10 w-32 h-32 border-4 border-white rounded-full"></div>
        <div class="absolute top-1/4 right-10 w-32 h-32 border-4 border-white rounded-full"></div>
        <div class="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-64 h-2 bg-white"></div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-if="!showBattle" class="relative z-10 min-h-screen flex items-center justify-center p-4">
      <!-- Pack Selection -->
      <PackSelection v-if="showPackSelection" @cards-revealed="handleCardsRevealed" />

      <!-- Tutorial Section -->
      <TutorialSection v-if="showTutorial" @complete="handleTutorialComplete" />

      <!-- Instructions Modal -->
      <InstructionsModal :show="showModal" @close="closeModal" />
    </div>

    <!-- Battle Scene (Full Screen) -->
    <BattleScene v-if="showBattle" />
  </div>
</template>

<style scoped></style>
