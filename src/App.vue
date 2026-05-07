<template>
  <div class="min-h-screen bg-eb-dark text-slate-200 font-sans">
    <AppLoadingBar />
    <GameIntroOverlay />
    <TippingPointModal />
    <a
      href="#"
      class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-eb-cyan text-eb-dark px-3 py-1 rounded font-bold z-[100]"
      @click.prevent="skipToMain"
    >
      {{ t('skip_to_content') }}
    </a>
    <AppHeader />
    <AppTicker />
    <router-view />
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import AppHeader        from '@/components/layout/AppHeader.vue'
import AppTicker        from '@/components/layout/AppTicker.vue'
import AppFooter        from '@/components/layout/AppFooter.vue'
import AppLoadingBar      from '@/components/layout/AppLoadingBar.vue'
import GameIntroOverlay  from '@/components/layout/GameIntroOverlay.vue'
import TippingPointModal from '@/components/TippingPointModal.vue'

const { t, locale } = useI18n()

watchEffect(() => {
  document.documentElement.lang = locale.value
})

function skipToMain(): void {
  document.getElementById('main-content')?.focus()
}
</script>
