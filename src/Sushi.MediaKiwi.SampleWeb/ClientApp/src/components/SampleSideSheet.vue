<script setup lang="ts">
  import { MkSideSheet } from "@supershift/mediakiwi-vue";
  import { ref } from "vue";

  const toggle = ref(false);
  function handleToggle() {
    toggle.value = !toggle.value;
  }
</script>
<template>
  <v-btn v-if="!toggle" class="ma-5 d-inline-block" variant="text" @click="handleToggle">Open Side Sheet</v-btn>
  <mk-side-sheet :model-value="toggle" :id-name="'mk-layout'" :width="'20vw'" @closed="handleToggle">
    <template #header> Home Sheet </template>
    <template #default>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ac turpis mollis, finibus dolor ut, blandit magna. Sed et nibh mollis, porta lorem at, placerat nibh. Sed faucibus ac justo
        quis suscipit. Quisque id ipsum ligula. Sed eros nibh, dapibus a imperdiet sit amet, condi
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ac turpis mollis, finibus dolor ut, blandit magna. Sed et nibh mollis, porta lorem at, placerat nibh. Sed faucibus ac justo
        quis suscipit. Quisque id ipsum ligula. Sed eros nibh, dapibus a imperdiet sit amet, condi
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ac turpis mollis, finibus dolor ut, blandit magna. Sed et nibh mollis, porta lorem at, placerat nibh. Sed faucibus ac justo
        quis suscipit. Quisque id ipsum ligula. Sed eros nibh, dapibus a imperdiet sit amet, condi
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ac turpis mollis, finibus dolor ut, blandit magna. Sed et nibh mollis, porta lorem at, placerat nibh. Sed faucibus ac justo
        quis suscipit. Quisque id ipsum ligula. Sed eros nibh, dapibus a imperdiet sit amet, condi
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ac turpis mollis, finibus dolor ut, blandit magna. Sed et nibh mollis, porta lorem at, placerat nibh. Sed faucibus ac justo
        quis suscipit. Quisque id ipsum ligula. Sed eros nibh, dapibus a imperdiet sit amet, condi
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ac turpis mollis, finibus dolor ut, blandit magna. Sed et nibh mollis, porta lorem at, placerat nibh. Sed faucibus ac justo
        quis suscipit. Quisque id ipsum ligula. Sed eros nibh, dapibus a imperdiet sit amet, condi
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ac turpis mollis, finibus dolor ut, blandit magna. Sed et nibh mollis, porta lorem at, placerat nibh. Sed faucibus ac justo
        quis suscipit. Quisque id ipsum ligula. Sed eros nibh, dapibus a imperdiet sit amet, condi
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ac turpis mollis, finibus dolor ut, blandit magna. Sed et nibh mollis, porta lorem at, placerat nibh. Sed faucibus ac justo
        quis suscipit. Quisque id ipsum ligula. Sed eros nibh, dapibus a imperdiet sit amet, condi
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ac turpis mollis, finibus dolor ut, blandit magna. Sed et nibh mollis, porta lorem at, placerat nibh. Sed faucibus ac justo
        quis suscipit. Quisque id ipsum ligula. Sed eros nibh, dapibus a imperdiet sit amet, condi
      </p>
    </template>
    <template #footer>
      <v-btn class="d-inline-block" variant="text">action 1</v-btn>
      <v-btn class="d-inline-block" variant="text">action 2</v-btn>
    </template>
  </mk-side-sheet>
</template>
