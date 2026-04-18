<template>
  <section :aria-labelledby="headingId">

    <div class="flex items-center gap-2 mb-4">
      <h2
        :id="headingId"
        class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 flex-1 min-w-0"
      >
        <i :class="['fa', icon, colorClass, 'shrink-0']" aria-hidden="true"></i>
        <span :class="colorClass">{{ title }}</span>
        <div class="flex-1 h-px bg-eb-border" aria-hidden="true"></div>
      </h2>

      <!-- Contenu optionnel à droite du titre (ex. deadline) -->
      <slot name="header-extra" />

      <!-- Bouton collapse — visible uniquement sur mobile -->
      <button
        class="md:hidden shrink-0 w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors rounded focus-visible:ring-2 focus-visible:ring-eb-cyan outline-none"
        :aria-expanded="isOpen"
        :aria-controls="contentId"
        :aria-label="isOpen ? `Réduire ${title}` : `Développer ${title}`"
        @click="isOpen = !isOpen"
      >
        <i :class="['fa', isOpen ? 'fa-chevron-up' : 'fa-chevron-down', 'text-xs', 'transition-transform', 'duration-200']" aria-hidden="true"></i>
      </button>
    </div>

    <div :id="contentId" v-show="isVisible">
      <slot />
    </div>

  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = withDefaults(defineProps<{
  title:        string
  icon:         string
  colorClass?:  string
  defaultOpen?: boolean
}>(), {
  colorClass:  'text-eb-cyan',
  defaultOpen: true,
})

const isOpen   = ref(props.defaultOpen)
const isMobile = ref(false)

function checkMobile(): void {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})
onBeforeUnmount(() => window.removeEventListener('resize', checkMobile))

// Sur desktop, toujours visible ; sur mobile, contrôlé par isOpen
const isVisible = computed(() => !isMobile.value || isOpen.value)

const safeId    = props.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
const headingId = `cs-${safeId}`
const contentId = `cs-content-${safeId}`
</script>
