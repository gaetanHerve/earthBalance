<template>
  <div class="flex items-center gap-2 flex-wrap mb-6">
    <span class="text-xs text-slate-500 font-bold uppercase tracking-wider">
      <i class="fa fa-sliders mr-1" aria-hidden="true"></i> {{ t('widgets.label') }} :
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
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

defineProps<{ visible: string[] }>()
defineEmits<{ toggle: [id: string] }>()

const { t } = useI18n()

interface Widget { id: string; label: string }
const allWidgets = computed<Widget[]>(() => [
  { id: 'co2',         label: t('widgets.co2') },
  { id: 'temperature', label: t('widgets.temperature') },
  { id: 'forest',      label: t('widgets.forest') },
  { id: 'seaLevel',    label: t('widgets.seaLevel') },
  { id: 'energyMix',   label: t('widgets.energyMix') },
  { id: 'resources',   label: t('widgets.resources') },
  { id: 'extremes',    label: t('widgets.extremes') },
])
</script>
