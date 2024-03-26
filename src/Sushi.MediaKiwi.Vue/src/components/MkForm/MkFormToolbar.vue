<script setup lang="ts">
  import { useI18next } from "@/composables/useI18next";
  import { ref } from "vue";
  import { MkOverflowMenuIcon } from "@/components";

  // define properties and events
  const props = defineProps<{
    /** Determines if the toolbar is disabled, default: false */
    disabled?: boolean;
    /** Determines if the delete button is shown, default: false */
    delete?: boolean;
    /** Determines if the save button is shown, default: false */
    save?: boolean;
    /** Determines if the undo button is shown, default: false */
    undo?: boolean;
    /** Determines if the toolbar becomes sticky at the top of the page, default: false */
    sticky?: boolean;
  }>();
  defineEmits(["save", "undo", "delete"]);

  // inject dependencies
  const { defaultT } = await useI18next();

  // define reactive variables
  const dialog = ref(false);
</script>

<template>
  <v-toolbar :class="['mb-10', { 'v-toolbar--sticky': props.sticky }]" color="surface">
    <v-spacer />
    <slot></slot>
    <v-btn v-if="undo" :disabled="props.disabled" @click="$emit('undo', $event)">{{ defaultT("Undo") }}</v-btn>
    <v-btn v-if="save" :disabled="props.disabled" @click="$emit('save', $event)">{{ defaultT("Save") }}</v-btn>

    <MkOverflowMenuIcon v-if="props.delete">
      <v-list-item>
        <v-list-item-title> {{ defaultT("Delete") }} </v-list-item-title>
        <v-dialog v-model="dialog" activator="parent" width="auto">
          <v-card>
            <v-card-text> {{ defaultT("Confirm delete") }} </v-card-text>
            <v-card-actions>
              <v-btn @click="dialog = false">{{ defaultT("Cancel") }}</v-btn>
              <v-btn
                color="primary"
                @click="
                  dialog = false;
                  $emit('delete', $event);
                "
                >{{ defaultT("Delete") }}</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-list-item>
    </MkOverflowMenuIcon>
  </v-toolbar>
</template>
<style lang="scss">
  .v-toolbar {
    &--mediakiwi {
      .v-toolbar__content > .v-toolbar-title {
        margin-left: 0;
      }
    }
  }
</style>
