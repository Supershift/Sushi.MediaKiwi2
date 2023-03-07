<script setup lang="ts">
  import useMediaKiwiRouting from '@/composables/useMediaKiwiRouting';
  import type ISection from '@/models/section/ISection';
  import { useRouter } from 'vue-router';
  // import { useRouter } from '@/router';


  defineEmits(["change"]);
  const props = defineProps<{
    railItems: Array<ISection>;
  }>();

const { NavigateToScreen } = useMediaKiwiRouting();
const router = useRouter();
function onItemClick(item: ISection){
  if (item) {
    NavigateToScreen(router, item.id, true)
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