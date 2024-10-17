<script lang="ts" setup></script>
<template>
  <h1 class="mb-4">I'm a custom layout!</h1>
  <div class="d-flex jsutify-space-between">
    <div class="custom-box">
      <slot />
    </div>
    <div>
      <v-card class="pa-5" color="secondary">
        <v-card-title>Custom Card</v-card-title>
        <v-card-text>
          <p>This is a custom card that is part of the custom layout.</p>
          <p>We might put some instructions here...</p>
          <p>Anything really</p>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .custom-box {
    max-width: 592px;
  }
</style>
