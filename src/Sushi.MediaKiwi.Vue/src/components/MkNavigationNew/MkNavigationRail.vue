<script setup lang="ts">
  import type ISection from '@/models/section/ISection';
  import { useNavigationStore } from '@/stores/navigation';
  import { useRoute, useRouter } from 'vue-router';


  defineEmits(["change"]);
  const props = defineProps<{
    railItems: Array<ISection>;
  }>();

  const navigationStore = useNavigationStore();

  function onItemClick(item: ISection){
    if (item) {
      navigationStore.NAVIGATE_TO(item.name, true);
    }
    return false;
  }
</script>
<template>
  <v-navigation-drawer rail :rail-width="72" permanent>
      <v-list density="compact" open-strategy="list" nav>
        <v-list-item v-for="item in props.railItems || []" :key="item.id" :title="item.name" :value="item.name" @click="onItemClick(item)">
          <template v-slot:prepend>
            <v-icon v-if="item?.icon" :icon="item?.icon"></v-icon>
            <v-icon v-else icon="mdi-puzzle"></v-icon>
          </template>
        </v-list-item>
      </v-list>
  </v-navigation-drawer>
</template>