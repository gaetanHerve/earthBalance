import { createI18n } from 'vue-i18n'
import fr from './locales/fr'
import en from './locales/en'

const savedLocale = localStorage.getItem('eb-locale')
const defaultLocale = savedLocale ?? (navigator.language.startsWith('fr') ? 'fr' : 'en')

export const i18n = createI18n({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: 'fr',
  messages: { fr, en },
})

export type Locale = 'fr' | 'en'
