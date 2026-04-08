<template>
  <div
    class="ticker-wrap overflow-hidden bg-eb-deep border-t border-b border-eb-border py-1"
    aria-label="Indicateurs planétaires en temps réel"
    role="marquee"
  >
    <div class="ticker-inner flex animate-ticker whitespace-nowrap gap-12 px-4 text-xs text-slate-500">
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
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useDashboardStore } from '@/store/dashboard.store'

const store = useDashboardStore()
const { tickerItems: items } = storeToRefs(store)
</script>
