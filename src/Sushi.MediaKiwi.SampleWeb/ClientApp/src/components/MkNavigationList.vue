<script lang="ts">
  import type { INavigationItem } from "@/models/navigation/INavigationItem";
  import { computed, defineComponent, type PropType } from "vue";
  import MkNavigationItem from "./MkNavigationItem.vue";
  
  export default defineComponent({
    props:{
      navigationItems:{
          type: Object as PropType<Array<INavigationItem>>,
          required: true,
          default: () => []
      } 
    },
    setup(props){
      const parentItems = computed(() => {
        const filtered = props.navigationItems.filter((x: INavigationItem) => {
          if (x && x?.parentNavigationItemId == null) {
            return x;
          }
        });
        return filtered ?? [];
      });

      return {
        parentItems,
      }
    },
    components: {
      MkNavigationItem
    }
  })  
</script>

<template>    
  <v-list>
      <mk-navigation-item v-for="item in parentItems" :key="item.id" :navigation-item="item" :all-items="navigationItems"></mk-navigation-item>
  </v-list>
</template>
