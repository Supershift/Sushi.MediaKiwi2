<script setup lang="ts">
  import { MkNewItemButton, MkOverflowMenuIcon } from "@/components";
  import { onMounted, useTemplateRef, watch } from "vue";
  import { useWindowScroll } from "@vueuse/core";
  import { useLayout } from "vuetify";

  // define properties
  const props = withDefaults(
    defineProps<{
      /** ExternalId of the view instance */
      navigationItemId?: string;
      /** Title specificly for the current table */
      title?: string;
      /** Determines if the toolbar is disabled, default: false */
      disabled?: boolean;
      /** Determines if the delete button is shown, default: false */
      delete?: boolean;
      /** Determines if the toolbar has a new button, default: false. */
      new?: boolean;
      /** Determines if we only want to emit instead of navigating to the given navigationItemId */
      newEmit?: boolean;
      /** Overrides the "new item" button title */
      newTitle?: string;
      /** Determines if the toolbar becomes sticky at the top of the page, default: false */
      sticky?: boolean;
    }>(),
    {
      sticky: true, // default to true
    }
  );

  // define slots
  const slots = defineSlots<{
    /** Visible action slot for the MkToolbar */
    toolbar?: (props: unknown) => never;
    /** Visible header for the MkToolbar */
    title?: () => never;
    /** Visible header for the MkToolbar */
    header?: (props: unknown) => never;
    /** Menu actions for the MkToolbar */
    overflowMenuActions?: (props: unknown) => never;
  }>();

  // define events
  const emit = defineEmits<{
    (e: "click:new", value?: string): void;
  }>();

  const toolbar = useTemplateRef("toolbar");

  function applyStuckClass() {
    if (props.sticky) {
      const { y } = useWindowScroll();
      const layout = useLayout();
      const offsetTop = layout.mainRect.value.top;

      // watch the scroll position
      watch(
        () => y.value,
        () => {
          // get the position of our toolbar
          const toolbarPosition = toolbar.value?.$el.getBoundingClientRect().top;

          // add the stuck class when the toolbar is at the top of the page
          toolbar.value?.$el.classList.toggle("v-toolbar--mediakiwi--stuck", toolbarPosition <= offsetTop);
        }
      );
    }
  }

  onMounted(applyStuckClass);
</script>

<template>
  <v-card variant="text" :class="['v-toolbar--mediakiwi', { 'v-toolbar--sticky': props.sticky }]" ref="toolbar">
    <v-container class="pl-0 pt-1" fluid>
      <v-row v-if="slots.header" class="justify-end">
        <slot name="header"></slot>
      </v-row>
      <v-row v-if="slots.toolbar || slots.overflowMenuActions || props.title || props.new" class="pb-2 ml-0 align-center d-flex flex-nowrap justify-end">
        <div v-if="title || slots.title" class="flex-1-1 text-truncate" :title="title">
          <v-card-title v-if="title" class="px-0 text-title-medium">{{ title }}</v-card-title>
          <slot v-else-if="slots.title" name="title"></slot>
        </div>

        <v-card-actions>
          <template v-if="slots.toolbar">
            <slot name="toolbar"></slot>
          </template>

          <!-- Render the new button when the prop is set -->
          <template v-if="props.new">
            <MkNewItemButton
              :navigation-item-id="props.navigationItemId"
              :new-title="props.newTitle"
              :new-emit="props.newEmit"
              @click:new="emit('click:new', $event)"
            />
          </template>

          <MkOverflowMenuIcon v-if="slots.overflowMenuActions">
            <slot name="overflowMenuActions"></slot>
          </MkOverflowMenuIcon>
        </v-card-actions>
      </v-row>
    </v-container>
  </v-card>
</template>

<style scoped lang="scss">
  .v-list {
    display: flex;
    flex-flow: column;
  }

  .v-toolbar--mediakiwi--stuck {
    border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  }
</style>
