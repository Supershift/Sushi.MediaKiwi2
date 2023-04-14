<script lang="ts" setup>
  const props = defineProps<{
    item: any;
    appendIcon?: string;
    prependIcon?: string;
  }>();

  const emit = defineEmits<{
    (e: "click", item: any): void;
    (e: "click:remove", value: any): void;
  }>();
</script>

<template>
  <v-chip v-bind="props.item" :append-icon="appendIcon" :prepend-icon="prependIcon" closable @click:close.stop="(e) => emit('click:remove', item.value)" @click.stop="() => emit('click', item)">
    <slot></slot>
    {{ props.item.title }}
  </v-chip>
</template>
