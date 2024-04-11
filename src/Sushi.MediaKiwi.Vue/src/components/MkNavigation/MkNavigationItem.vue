<script setup lang="ts">
  import type { NavigationItem } from "@/models/api/NavigationItem";
  import { ref, computed } from "vue";
  import { useNavigation } from "@/composables/useNavigation";

  const componentProps = defineProps<{
    navigationItem: NavigationItem;
    allItems: Array<NavigationItem>;
  }>();

  const navigation = useNavigation();

  const groupOpened = ref(false);
  const children = navigation.getChildren(componentProps.navigationItem);

  const icon = computed(() => {
    if (componentProps.navigationItem?.icon) {
      return componentProps.navigationItem.icon;
    }
    return undefined;
  });

  // determine if navigation item has a screen
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

  // determine if navigation item is active
  const isActive = computed(() => navigation.determineIfNavigationItemIsActive(componentProps.navigationItem));
</script>

<template>
  <v-list-group v-if="children.length > 0" v-model="groupOpened" :value="navigationItem.name">
    <template #activator="{ props }">
      <v-list-item
        v-bind="props"
        :exact="true"
        :active="isActive"
        :title="navigationItem.name"
        rounded="pill"
        class="mk-navigation-item mb-2"
        :prepend-icon="icon"
        @click.stop="hasScreen(navigationItem) ? onItemClick(navigationItem) : {}"
      />
    </template>
    <mk-navigation-item v-for="child in children" :key="child.id" :navigation-item="child" :all-items="allItems" />
  </v-list-group>
  <v-list-item
    v-else
    :active="isActive"
    :title="navigationItem.name"
    :exact="true"
    rounded="pill"
    class="mk-navigation-item mb-2"
    :prepend-icon="icon"
    @click.stop="hasScreen(navigationItem) ? onItemClick(navigationItem) : {}"
  />
</template>
<style lang="scss">
  /** Used to override the spacing for icons vuetify that ships with */
  .mk-navigation-item > .v-list-item__prepend > .v-icon {
    margin-inline-end: 12px;
  }
</style>
