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
    <v-btn v-if="undo" :disabled="props.disabled" @click="$emit('undo', $event)">Undo changes</v-btn>
    <v-btn v-if="save" :disabled="props.disabled" @click="$emit('save', $event)">Save</v-btn>

    <v-btn v-if="props.delete" icon color="primary">
      <v-icon>mdi-dots-vertical</v-icon>

      <v-menu activator="parent">
        <v-list :disabled="props.disabled">
          <v-list-item>
            <v-list-item-title>
              <v-btn v-if="props.delete" @click="$emit('delete', $event)">Delete</v-btn>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-btn>
  </v-toolbar>
</template>
