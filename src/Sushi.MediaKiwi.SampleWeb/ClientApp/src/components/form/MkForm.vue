<script setup lang="ts">
  import MkFormToolbar from "../form/MkFormToolbar.vue";
  defineEmits(["save", "undo"]);
</script>
<template>
  <MkFormToolbar v-bind="$attrs"
  @save="$emit('save', $event)" 
  @undo="$emit('undo', $event)"> </MkFormToolbar>
  <v-container>
    <slot></slot>
  </v-container>
</template>
