<script setup lang="ts">
  import { useI18next } from "@/composables";

  // inject dependencies
  const { defaultT } = await useI18next();

  // define properties and events
  const props = withDefaults(
    defineProps<{
      /** Title of the dialog */
      title?: string;
      /** indicator to show the progress bar */
      loading?: boolean;
      /** hides the header  */
      hideHeader?: boolean;
      /** Enables the padding around the content box */
      removeContentPadding?: boolean;
      /** */
      contentClasses?: string;
    }>(),
    {
      title: "",
      contentClasses: "px-6 py-2",
    }
  );

  const emit = defineEmits<{
    (e: "click:close"): void;
  }>();

  function close() {
    emit("click:close");
  }

  // define slots
  const slots = defineSlots<{
    heroIcon?: (props: unknown) => any;
    default?: (props: unknown) => any;
    title?: () => any;
    intro?: (props: unknown) => any;
    /** Slot for the visible buttons in the action obar */
    actions?: (props: unknown) => any;
    /** Slot designed for the buttons (or whatever the user wants) that are available behind the 3 dots menu */
    activator?: (props: unknown) => any;
  }>();
</script>

<template>
  <v-card class="mk-dialog-card" :class="{ 'text-center': slots.heroIcon }" rounded="xl" variant="elevated">
    <div v-if="!hideHeader" class="mk-dialog-card__header pa-6">
      <slot name="heroIcon"></slot>
      <v-card-title v-if="props.title" tag="h6" class="text-headline-small pa-0 mb-4"> {{ title }} </v-card-title>
      <slot v-else-if="slots.title" name="title"></slot>
      <slot name="intro"></slot>
      <v-progress-linear v-if="loading" class="mk-dialog-card__header__loader" absolute indeterminate></v-progress-linear>
    </div>
    <v-divider v-if="!hideHeader" />
    <div class="mk-dialog-card__content" :class="contentClasses">
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
