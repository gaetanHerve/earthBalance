<template>
  <footer class="mt-12 border-t border-slate-800 bg-slate-900/50">
    <div class="max-w-screen-2xl mx-auto px-4 py-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

        <!-- Partenaires -->
        <div>
          <h2 class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
            {{ t('footer.partners') }}
          </h2>
          <ul class="flex flex-wrap gap-2 list-none p-0 m-0">
            <li
              v-for="p in partners"
              :key="p"
              class="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded"
            >{{ p }}</li>
          </ul>
        </div>

        <!-- Infrastructure -->
        <div>
          <h2 class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
            {{ t('footer.infrastructure') }}
          </h2>
          <ul class="space-y-1 text-xs text-slate-500 list-none p-0 m-0">
            <li>
              <a href="#" class="text-eb-cyan hover:underline focus-visible:ring-2 focus-visible:ring-eb-cyan rounded">
                <i class="fa fa-link mr-1" aria-hidden="true"></i>{{ t('footer.infra.docs') }}
              </a>
            </li>
            <li>
              <a href="#" class="text-eb-cyan hover:underline focus-visible:ring-2 focus-visible:ring-eb-cyan rounded">
                <i class="fa fa-code mr-1" aria-hidden="true"></i>{{ t('footer.infra.api') }}
              </a>
            </li>
            <li>
              <a href="#" class="text-eb-cyan hover:underline focus-visible:ring-2 focus-visible:ring-eb-cyan rounded">
                <i class="fa fa-file-alt mr-1" aria-hidden="true"></i>{{ t('footer.infra.whitepaper') }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Statistiques globales -->
        <div>
          <h2 class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
            {{ t('footer.stats') }}
          </h2>
          <div class="space-y-1 text-xs">
            <div class="flex justify-between text-slate-500">
              <span>{{ t('footer.stats_labels.total') }}</span>
              <span class="text-eb-green font-bold">{{ stats?.totalDecisions?.toLocaleString('fr-FR') ?? '—' }}</span>
            </div>
            <div class="flex justify-between text-slate-500">
              <span>{{ t('footer.stats_labels.validated') }}</span>
              <span class="text-eb-cyan font-bold">{{ stats?.validatedDecisions?.toLocaleString('fr-FR') ?? '—' }}</span>
            </div>
            <div class="flex justify-between text-slate-500">
              <span>{{ t('footer.stats_labels.sessions') }}</span>
              <span class="text-slate-300 font-bold">{{ stats?.totalSessions ?? '—' }}</span>
            </div>
            <div class="flex justify-between text-slate-500">
              <span>{{ t('footer.stats_labels.players') }}</span>
              <span class="text-slate-300 font-bold">{{ stats?.uniquePlayers?.toLocaleString('fr-FR') ?? '—' }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="border-t border-slate-800 pt-4 flex flex-wrap justify-between items-center gap-2 text-xs text-slate-600">
        <span>🌍 {{ t('footer.tagline') }}</span>
        <span>
          Propulsé par EarthChain™ · {{ t('footer.nodes') }} : 312 {{ t('footer.active') }} · {{ t('footer.latency') }} : 42ms
        </span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useDashboardStore } from '@/store/dashboard.store'

const { t } = useI18n()
const dashStore = useDashboardStore()

const { globalStats: stats } = storeToRefs(dashStore)

const partners: string[] = ['🌡️ GIEC / IPCC', '🌿 PNUE / UNEP', '🌐 ONU / UN', '🍃 WWF', '🌾 FAO']
</script>
