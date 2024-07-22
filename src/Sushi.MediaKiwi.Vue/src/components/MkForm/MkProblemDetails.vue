<script setup lang="ts">
  import { ProblemDetails } from "@/models/errors/ProblemDetails";
  import { computed } from "vue";

  const props = withDefaults(
    defineProps<{
      /** Problem Details received from the server */
      problemDetails?: ProblemDetails;
      /** Show the {@link ProblemDetails} detail value */
      showDetails?: boolean;
      /** Type proxy from the Vuetify alert types  */
      type: "error" | "warning" | "info" | "success";
    }>(),
    {
      type: "error",
    }
  );

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

  const message = computed(() => {
    if (props.showDetails) {
      const messsage = props.problemDetails?.detail;
      if (messsage) {
        return messsage;
      }
    }
    // return getMessageByStatusCode(props.problemDetails?.status);
  });
</script>
<template>
  <v-alert v-if="props.problemDetails" v-bind="$attrs" type="error">
    <template #text>
      <span v-html="message"></span>
    </template>
  </v-alert>
  <v-alert v-else-if="slots.default" :type="props.type" :color="alertColor" v-bind="$attrs">
    <template #text>
      <slot name="default"></slot>
    </template>
  </v-alert>
</template>
