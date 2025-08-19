<script setup lang="ts">
  import { computed, onMounted } from "vue";
  import { useNavigation } from "@/composables/useNavigation";
  import { NavigationItem } from "@/models/navigation";

  const props = defineProps<{
    navigationItem: NavigationItem;
  }>();

  const navigation = useNavigation();
  const opened = defineModel("opened", {
    type: Array as () => string[],
    default: () => [],
  });

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

  onMounted(() => {
    // Add the current item to the opened list if it is active
    if (isActive.value && !opened.value.includes(props.navigationItem.name)) {
      opened.value.push(props.navigationItem.name);
    }
  });
</script>

<template>
  <v-list-group v-if="children.length > 0" :value="navigationItem.name">
    <template #activator="{ props: groupProps }">
      <v-tooltip v-if="!navigationItem.isHidden" location="right bottom" :disabled="!navigationItem.tooltip">
        <template #activator="{ props: tooltipProps }">
          <span v-bind="tooltipProps">
            <v-list-item
              v-bind="groupProps"
              :exact="true"
              :active="isActive"
              :title="navigationItem.name"
              rounded="pill"
              class="mk-navigation-item mb-2"
              :prepend-icon="icon"
              @click.stop="hasScreen(navigationItem) ? onItemClick(navigationItem) : {}"
              :disabled="navigationItem.isDisabled"
            />
          </span>
        </template>
        <span v-if="navigationItem.tooltip"> {{ navigationItem.tooltip }}</span>
      </v-tooltip>
    </template>

    <mk-navigation-item v-for="child in children" :key="child.id" :navigation-item="child" />
  </v-list-group>
  <v-tooltip v-else-if="!navigationItem.isHidden" location="right bottom" :disabled="!navigationItem.tooltip">
    <template #activator="{ props: tooltipProps }">
      <span v-bind="tooltipProps">
        <v-list-item
          :active="isActive"
          :title="navigationItem.name"
          :exact="true"
          rounded="pill"
          class="mk-navigation-item mb-2"
          :prepend-icon="icon"
          @click.stop="hasScreen(navigationItem) ? onItemClick(navigationItem) : {}"
          :disabled="navigationItem.isDisabled"
        />
      </span>
    </template>
    <span v-if="navigationItem.tooltip"> {{ navigationItem.tooltip }}</span>
  </v-tooltip>
  <v-divider v-if="navigationItem.appendDivider" class="mb-2" />
</template>
<style lang="scss">
  /** Used to override the spacing for icons vuetify that ships with */
  .mk-navigation-item > .v-list-item__prepend > .v-icon {
    margin-inline-end: 12px;
  }
</style>
