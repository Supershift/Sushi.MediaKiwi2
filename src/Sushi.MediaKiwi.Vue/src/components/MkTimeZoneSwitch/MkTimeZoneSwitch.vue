<script setup lang="ts">
  import { useTimeZones } from "@/composables/useTimeZones";
  const { getTimeZones, currentTimeZone, setTimeZone } = useTimeZones();

  async function changeTimeZone(timeZone: string) {
    setTimeZone(timeZone);
  }
</script>

<template>
  <v-autocomplete v-model="currentTimeZone" :items="getTimeZones" label="Time zone" item-title="name" item-value="value" @update:model-value="changeTimeZone" />
</template>
