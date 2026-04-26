<template>
  <div
    class="bg-eb-card border border-eb-border rounded-card p-5 flex flex-col justify-between gap-3 transition-transform duration-200 hover:-translate-y-0.5"
    style="border-left: 2px solid rgba(250,204,21,0.35);"
  >
    <div>
      <i class="fa fa-quote-left text-yellow-500/40 text-lg mb-2 block" aria-hidden="true"></i>
      <p class="text-sm text-slate-300 italic leading-relaxed">{{ localizedText }}</p>
    </div>

    <footer class="flex flex-col gap-0.5">
      <span class="text-xs text-slate-500 font-mono">{{ quote.source }}</span>
      <span class="text-xs text-yellow-600/70 italic">{{ localizedConfidence }}</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { IpccQuote } from '@/data/ipccQuotes'

const props = defineProps<{ quote: IpccQuote }>()

const { locale } = useI18n()

const localizedText = computed(() => {
  const lang = locale.value.startsWith('en') ? 'en' : 'fr'
  return props.quote.text[lang]
})

const localizedConfidence = computed(() => {
  const lang = locale.value.startsWith('en') ? 'en' : 'fr'
  return props.quote.confidence[lang]
})
</script>
