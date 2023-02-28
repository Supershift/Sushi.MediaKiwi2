<script lang="ts">
  import type { INavigationItem } from "@/models/navigation/INavigationItem";
  import { useNavigationStore } from "@/stores/navigation";
  import { computed, defineComponent, type PropType } from "vue";

  export default defineComponent({
    setup(){
      const navigationStore = useNavigationStore();
      navigationStore.GET_NAVIGATION();
      const navList = computed(() => navigationStore.navigationList);

        // called to send user to target screen
      function onItemClick(navigationItem: INavigationItem) {
        if (navigationItem && navigationItem?.screenId && navigationItem?.path) {
          navigationStore.NAVIGATE_TO(navigationItem.path, false);
        }
        return false;
      }
      // FIXME: I need to load all the child components!
      function childItems(navigationItem: INavigationItem): Array<INavigationItem>{    
        const filtered = navList.value.filter((item: INavigationItem) => {
          if (item && item.parentNavigationItemId) {
            return item?.parentNavigationItemId == navigationItem.id
          }
          return [];
        });
        // console.log(navList.value);
        
        return filtered;
      }
      return {
        navigationStore,
        navList,
        onItemClick,
        childItems
      }
    }, 
    props:{
      navigationItem: {
        type: Object as PropType<INavigationItem>,
        requeired: true,
        default: () => {}
      }
    }
  })
</script>

<template>
  <v-list-group v-if="childItems(navigationItem).length > 0" :value="navigationItem.name">
    <template #activator="{ navigationItem }">
      <v-list-item v-bind:active="navigationItem" :title="navigationItem.name" @click="navigationItem?.screenId != null ? onItemClick(navigationItem) : {}"></v-list-item>
    </template>
    <mk-navigation-item v-for="child in childItems(navigationItem)" :navigation-item="child"></mk-navigation-item>
  </v-list-group>
  <v-list-item v-else :title="navigationItem.name ??  ''" @click="navigationItem?.screenId != null ? onItemClick(navigationItem) : {}"> </v-list-item>
</template>
