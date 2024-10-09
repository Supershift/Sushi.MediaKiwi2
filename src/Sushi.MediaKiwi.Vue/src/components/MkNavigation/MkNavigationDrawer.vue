<script setup lang="ts">
  import MkNavigationItem from "@/components/MkNavigation/MkNavigationItem.vue";
  import { useMediakiwiStore } from "@/stores";
  import { useNavigation } from "@/composables/useNavigation";
  import { useI18next } from "@/composables/useI18next";
  import { IconsLibrary } from "@/models";
  import { useRouter } from "@/router";

  defineEmits(["change"]);

  const { getItemsBasedOnRoot, navigateTo, currentRootItem } = useNavigation(); // also calls store within this composable
  const { defaultT } = await useI18next();
  const router = useRouter();
  const store = useMediakiwiStore();

  const navigate = (item: any) => {
    if (store.navigationBackUrlOverwrite) {
      const overwrite = store.navigationBackUrlOverwrite;
      store.navigationBackUrlOverwrite = undefined;

      router.push(overwrite);
    } else {
      navigateTo(item);
    }
  };
</script>
<template>
  <v-navigation-drawer class="pa-3">
    <v-list open-strategy="single" class="pa-0">
      <v-list-item
        v-if="currentRootItem"
        :title="currentRootItem.name"
        exact
        rounded="pill"
        class="mb-2"
        :prepend-icon="IconsLibrary.arrowLeft"
        @click.stop="navigate(currentRootItem)"
      />

      <div id="navigationDrawerInfo" class="mb-4"></div>

      <mk-navigation-item
        v-for="item in getItemsBasedOnRoot()"
        :key="item.id"
        :navigation-item="item"        
      ></mk-navigation-item>
    </v-list>
  </v-navigation-drawer>
</template>
<style scoped lang="scss">
  #navigationDrawerInfo {
    &:empty {
      display: none;
    }
  }
</style>
