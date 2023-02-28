<script setup lang="ts">
import type ISection from '@/models/section/ISection';
import { store } from '@/stores/mediakiwi/mock';
import { useNavigationStore } from '@/stores/navigation';
import { computed } from 'vue';

defineEmits(["change"]);

const navigationStore = useNavigationStore();
navigationStore.GET_NAVIGATION();

const railItems = computed(() => store.sections.filter((item) => item));

function onItemClick(item: ISection){
  if (item) {
    navigationStore.NAVIGATE_TO(item.name, true);
  }
  return false;
}
</script>
<template>
<v-navigation-drawer :rail="true" :rail-width="72" permanent>
    <v-list density="compact" open-strategy="list" nav>
      <v-list-item v-for="item in railItems" :prepend-icon="item.icon" :title="item.name" :value="item.name" @click="onItemClick(item)"></v-list-item>
    </v-list>
</v-navigation-drawer>
</template>