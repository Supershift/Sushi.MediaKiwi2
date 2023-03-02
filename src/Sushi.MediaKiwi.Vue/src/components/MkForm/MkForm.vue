<script setup lang="ts">
  import MkFormToolbar from "./MkFormToolbar.vue";
  defineEmits(["save", "undo", "delete"]);
</script>
<template>
  <MkFormToolbar v-bind="$attrs" @save="$emit('save', $event)" @undo="$emit('undo', $event)" @delete="$emit('delete', $event)"></MkFormToolbar>

  <slot></slot>
</template>
