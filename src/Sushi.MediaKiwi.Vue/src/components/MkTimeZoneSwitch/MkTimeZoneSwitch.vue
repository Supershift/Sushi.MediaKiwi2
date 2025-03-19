<script setup lang="ts">
  import { useSnackbarStore } from "@/stores";
  import { useTimeZones } from "@/composables/useTimeZones";
  import { useI18next } from "@/composables/useI18next";

  const { t } = await useI18next("MKTimeZones");

  const { timeZones, currentTimeZone, setTimeZone } = useTimeZones(t);
  const snackbar = useSnackbarStore();

  function changeTimeZone(timeZoneValue: string) {
    const timeZone = timeZones.value.find((tz) => tz.value === timeZoneValue)!;
    setTimeZone(timeZone.value);
    snackbar.showMessage(
      t.value("TimeZoneChanged", "You're now viewing time in {{timeZoneName}}", { timeZoneName: timeZone.name, interpolation: { escapeValue: false } })
    );
  }
</script>

<template>
  <v-autocomplete
    v-model="currentTimeZone"
    :items="timeZones"
    label="Time zone"
    item-title="longName"
    item-value="value"
    @update:model-value="changeTimeZone"
  />
</template>
