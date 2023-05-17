<script setup lang="ts">
  import { useI18next } from "@/composables/useI18next";

  // define properties and events
  const props = defineProps<{
    disabled?: boolean;
    delete?: boolean;
    save?: boolean;
    undo?: boolean;
  }>();
  defineEmits(["save", "undo", "delete"]);

  // inject dependencies
  const { i18next, t } = useI18next();
</script>

<template>
  <v-toolbar>
    <slot></slot>
    <v-btn v-if="undo" :disabled="props.disabled" @click="$emit('undo', $event)">{{ t("Undo") }}</v-btn>
    <v-btn v-if="save" :disabled="props.disabled" @click="$emit('save', $event)">{{ t("Save") }}</v-btn>

    <v-btn v-if="props.delete" icon color="primary">
      <v-icon>mdi-dots-vertical</v-icon>

      <v-menu activator="parent">
        <v-list :disabled="props.disabled">
          <v-list-item>
            <v-list-item-title>
              <v-btn v-if="props.delete" @click="$emit('delete', $event)">{{ t("Delete") }}</v-btn>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-btn>
  </v-toolbar>
</template>
