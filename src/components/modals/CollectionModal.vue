<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import type { Rarity } from '@/types/game'
import CatCardItem from '@/components/game/CatCardItem.vue'

const emit = defineEmits<{
  close: []
}>()

const gameStore = useGameStore()

const rarityOrder: Rarity[] = ['legendary', 'epic', 'rare', 'uncommon', 'common']
const rarityColors = {
  legendary: 'text-yellow-400',
  epic: 'text-purple-400',
  rare: 'text-blue-400',
  uncommon: 'text-green-400',
  common: 'text-gray-400',
}

// Organize cards by rarity for better display
const cardsByRarity = computed(() => {
  const grouped = rarityOrder.reduce(
    (acc, rarity) => {
      acc[rarity] = gameStore.getCardsByRarity(rarity)
      return acc
    },
    {} as Record<Rarity, typeof gameStore.userCollection>,
  )

  return grouped
})

const totalCards = computed(() => gameStore.userCollection.length)

const handleClose = () => {
  emit('close')
}

const resetProgress = () => {
  if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
    gameStore.resetProgress()
    emit('close')
  }
}
</script>

<template>
  <div
    class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    @click.self="handleClose"
  >
    <div
      class="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] p-6 overflow-y-auto"
    >
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-4xl font-bold text-purple-900 mb-2">My Collection</h2>
          <p class="text-purple-700">
            {{ totalCards }} cards collected | {{ gameStore.totalPacksOpened }} packs opened
          </p>
        </div>

        <div class="flex gap-2">
          <button
            @click="resetProgress"
            class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
          >
            Reset Progress
          </button>
          <button
            @click="handleClose"
            class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      <!-- Collection Display -->
      <div v-if="totalCards === 0" class="text-center py-12">
        <div class="text-6xl mb-4">😿</div>
        <h3 class="text-2xl font-bold text-gray-600 mb-2">No cards yet!</h3>
        <p class="text-gray-500">Open some card packs to start your collection.</p>
      </div>

      <div v-else class="space-y-8">
        <!-- Cards grouped by rarity -->
        <div v-for="rarity in rarityOrder" :key="rarity" v-show="cardsByRarity[rarity].length > 0">
          <h3
            :class="[
              'text-2xl font-bold mb-4 capitalize flex items-center gap-2',
              rarityColors[rarity],
            ]"
          >
            {{ rarity }}
            <span class="text-lg text-gray-600">({{ cardsByRarity[rarity].length }})</span>
          </h3>

          <div
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          >
            <div
              v-for="card in cardsByRarity[rarity]"
              :key="`${card.id}-${card.name}`"
              class="w-full max-w-[240px] mx-auto"
            >
              <CatCardItem :card="card" />
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Summary -->
      <div v-if="totalCards > 0" class="mt-8 bg-white/50 rounded-lg p-4">
        <h4 class="text-lg font-bold text-purple-900 mb-3">Collection Stats</h4>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
          <div
            v-for="rarity in rarityOrder"
            :key="`stat-${rarity}`"
            :class="['p-2 rounded-lg bg-white/50', rarityColors[rarity]]"
          >
            <div class="text-2xl font-bold">{{ cardsByRarity[rarity].length }}</div>
            <div class="text-sm capitalize">{{ rarity }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar for the modal */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(147, 51, 234, 0.5);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(147, 51, 234, 0.7);
}
</style>
