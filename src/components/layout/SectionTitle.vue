<template>
  <component
    :is="`h${level}`"
    class="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-widest text-slate-500"
  >
    <i :class="['fa', icon, colorClass]" aria-hidden="true"></i>
    <span>{{ title }}</span>
    <div class="flex-1 h-px bg-eb-border" aria-hidden="true"></div>
  </component>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  icon: string
  colorClass?: string
  level?: 2 | 3 | 4
}>(), { colorClass: 'text-eb-cyan', level: 2 })
</script>
