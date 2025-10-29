<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCards } from '@/composables/cards'
import { useGameStore } from '@/stores/gameStore'
import type { CatCard } from '@/types/game'
import CatCardItem from '@/components/game/CatCardItem.vue'
import CollectionModal from '@/components/modals/CollectionModal.vue'
import deckImage from '@/assets/images/game/deck.png'
import ogreMinion from '@/assets/images/enemies/ogre_minion.png'

const { cards } = useCards()
const gameStore = useGameStore()
const showHand = ref(false)
const showCollection = ref(false)

// Player's hand and battlefield
const playerHand = ref(cards.value.slice(0, 5))
const playerField = ref<(CatCard | null)[]>([null, null, null])

const playCard = (card: CatCard) => {
  // Find first available slot
  const emptySlotIndex = playerField.value.findIndex((slot) => slot === null)

  if (emptySlotIndex !== -1) {
    // Place card in slot
    playerField.value[emptySlotIndex] = card

    // Remove card from hand
    const handIndex = playerHand.value.findIndex((c) => c.id === card.id)
    if (handIndex !== -1) {
      playerHand.value.splice(handIndex, 1)
    }
  }
}

const openCollection = () => {
  showCollection.value = true
}

const closeCollection = () => {
  showCollection.value = false
}

onMounted(() => {
  // Animate cards into hand after a brief delay
  setTimeout(() => {
    showHand.value = true
  }, 500)
})
</script>

<template>
  <div class="w-full h-screen flex flex-col relative overflow-hidden">
    <!-- Battle Arena Background -->
    <div
      class="absolute inset-0 bg-gradient-to-b from-purple-900 via-slate-800 to-green-900 opacity-40"
    ></div>

    <!-- Opponent Area (Top) -->
    <div class="flex-1 flex items-center justify-center relative z-10">
      <div class="text-center">
        <!-- Enemy Image -->
        <img
          :src="ogreMinion"
          alt="Enemy"
          class="w-64 h-64 object-contain drop-shadow-2xl animate-float"
        />

        <!-- Enemy Health Bar -->
        <div class="mt-4 w-64 mx-auto">
          <div class="bg-gray-800 rounded-full h-6 overflow-hidden border-2 border-gray-600">
            <div
              class="bg-gradient-to-r from-red-500 to-red-600 h-full w-full transition-all"
            ></div>
          </div>
          <p class="text-white text-xl font-bold mt-2">Ogre Minion</p>
          <p class="text-red-400 font-semibold">HP: 100/100</p>
        </div>
      </div>
    </div>

    <!-- Card Placeholders (Middle) -->
    <div class="relative z-10 flex justify-center py-8">
      <!-- Player Card Slots -->
      <div class="flex gap-4">
        <div
          v-for="(card, index) in playerField"
          :key="`player-slot-${index}`"
          class="w-24 h-32 border-2 border-dashed border-blue-400/50 rounded-lg bg-blue-900/20 flex items-center justify-center relative overflow-hidden"
        >
          <div v-if="card" class="w-[264px] h-[352px] scale-[0.34] origin-center">
            <CatCardItem :card="card" />
          </div>
        </div>
      </div>
    </div>

    <!-- Player Area (Bottom) -->
    <div class="relative z-10 pb-8">
      <!-- Player's Hand -->
      <div class="flex justify-center gap-1 px-4 mb-4">
        <TransitionGroup name="hand-card">
          <div
            v-for="(card, index) in playerHand"
            v-show="showHand"
            :key="card.id"
            class="hover:-translate-y-8 transition-transform duration-300 cursor-pointer w-[211px] scale-[0.8]"
            :style="{ transitionDelay: `${index * 100}ms` }"
            @click="playCard(card)"
          >
            <CatCardItem :card="card" />
          </div>
        </TransitionGroup>
      </div>

      <!-- Deck in Bottom Right -->
      <div class="absolute bottom-4 right-8">
        <img
          :src="deckImage"
          alt="Deck"
          class="w-32 h-44 object-contain drop-shadow-xl cursor-pointer hover:scale-105 transition-transform"
        />
        <div
          class="absolute -top-2 -right-2 bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold border-2 border-white"
        >
          0
        </div>
      </div>

      <!-- Collection Button in Bottom Left -->
      <div class="absolute bottom-4 left-8">
        <button
          @click="openCollection"
          class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-6 py-3 rounded-full shadow-lg transform transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          📚 My Collection
          <span class="bg-white/20 rounded-full px-2 py-1 text-sm">{{
            gameStore.userCollection.length
          }}</span>
        </button>
      </div>
    </div>

    <!-- Collection Modal -->
    <CollectionModal v-if="showCollection" @close="closeCollection" />
  </div>
</template>

<style scoped>
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-20px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.hand-card-enter-active {
  transition: all 0.6s ease;
}

.hand-card-enter-from {
  opacity: 0;
  transform: translateY(100px) rotate(10deg);
}

.hand-card-enter-to {
  opacity: 1;
  transform: translateY(0) rotate(0deg);
}
</style>
