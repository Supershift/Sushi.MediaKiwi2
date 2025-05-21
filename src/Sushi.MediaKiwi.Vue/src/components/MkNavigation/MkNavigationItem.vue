<script setup lang="ts">
  import { ref, computed } from "vue";
  import { useNavigation } from "@/composables/useNavigation";
  import { NavigationItem } from "@/models/navigation";

  const props = defineProps<{
    navigationItem: NavigationItem;
  }>();

  const navigation = useNavigation();

  const groupOpened = ref(false);

  const icon = computed(() => {
    if (props.navigationItem?.icon) {
      return props.navigationItem.icon;
    }
    return undefined;
  });

  // determine if navigation item has a screen
  function hasScreen(item: NavigationItem): boolean {
    if (item?.componentKey) {
      return true;
    }
    return false;
  }

  // called to send user to target screen
  function onItemClick(item: NavigationItem) {
    if (item.componentKey) {
      navigation.navigateTo(item);
    }
    return false;
  }

  // determine if navigation item is active
  const isActive = computed(() => navigation.determineIfNavigationItemIsActive(props.navigationItem));

  // get all children we want to render (exclude children with parameters)
  const children = computed(() => props.navigationItem.children.filter((x) => !x.parameterName || x.parent?.isGroup));
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
    <mk-navigation-item v-for="child in children" :key="child.id" :navigation-item="child" />
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
  <v-divider v-if="navigationItem.appendDivider" class="mb-2" />
</template>
<style lang="scss">
  /** Used to override the spacing for icons vuetify that ships with */
  .mk-navigation-item > .v-list-item__prepend > .v-icon {
    margin-inline-end: 12px;
  }
</style>
