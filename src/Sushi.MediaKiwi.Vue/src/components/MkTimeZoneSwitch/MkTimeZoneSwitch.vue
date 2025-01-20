<script setup lang="ts">
  import { useTimeZones } from "@/composables/useTimeZones";
  const { timeZones, currentTimeZone, setTimeZone } = useTimeZones();

  async function changeTimeZone(timeZone: string) {
    setTimeZone(timeZone);
  }
</script>

<template>
  <v-autocomplete v-model="currentTimeZone" :items="timeZones" label="Time zone" item-title="name" item-value="value" @update:model-value="changeTimeZone" />
</template>
