<template>
  <div
    class="bg-eb-card border border-eb-border rounded-card p-5 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-cyan"
    :class="[glowClass, extraClass]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  glowClass?: string
  extraClass?: string
}>(), { glowClass: '', extraClass: '' })
</script>

<style scoped>
.hover\:shadow-cyan:hover {
  box-shadow: 0 0 20px rgba(0,229,255,0.15);
}
</style>
