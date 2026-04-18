<template>
  <div
    class="rounded-xl bg-eb-border/30 animate-pulse"
    :style="{ height: height + 'px' }"
    role="status"
    :aria-label="label"
  >
    <div class="h-full flex flex-col items-center justify-center gap-2 opacity-30">
      <div class="w-8 h-8 rounded-full border-2 border-slate-600 border-t-transparent animate-spin"></div>
      <span class="text-xs text-slate-600 sr-only">{{ label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  height?: number
  label?: string
}>(), {
  height: 180,
  label: 'Chargement du graphique…',
})
</script>
