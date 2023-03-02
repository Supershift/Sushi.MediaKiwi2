<script lang="ts">
  import type { INavigationItem } from "@/models/navigation/INavigationItem";
  import { useNavigationStore } from "@/stores/navigation";
  import { computed, defineComponent, type PropType } from "vue";
  import { useRoute } from "vue-router";
  export default defineComponent({
    props:{
      navigationItem: {
        type: Object as PropType<INavigationItem>,
        required: true,
        default: () => {}
      },
      allItems: {
        type: Object as PropType<Array<INavigationItem>>,
        required: true,
        default: () => []
      }
    },
    setup(props){
      const route = useRoute();
      const routeName = route.name;

      const isActive = computed(() => routeName === props.navigationItem.name );

      const nameLabel = computed(() => props.navigationItem?.name ?? "-empty-")
      // called to send user to target screen
      function onItemClick(item: INavigationItem) {
        if (item && item?.screenId && item?.path) {
          useNavigationStore().NAVIGATE_TO(item.path, false);
        }
        return false;
      }
      const children = computed((): Array<INavigationItem> => {    
        const filtered = props.allItems.filter((x: INavigationItem) => {
          if (x && x?.parentNavigationItemId !== null) {
            return x?.parentNavigationItemId == props.navigationItem.id;
          }
        });
        return filtered ?? [];
      });
      return {
        isActive,
        routeName,
        children,
        nameLabel,
        onItemClick,
      }
    },
  })
</script>

<template>
  <v-list-group v-if="children.length > 0" :value="nameLabel">
    <template #activator="{ navigationItem }" :is-active="isActive">
      <v-list-item v-bind:active="navigationItem" :title="nameLabel" @click="navigationItem?.screenId != null ? onItemClick(navigationItem) : {}"></v-list-item>
    </template>
    <mk-navigation-item v-for="child in children" :navigation-item="child" :key="child.id" :all-items="allItems"></mk-navigation-item>
  </v-list-group>
  <v-list-item v-else :title="nameLabel" @click="navigationItem?.screenId != null ? onItemClick(navigationItem) : {}"> </v-list-item>
</template>
