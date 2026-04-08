<template>
  <div class="min-h-screen bg-eb-dark text-slate-200 font-sans">
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
