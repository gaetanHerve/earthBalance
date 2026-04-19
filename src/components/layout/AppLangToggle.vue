<template>
  <button
    class="text-xs font-mono px-2 py-1 rounded border border-slate-600 text-slate-400 hover:text-white hover:border-slate-400 transition-colors focus-visible:ring-2 focus-visible:ring-eb-cyan"
    :aria-label="`Switch to ${locale === 'fr' ? 'English' : 'Français'}`"
    @click="toggle"
  >
    {{ locale === 'fr' ? 'EN' : 'FR' }}
  </button>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { Locale } from '@/i18n/index'

const { locale } = useI18n()

function toggle() {
  const next: Locale = locale.value === 'fr' ? 'en' : 'fr'
  locale.value = next
  localStorage.setItem('eb-locale', next)
}
</script>
