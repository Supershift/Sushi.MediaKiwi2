<script setup lang="ts">
  import { useI18next } from "@/composables";

  // inject dependencies
  const { defaultT } = await useI18next();

  // define properties and events
  defineProps<{
    title: string;
    /** indicator to show the progress bar */
    loading: boolean;
  }>();

  const emit = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
    (e: "click:close"): void;
  }>();

  function close() {
    emit("click:close");
  }

  // define slots
  const slots = defineSlots<{
    heroIcon?: (props: unknown) => any;
    default?: (props: unknown) => any;
    intro?: (props: unknown) => any;
    /** Slot for the visible buttons in the action obar */
    actions?: (props: unknown) => any;
    /** Slot designed for the buttons (or whatever the user wants) that are available behind the 3 dots menu */
    activator?: (props: unknown) => any;
  }>();
</script>

<template>
  <v-card class="mk-dialog-card" :class="{ 'text-center': slots.heroIcon }" rounded="xl" variant="elevated">
    <div class="mk-dialog-card__header pa-6">
      <slot name="heroIcon"></slot>
      <v-card-title v-if="title" tag="h6" class="text-headline-small pa-0 mb-4"> {{ title }} </v-card-title>
      <slot name="intro"></slot>
      <v-progress-linear v-if="loading" class="mk-dialog-card__header__loader" absolute indeterminate></v-progress-linear>
    </div>
    <v-divider />
    <div class="mk-dialog-card__content py-2 px-6">
      <slot></slot>
    </div>
    <v-divider />
    <v-card-actions class="mk-dialog-card__actions pa-6">
      <v-spacer />
      <v-btn @click="close()">{{ defaultT("Cancel") }}</v-btn>
      <slot v-if="slots.actions" name="actions"> </slot>
    </v-card-actions>
  </v-card>
</template>
<style lang="scss" scoped>
  .mk-dialog-card {
    display: flex;
    flex-flow: column nowrap;
    overflow: hidden;

    &__header {
      position: relative;

      &__loader {
        bottom: 0px;
        top: unset !important; // Need the important to override the inline style
      }
    }

    &__content {
      flex: 1;
      overflow-y: auto;
    }
  }
</style>
