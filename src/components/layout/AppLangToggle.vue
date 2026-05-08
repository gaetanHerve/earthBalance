<template>
  <AppTooltip :text="locale === 'fr' ? t('lang.switch_to_en') : t('lang.switch_to_fr')" position="bottom">
    <button
      class="text-xs font-mono px-2 py-1 rounded border border-slate-600 text-slate-400 hover:text-white hover:border-slate-400 transition-colors focus-visible:ring-2 focus-visible:ring-eb-cyan"
      :aria-label="locale === 'fr' ? t('lang.switch_to_en') : t('lang.switch_to_fr')"
      @click="toggle"
    >
      {{ locale === 'fr' ? 'EN' : 'FR' }}
    </button>
  </AppTooltip>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { Locale } from '@/i18n/index'
import AppTooltip from '@/components/layout/AppTooltip.vue'

const { locale, t } = useI18n()

function toggle() {
  const next: Locale = locale.value === 'fr' ? 'en' : 'fr'
  locale.value = next
  localStorage.setItem('eb-locale', next)
}
</script>
