<script lang="ts" setup>
  import { computed } from "vue";
  import { useI18next } from "@/composables";
  import { useClipboard } from "@vueuse/core";

  const { t } = await useI18next("CopyButton");
  const { copy, copied } = useClipboard();

  const props = withDefaults(
    defineProps<{
      value: any;
      wght?: number;
      btnTextClasses?: string;
    }>(),
    {
      wght: 300,
    }
  );

  const slots = defineSlots<{
    default?: () => any;
  }>();

  const containerClasses = computed(() => {
    return {
      "d-flex": !!slots.default,
      "justify-center": !!slots.default,
      "align-center": !!slots.default,
    };
  });
</script>
<template>
  <span class="copy-button-container" :class="containerClasses">
    <span v-if="slots.default" class="copy-button-text text-truncate" :class="props.btnTextClasses">
      <slot name="default"></slot>
    </span>
    <v-btn v-bind="props && $attrs" class="v-btn--icon copy-button" density="comfortable" rounded="xl" @click.stop="copy(value)">
      <v-icon icon="$copy" v-bind="$attrs" :wght="wght"></v-icon>
    </v-btn>
    <v-tooltip v-model="copied" location="top" :open-on-hover="false">
      <template #activator="{ props }">
        <div v-bind="props"></div>
      </template>
      <span>{{ t("Copied") }}</span>
    </v-tooltip>
  </span>
</template>
<style lang="scss" scoped>
  .copy-button-container {
    display: inline-block;
  }

  .copy-button-text {
    flex: 1;
  }

  .copy-button {
    font-size: var(--v-btn-size) !important;
    line-height: normal !important;
    color: rgb(var(--v-theme-on-surface)) !important;
    transform: scale(75%);
    padding: 5px 6px !important;
  }
</style>
