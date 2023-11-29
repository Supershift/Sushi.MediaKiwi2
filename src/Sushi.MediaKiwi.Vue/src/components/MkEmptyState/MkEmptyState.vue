<script setup lang="ts">
  import { useI18next } from "@/composables";
  import { MkNewItemButton } from "@/components";
  const { t } = await useI18next();

  const props = defineProps<{
    /** The title of the empty state, otherwise default is shown */
    title?: string;
    /** The subtitle of the empty state, otherwise default is shown */
    subtitle?: string;
    /** Determins if the new button is shown or not */
    new?: boolean;
    /** Navigation Id for navigating when the new button is pressed  */
    itemViewId?: string;
    /** Label for the new button's title  */
    newTitle?: string;
    /** Determines if we only want to emit instead of navigating to the given itemViewId, this stops the navigation to the view Id */
    newEmit?: boolean;
  }>();

  const emit = defineEmits<{
    (e: "click:new"): void;
  }>();

  // define slots
  const slots = defineSlots<{
    image?: (props: unknown) => never;
    title?: (props: unknown) => never;
    subtitle?: (props: unknown) => never;
    actions?: (props: unknown) => never;
  }>();
</script>
<template>
  <v-card class="align-center text-center" color="on-surface-variant">
    <slot v-if="slots.image" name="image"></slot>
    <img v-else src="@/assets/empty-state.svg" />

    <slot v-if="slots.title" name="title"></slot>
    <v-card-title v-else>{{ title ?? t("Empty List") }}</v-card-title>

    <slot v-if="slots.subtitle" name="subtitle"></slot>
    <v-card-subtitle>{{ subtitle ?? t("EmptyStateSubTitle", "This view is empty. Add items to display here.") }}</v-card-subtitle>

    <v-card-actions class="justify-center pt-5">
      <slot v-if="slots.actions" name="actions"></slot>
      <template v-if="props.new">
        <MkNewItemButton :item-view-id="props.itemViewId" :new-title="props.newTitle" :new-emit="props.newEmit" @click:new="() => emit('click:new')" />
      </template>
    </v-card-actions>
  </v-card>
</template>
