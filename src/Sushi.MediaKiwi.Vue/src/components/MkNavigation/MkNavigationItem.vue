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

  const prependIcon = computed(() => {
    if (props.navigationItem.prependIcon) {
      return props.navigationItem.prependIcon;
    }
    return "";
  });

  const appendIcon = computed(() => {
    if (props.navigationItem.appendIcon) {
      return props.navigationItem.appendIcon;
    }
    return "";
  });

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
    const currentItem = navigation.currentNavigationItem.value;
    const currentParent = currentItem?.parent;
    if (!currentItem) return false;

    // if the provided navigation item is the same as the current navigation item, then it is active
    // or if the provided navigation item is the ONLY child of the current navigation item that 'has item navigation', and points to a view, then it is active
    const result =
      currentItem.id === props.navigationItem.id ||
      (currentParent?.id === props.navigationItem.id &&
        props.navigationItem.hasItemNavigation &&
        props.navigationItem.view &&
        props.navigationItem.children?.length === 1);

    return result === true;
  });
</script>

<template>
  <v-list-group v-if="children.length > 0" v-model="groupOpened" :value="navigationItem.name">
    <template #activator="{ props }">
      <v-list-item
        v-bind="props"
        :prepend-icon="prependIcon"
        :exact="true"
        :active="isActive"
        :title="navigationItem.name"
        rounded="pill"
        class="mb-2"
        @click.stop="hasScreen(navigationItem) ? onItemClick(navigationItem) : {}"
      />
    </template>
    <mk-navigation-item v-for="child in children" :key="child.id" :navigation-item="child" :all-items="allItems" />
  </v-list-group>
  <v-list-item
    v-else
    :prepend-icon="prependIcon"
    :append-icon="appendIcon"
    :active="isActive"
    :title="navigationItem.name"
    :exact="true"
    rounded="pill"
    class="mb-2"
    @click.stop="hasScreen(navigationItem) ? onItemClick(navigationItem) : {}"
  />
</template>
