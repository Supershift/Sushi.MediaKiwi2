<script setup lang="ts">
  import { Ref, inject } from "vue";
  import { type i18n } from "i18next";

  // define properties and events
  const props = defineProps<{
    disabled?: boolean;
    delete?: boolean;
    save?: boolean;
    undo?: boolean;
  }>();
  defineEmits(["save", "undo", "delete"]);

  // inject dependencies
  const i18next = inject<i18n>("i18next")!;

  const t = i18next.t;
</script>

<template>
  <v-toolbar>
    <slot></slot>
    <v-btn v-if="undo" :disabled="props.disabled" @click="$emit('undo', $event)">{{ t("undo") }}</v-btn>
    <v-btn v-if="save" :disabled="props.disabled" @click="$emit('save', $event)">{{ t("save") }}</v-btn>

    <v-btn v-if="props.delete" icon color="primary">
      <v-icon>mdi-dots-vertical</v-icon>

      <v-menu activator="parent">
        <v-list :disabled="props.disabled">
          <v-list-item>
            <v-list-item-title>
              <v-btn v-if="props.delete" @click="$emit('delete', $event)">{{ t("delete") }}</v-btn>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-btn>
  </v-toolbar>
</template>
