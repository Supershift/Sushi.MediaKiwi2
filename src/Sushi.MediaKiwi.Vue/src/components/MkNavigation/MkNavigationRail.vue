<script setup lang="ts">
  import type { Section } from "@/models/api";
  import { useNavigation } from "@/composables/useNavigation";
  import { parseIconValue } from "@/composables";
  import { useMediakiwiStore } from "@/stores";

  defineEmits(["change"]);
  const props = defineProps<{
    railItems: Array<Section>;
  }>();

  const navigation = useNavigation();
  const mediakiwiStore = useMediakiwiStore();

  function onItemClick(item: Section) {
    if (item) {
      navigation.navigateTo(item);
    }
    return false;
  }
</script>
<template>
  <v-navigation-drawer rail :rail-width="80" permanent>
    <v-list density="compact" open-strategy="list" nav>
      <v-list-item
        v-for="item in props.railItems || []"
        :key="item.id"
        :active="item.id == navigation.currentNavigationItem.value?.sectionId"
        :title="item.name"
        :value="item.name"
        @click.stop="onItemClick(item)"
      >
        <template #prepend>
          <v-icon v-if="item?.icon" @click.stop="onItemClick(item)">{{ parseIconValue(item.icon, mediakiwiStore.externalIcons) }}</v-icon>
        </template>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<!-- Vuetify rail does not support text beneath the icon, therefore custom css is required -->
<style scoped lang="scss">
  .v-list-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    &__prepend {
      > .v-icon {
        margin-inline-end: unset;
      }
    }
  }
</style>
