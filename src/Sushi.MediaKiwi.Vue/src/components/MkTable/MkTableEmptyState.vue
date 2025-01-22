<!-- eslint-disable vue/require-default-prop -->
<script setup lang="ts" generic="T">
  import MkNewItemButton from "../MkButton/MkNewItemButton.vue";
  import { useI18next, useMediakiwiVueOptions } from "@/composables";
  import { MkTableProps } from "@/models/table/TableProps";
  import { computed } from "vue";

  // Inject dependencies
  const { defaultT } = await useI18next();
  const { emptyState } = useMediakiwiVueOptions();

  const props = defineProps<
    MkTableProps<T> & {
      hasActiveFilters: boolean;
      onResetFilters: () => void;
      onNew: () => void;
    }
  >();

  // define slots
  const slots = defineSlots<{
    /** Custom Actions for the default empty state */
    actions?: () => never;
  }>();

  const emptyStateOptions = computed(() => (props.hasActiveFilters ? emptyState?.filter : emptyState?.default));

  const hideHeadline = computed(() => emptyStateOptions.value?.headline === false);
  const headline = computed(() =>
    hideHeadline.value ? undefined : props.emptyStateHeadline || emptyStateOptions.value?.headline || defaultT.value("EmptyState_Headline", "No results")
  );

  const hideTitle = computed(() => emptyStateOptions.value?.title === false);
  const title = computed(() => (hideTitle.value ? undefined : props.emptyStateTitle || emptyStateOptions.value?.title || ""));

  const hideText = computed(() => emptyStateOptions.value?.text === false);
  const text = computed(() =>
    hideText.value ? undefined : props.emptyStateText || emptyStateOptions.value?.text || defaultT.value("EmptyState_Text", "No data was found.")
  );

  const hideImage = computed(() => emptyStateOptions.value?.image === false);
  const image = computed(() => props.emptyStateImage || emptyStateOptions.value?.image || "");
</script>

<template>
  <v-empty-state :headline="headline" :title="title" :text="text">
    <template #media v-if="!hideImage">
      <img v-if="image" :src="image" />
      <img v-else src="@/assets/empty-state.svg" />
    </template>
    <template #actions>
      <slot v-if="slots.actions" name="actions" />
      <template v-else>
        <v-btn v-if="hasActiveFilters" variant="flat" color="primary" @click="onResetFilters">
          <template #prepend>
            <v-icon icon="symbols:restart_alt" />
          </template>
          {{ defaultT("EmptyState_ResetAllFilters", "Reset all filters") }}
        </v-btn>
        <MkNewItemButton
          v-else-if="props.new && (props.navigationItemId || props.newEmit)"
          :navigation-item-id="props.navigationItemId"
          :new-title="props.newTitle"
          :new-emit="props.newEmit"
          @click:new="onNew"
        />
      </template>
    </template>
  </v-empty-state>
</template>
