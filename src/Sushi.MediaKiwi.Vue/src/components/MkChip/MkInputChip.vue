<script lang="ts" setup>
  const props = defineProps<{
    appendIcon?: string;
    prependIcon?: string;
    closable?: boolean;
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
    :closable="props.closable"
    color="primary"
    @click:close.stop="() => emit('click:remove')"
    @click.stop="() => emit('click')"
  >
    <slot></slot>
  </v-chip>
</template>
