<script setup lang="ts">
  import { ColorMap } from "@/models/color/ColorMap";
  import { computed } from "vue";

  const props = defineProps<{
    color: ColorMap;
    contrastColor?: ColorMap;
  }>();

  const styles = computed(() => {
    return {
      backgroundColor: `${props.color.value} !important`,
      ...(props.contrastColor && { color: `${props.contrastColor.value} !important` }),
    };
  });
</script>

<template>
  <div class="color-block" :style="styles">
    <div>
      <label class="d-block text-title-medium"> {{ color.key }}</label>
      <label class="d-block text-body-small"> {{ color.value }}</label>
    </div>
    <div v-if="contrastColor" class="text-right">
      <label class="d-block text-title-medium"> {{ contrastColor.key }}</label>
      <label class="d-block text-body-small"> {{ contrastColor.value }}</label>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .color-block {
    height: 145px;
    min-width: calc(100% / 5);
    flex: 1;

    p {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
</style>
