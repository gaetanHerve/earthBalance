import { ref, watchEffect } from 'vue'

const STORAGE_KEY = 'eb-high-contrast'

// État singleton partagé entre tous les composants qui utilisent ce composable
const highContrast = ref<boolean>(localStorage.getItem(STORAGE_KEY) === 'true')

// Synchronise la classe CSS et le localStorage dès l'initialisation et à chaque changement
watchEffect(() => {
  document.documentElement.classList.toggle('high-contrast', highContrast.value)
  localStorage.setItem(STORAGE_KEY, String(highContrast.value))
})

export function useContrastMode() {
  function toggle(): void {
    highContrast.value = !highContrast.value
  }
  return { highContrast, toggle }
}
