<script setup lang="ts">
  import { useNetwork } from "@/composables/useNetwork";
  import { useRouter } from "@/router";
  import { onMounted } from "vue";
  const { isConnectedToApi } = useNetwork();
  const router = useRouter();

  onMounted(() => {
    if (isConnectedToApi.value) {
      router.push("/");
    }
  });
</script>

<template>
  <v-container class="mk-setup-failed">
    <div class="d-flex flex-column justify-center align-center">
      <v-empty-state class="mk-empty-state">
        <template #headline>
          <label class="text-display-large text-primary text-uppercase"> Failed to setup MediaKiwi </label>
        </template>
        <template #text>
          <label class="text-headline-small"> Failed to setup MediaKiwi properly. Please check the logs for more information. </label>
        </template>
      </v-empty-state>
      <div>
        <img src="@/assets/empty-state.svg" class="mt-8" />
      </div>
    </div>
  </v-container>
</template>

<style lang="scss" scoped>
  .mk-setup-failed {
    margin-top: 80px;
  }
</style>
