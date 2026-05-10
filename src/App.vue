<template>
  <div class="min-h-screen bg-eb-dark text-slate-200 font-sans">
    <AppLoadingBar />
    <GameIntroOverlay />
    <GameRulesOverlay />
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
import { watchEffect, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import AppHeader        from '@/components/layout/AppHeader.vue'
import AppTicker        from '@/components/layout/AppTicker.vue'
import AppFooter        from '@/components/layout/AppFooter.vue'
import AppLoadingBar      from '@/components/layout/AppLoadingBar.vue'
import GameIntroOverlay  from '@/components/layout/GameIntroOverlay.vue'
import GameRulesOverlay  from '@/components/layout/GameRulesOverlay.vue'
import TippingPointModal from '@/components/TippingPointModal.vue'
import { useGameStore } from '@/store/game.store'

const { t, locale } = useI18n()
const router    = useRouter()
const gameStore = useGameStore()

watchEffect(() => {
  document.documentElement.lang = locale.value
})

watch(
  () => gameStore.gameOver,
  (over) => { if (over) router.push('/bilan-2100') },
)

function skipToMain(): void {
  document.getElementById('main-content')?.focus()
}
</script>
