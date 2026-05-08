<template>
  <div
    class="relative"
    :class="block ? 'flex w-full' : 'inline-flex items-center'"
    @mouseenter="visible = true"
    @mouseleave="visible = false"
    @focusin="visible = true"
    @focusout="visible = false"
  >
    <slot />
    <Transition name="eb-tooltip">
      <span
        v-if="visible && text"
        role="tooltip"
        class="absolute z-[200] whitespace-nowrap px-2.5 py-1.5 text-[11px] leading-tight text-slate-200 bg-eb-deep border border-eb-border/80 rounded-lg shadow-xl pointer-events-none"
        :class="position === 'bottom'
          ? 'top-full left-1/2 -translate-x-1/2 mt-2'
          : 'bottom-full left-1/2 -translate-x-1/2 mb-2'"
      >
        {{ text }}
      </span>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

withDefaults(defineProps<{
  text?: string
  position?: 'top' | 'bottom'
  block?: boolean
}>(), {
  position: 'bottom',
  block: false,
})

const visible = ref(false)
</script>

<style scoped>
.eb-tooltip-enter-active,
.eb-tooltip-leave-active { transition: opacity 0.12s ease; }
.eb-tooltip-enter-from,
.eb-tooltip-leave-to    { opacity: 0; }
</style>
