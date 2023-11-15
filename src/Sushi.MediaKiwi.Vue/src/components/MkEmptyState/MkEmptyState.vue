<script setup lang="ts">
  import { useI18next } from "@/composables";
  const { t } = await useI18next();

  defineProps<{
    /** The title of the empty state */
    title?: string;
    /** The subtitle of the empty state */
    subtitle?: string;
  }>();

  const emit = defineEmits<{
    (e: "click:btn"): void;
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
    <v-card-title v-else>{{ t("Empty List") }}</v-card-title>

    <slot v-if="slots.subtitle" name="subtitle"></slot>
    <v-card-subtitle>{{ t("EmptyStateSubTitle", "This view is empty. Add items to display here.") }}</v-card-subtitle>

    <v-card-actions class="justify-center pt-5">
      <slot v-if="slots.actions" name="actions"></slot>
      <v-btn-primary v-else @click="() => emit('click:btn')">Add</v-btn-primary>
    </v-card-actions>
  </v-card>
</template>
