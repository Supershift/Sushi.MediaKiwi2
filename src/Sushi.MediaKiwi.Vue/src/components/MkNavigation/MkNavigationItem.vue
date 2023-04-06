<script setup lang="ts">
  import type { NavigationItem } from "@/models/api/NavigationItem";
  import { ref, computed } from "vue";
  import { useNavigation } from "@/composables/useNavigation";

  const props = defineProps<{
    navigationItem: NavigationItem;
    allItems: Array<NavigationItem>;
  }>();

  const navigation = useNavigation();

  const groupOpened = ref(false);
  const children = navigation.getChildren(props.navigationItem);

  function hasScreen(item: NavigationItem): boolean {
    if (item?.viewId) {
      return true;
    }
    return false;
  }

  // called to send user to target screen
  function onItemClick(item: NavigationItem) {
    if (item.viewId) {
      navigation.navigateTo(item);
    }
    return false;
  }

  const isActive = computed(() => {
    return navigation.currentNavigationItem.value?.leaf?.id == props.navigationItem.id;
  });
</script>

<template>
  <v-list-group v-if="children.length > 0" v-model="groupOpened" :value="navigationItem.name">
    <template #activator="{ props }">
      <v-list-item
        v-bind="props"
        :exact="true"
        :active="isActive"
        :active-class="'active-list-item'"
        :title="navigationItem.name"
        @click.stop="hasScreen(navigationItem) ? onItemClick(navigationItem) : {}"
      />
    </template>
    <mk-navigation-item v-for="child in children" :key="child.id" :navigation-item="child" :all-items="allItems" />
  </v-list-group>
  <v-list-item v-else :active="isActive" :title="navigationItem.name" :exact="true" :active-class="'active-list-item'" @click.stop="hasScreen(navigationItem) ? onItemClick(navigationItem) : {}" />
</template>

<style lang="css">
  .active-list-item {
    background-color: rgb(86, 86, 86, 0.2);
  }
</style>
