<script setup lang="ts">
  import { useI18next } from "@/composables";
  import { MkNewItemButton } from "@/components";
  import { useMediakiwiVueOptions } from "@/composables/useMediakiwiVueOptions";
  import { computed } from "vue";

  // Inject dependencies
  const { t } = await useI18next();
  const { emptyState } = useMediakiwiVueOptions();

  // Define props
  const props = defineProps<{
    /** The headline of the empty state, otherwise default is shown */
    headline?: string;
    /** The subtitle of the empty state, otherwise default is shown */
    text?: string;
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
    actions?: () => never;
    headline?: () => never;
    media?: () => never;
    text?: () => never;
  }>();

  const hideImage = computed(() => emptyState?.hideImage || false);

  const headline = computed(() => props.headline || t.value("Empty List"));
  const text = computed(() => props.text || t.value("EmptyStateSubTitle", "This view is empty. Add items to display here."));
</script>
<template>
  <v-empty-state class="mk-empty-state">
    <template v-if="!hideImage" #media>
      <slot v-if="slots.media" name="media"></slot>
      <img v-else-if="emptyState?.image" :src="emptyState?.image" />
      <img v-else src="@/assets/empty-state.svg" />
    </template>
    <template v-if="slots.headline || headline" #headline>
      <slot v-if="slots.headline" name="headline"></slot>
      <label v-else-if="headline" class="text-primary text-display-medium">{{ headline }}</label>
    </template>
    <template v-if="slots.text || text" #text>
      <slot v-if="slots.text" name="text"></slot>
      <template v-else-if="text">{{ text }}</template>
    </template>
    <template #actions>
      <slot v-if="slots.actions" name="actions"></slot>
      <template v-if="props.new && (props.itemViewId || props.newEmit)">
        <MkNewItemButton :item-view-id="props.itemViewId" :new-title="props.newTitle" :new-emit="props.newEmit" @click:new="() => emit('click:new')" />
      </template>
    </template>
  </v-empty-state>
</template>
