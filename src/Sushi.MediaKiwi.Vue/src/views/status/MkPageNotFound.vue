<script setup lang="ts">
  import { useI18next } from "@/composables";
  import { useRouter } from "@/router";

  const router = useRouter();
  const { t } = await useI18next("MkPageNotFound");
</script>

<template>
  <v-container class="mk-page-not-found">
    <div class="d-flex flex-column justify-center align-center">
      <v-empty-state class="mk-empty-state">
        <template #headline>
          <label class="text-display-large text-primary text-uppercase"> {{ t("PageNotFoundTitle", "404 error") }} </label>
        </template>
        <template #text>
          <label class="text-headline-small">
            {{ t("PageNotFoundMessage", "The page you were looking for appears to have been (re)moved or does not exist") }}
          </label>
        </template>
        <template #actions>
          <v-btn variant="flat" color="primary" @click="router.back()" class="text-none">
            {{ t("GoBack", "Go back") }}
          </v-btn>
        </template>
      </v-empty-state>
      <div>
        <img src="@/assets/empty-state.svg" class="mt-8" />
      </div>
    </div>
  </v-container>
</template>

<style lang="scss" scoped>
  .mk-page-not-found {
    margin-top: 80px;
  }
</style>
