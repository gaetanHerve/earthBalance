<template>
  <div class="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">
    <i :class="['fa', icon, colorClass]" aria-hidden="true"></i>
    <span>{{ title }}</span>
    <div class="flex-1 h-px bg-eb-border" aria-hidden="true"></div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  icon: string
  colorClass?: string
}>(), { colorClass: 'text-eb-cyan' })
</script>
