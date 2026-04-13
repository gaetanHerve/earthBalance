<template>
  <div class="bg-eb-deep border-t border-b border-eb-border py-1 flex items-center gap-2">

    <!-- Bouton pause/lecture (RGAA 13.8) -->
    <button
      class="relative z-10 shrink-0 w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-200 transition-colors focus-visible:ring-2 focus-visible:ring-eb-cyan rounded outline-none ml-2"
      :aria-pressed="paused"
      :aria-label="paused ? 'Reprendre le défilement des indicateurs' : 'Mettre en pause le défilement des indicateurs'"
      @click="paused = !paused"
    >
      <i :class="['fa', paused ? 'fa-play' : 'fa-pause', 'text-xs']" aria-hidden="true"></i>
    </button>

    <!-- Conteneur de clip : fixe, overflow-hidden, flex-1 -->
    <div
      class="relative flex-1 overflow-hidden"
      role="marquee"
      aria-label="Indicateurs planétaires en temps réel"
      :aria-live="paused ? 'polite' : 'off'"
    >
      <!-- Contenu animé : c'est lui qui translate, pas le clipper -->
      <div
        class="ticker-inner flex whitespace-nowrap gap-12 px-4 text-xs text-slate-500"
        :class="{ 'ticker-paused': paused }"
      >
        <template v-for="pass in 2" :key="pass">
          <span
            v-for="(item, i) in items"
            :key="`${pass}-${i}`"
            class="shrink-0"
          >
            {{ item.emoji }}
            {{ item.label }} :
            <span class="font-bold" :class="item.colorClass">{{ item.value }}</span>
          </span>
        </template>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useDashboardStore } from '@/store/dashboard.store'

const store = useDashboardStore()
const { tickerItems: items } = storeToRefs(store)

const paused = ref(true)
</script>

<style scoped>
.ticker-inner {
  animation: ticker 30s linear infinite;
}
.ticker-inner.ticker-paused {
  animation-play-state: paused;
}
</style>
