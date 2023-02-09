<script setup lang="ts">
import { defineAsyncComponent, PropType } from "vue";

interface MkIScreen {
  componentFileName: string;
}

const props = defineProps({
  currentScreen: Object as PropType<MkIScreen>,
});

function loadScreen(myScreen: MkIScreen | undefined) {
  if (myScreen !== undefined) {
    return defineAsyncComponent(
      () =>
        import(/* @vite-ignore */ `../components/${myScreen.componentFileName}`)
    );
  }
}
</script>

<template>
  <v-main style="min-height: 300px">
    <component :is="loadScreen(props.currentScreen)"></component>
  </v-main>
</template>
