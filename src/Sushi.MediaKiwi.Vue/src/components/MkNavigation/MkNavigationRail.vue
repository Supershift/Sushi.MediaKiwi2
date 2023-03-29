<script setup lang="ts">
  import useMediaKiwiRouting from "@/composables/useMediaKiwiRouting";
  import type { Section } from "@/models/api";
  import { useRouter } from "vue-router";

  defineEmits(["change"]);
  const props = defineProps<{
    railItems: Array<Section>;
  }>();

  const { navigateTo } = useMediaKiwiRouting();
  const router = useRouter();

  function onItemClick(item: Section) {
    if (item) {
      navigateTo(router, item);
    }
    return false;
  }
</script>
<template>
  <v-navigation-drawer rail :rail-width="72" permanent>
    <v-list density="compact" open-strategy="list" nav>
      <v-list-item v-for="item in props.railItems || []" :key="item.id" :title="item.name" :value="item.name" @click.stop="onItemClick(item)">
        <template v-slot:prepend>
          <v-icon v-if="item?.icon" :icon="item?.icon" @click.stop="onItemClick(item)"></v-icon>
          <v-icon v-else icon="mdi-puzzle" @click.stop="onItemClick(item)"></v-icon>
        </template>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
