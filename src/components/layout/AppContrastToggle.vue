<template>
  <button
    class="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border transition-all focus-visible:ring-2 focus-visible:ring-eb-cyan outline-none"
    :class="highContrast
      ? 'border-eb-cyan text-eb-cyan bg-eb-cyan/10'
      : 'border-eb-border text-slate-400 hover:border-eb-cyan/50 hover:text-slate-200'"
    :aria-pressed="highContrast"
    :aria-label="highContrast ? 'Désactiver le mode fort contraste' : 'Activer le mode fort contraste'"
    @click="toggle"
  >
    <i class="fa fa-circle-half-stroke" aria-hidden="true"></i>
    <span>Contraste</span>
  </button>
</template>

<script setup lang="ts">
import { useContrastMode } from '@/composables/useContrastMode'

const { highContrast, toggle } = useContrastMode()
</script>
