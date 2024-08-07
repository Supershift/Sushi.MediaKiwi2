<script setup lang="ts">
  import { ProblemDetails } from "@/models/errors/ProblemDetails";
  import { computed } from "vue";
  import { useProblemDetails } from "@/composables/useProblemDetails";

  // inject dependencies
  const { getProblemDetailMessages } = useProblemDetails();

  const props = withDefaults(
    defineProps<{
      /** Show the {@link ProblemDetails} detail value */
      showDetails?: boolean;
      /** Type proxy from the Vuetify alert types  */
      type: "error" | "warning" | "info" | "success";
    }>(),
    {
      type: "error",
    }
  );

  /** Problem Details received from the server */
  const problemDetails = defineModel<ProblemDetails>("problemDetails", { required: false });

  const slots = defineSlots<{
    /** Default body slot for the dialog */
    default?: (props: unknown) => never;
  }>();

  const alertColor = computed(() => {
    switch (props.type) {
      case "warning":
        return "warning-container";
      default:
        return props.type;
    }
  });

  function onClose() {
    problemDetails.value = undefined;
  }

  const messages = computed(() => getProblemDetailMessages(problemDetails.value, props.showDetails));
</script>
<template>
  <v-alert v-if="problemDetails" v-bind="$attrs" type="error" closable @click:close="onClose">
    <template #text>
      <p class="text-body-large" v-for="message in messages">{{ message }}</p>
    </template>
    <template #close="{ props }">
      <v-btn icon="symbols:close" color="neutral" v-bind="props" />
    </template>
  </v-alert>
  <v-alert v-else-if="slots.default" :type="props.type" :color="alertColor" v-bind="$attrs">
    <template #text>
      <slot name="default"></slot>
    </template>
  </v-alert>
</template>
