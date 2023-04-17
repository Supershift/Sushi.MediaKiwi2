<script setup lang="ts">
  const props = defineProps<{
    disabled?: boolean;
    delete?: boolean;
    save?: boolean;
    undo?: boolean;
  }>();
  defineEmits(["save", "undo", "delete"]);
</script>

<template>
  <v-toolbar>
    <slot></slot>
    <v-btn v-if="undo" @click="$emit('undo', $event)" :disabled="props.disabled">Undo changes</v-btn>
    <v-btn v-if="save" @click="$emit('save', $event)" :disabled="props.disabled">Save</v-btn>

    <v-btn icon color="primary">
      <v-icon>mdi-dots-vertical</v-icon>

      <v-menu activator="parent">
        <v-list :disabled="props.disabled">
          <v-list-item>
            <v-list-item-title>
              <v-btn v-if="delete" @click="$emit('delete', $event)">Delete</v-btn>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-btn>
  </v-toolbar>
</template>
