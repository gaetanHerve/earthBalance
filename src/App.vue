<template>
  <div class="min-h-screen bg-eb-dark text-slate-200 font-sans">
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-eb-cyan text-eb-dark px-3 py-1 rounded font-bold z-[100]"
    >
      Aller au contenu principal
    </a>
    <AppHeader />
    <AppTicker />
    <router-view />
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
import AppTicker from '@/components/layout/AppTicker.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
</script>
