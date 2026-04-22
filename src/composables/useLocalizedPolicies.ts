import { useI18n } from 'vue-i18n'
import { policyI18n } from '@/i18n/policies/en'
import type { MitigationPolicy, ProspectiveNarrative } from '@/types/index'
import type { PolicyDetail } from '@/data/policyDetails'

export function useLocalizedPolicies() {
  const { locale } = useI18n()

  function localizedPolicy(p: MitigationPolicy): MitigationPolicy {
    if (locale.value === 'fr') return p
    const t = policyI18n[p.id]
    if (!t) return p

    // Merge narrative translations while preserving colorClass / borderClass
    let narratives = p.prospectiveNarratives
    if (t.narratives) {
      narratives = Object.fromEntries(
        Object.entries(p.prospectiveNarratives).map(([key, orig]: [string, ProspectiveNarrative]) => [
          key,
          { ...orig, ...(t.narratives?.[key] ?? {}) },
        ])
      )
    }

    // Merge resource translations (title + excerpt only, url unchanged)
    let resources = p.resources
    if (t.resources) {
      resources = p.resources.map((r, i) => ({
        ...r,
        ...(t.resources?.[i] ?? {}),
      }))
    }

    return {
      ...p,
      title:                  t.title,
      description:            t.description              ?? p.description,
      prospectiveNarratives:  narratives,
      resources,
    }
  }

  function localizedDetail(id: string, detail: PolicyDetail | null): PolicyDetail | null {
    if (!detail || locale.value === 'fr') return detail
    const t = policyI18n[id]
    if (!t) return detail
    return {
      ...detail,
      summary: t.summary ?? detail.summary,
      ipccReference: {
        ...detail.ipccReference,
        report:       'IPCC AR6 — Synthesis Report (SYR), 2023',
        sectionTitle: t.sectionTitle ?? detail.ipccReference.sectionTitle,
      },
    }
  }

  return { localizedPolicy, localizedDetail }
}
