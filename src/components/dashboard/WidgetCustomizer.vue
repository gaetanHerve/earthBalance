<template>
  <div class="flex items-center gap-2 flex-wrap mb-6">
    <span class="text-xs text-slate-500 font-bold uppercase tracking-wider">
      <i class="fa fa-sliders mr-1" aria-hidden="true"></i> Graphiques affichés :
    </span>
    <button
      v-for="widget in allWidgets"
      :key="widget.id"
      class="text-xs px-3 py-1 rounded-full border transition-all focus-visible:ring-2 focus-visible:ring-eb-cyan outline-none"
      :class="visible.includes(widget.id)
        ? 'bg-eb-cyan/10 border-eb-cyan text-eb-cyan'
        : 'bg-transparent border-eb-border text-slate-500 hover:border-slate-500'"
      :aria-pressed="visible.includes(widget.id)"
      @click="$emit('toggle', widget.id)"
    >
      {{ widget.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{ visible: string[] }>()
defineEmits<{ toggle: [id: string] }>()

interface Widget { id: string; label: string }
const allWidgets: Widget[] = [
  { id: 'co2',        label: '💨 CO₂' },
  { id: 'temperature',label: '🌡️ Température' },
  { id: 'forest',     label: '🌲 Forêt' },
  { id: 'energyMix',  label: '⚡ Énergie' },
  { id: 'resources',  label: '⛏️ Ressources' },
]
</script>
