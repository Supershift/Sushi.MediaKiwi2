<script lang="ts" setup>
  const props = defineProps<{
    appendIcon?: string;
    prependIcon?: string;
  }>();

  const emit = defineEmits<{
    (e: "click"): void;
    (e: "click:remove"): void;
  }>();
</script>

<template>
  <v-chip
    :append-icon="props.appendIcon"
    :prepend-icon="props.prependIcon"
    closable
    color="primary"
    @click:close.stop="(e) => emit('click:remove')"
    @click.stop="() => emit('click')"
  >
    <slot></slot>
  </v-chip>
</template>
