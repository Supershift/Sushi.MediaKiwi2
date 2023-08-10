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
  <v-navigation-drawer rail :rail-width="88" permanent>
    <v-list density="comfortable" open-strategy="list" nav class="pa-3">
      <v-list-item
        v-for="item in props.railItems || []"
        :key="item.id"
        class="ml-0 mr-0"
        :active="item.id == navigation.currentNavigationItem.value?.sectionId"
        rounded="xl"
        :value="item.name"
        @click.stop="onItemClick(item)"
      >
        <template #prepend>
          <v-icon v-if="item?.icon" @click.stop="onItemClick(item)">{{ parseIconValue(item.icon, mediakiwiStore.externalIcons) }}</v-icon>
        </template>
        <template #title>
          <label class="list-item-title">{{ item.name }}</label>
        </template>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<!-- Vuetify rail does not support text beneath the icon, therefore custom css is required -->
<style scoped lang="scss">
  @use "@/styles/abstracts/mixins" as *;
  .v-list {
    display: flex;
    flex-flow: column;
    align-items: center;
  }

  .v-list-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .list-item-title {
      @include typography("label", "small");
    }

    &--density-comfortable {
      &.v-list-item--one-line {
        height: 56px;
        width: 56px;
      }
    }

    &__prepend {
      > .v-icon {
        margin-inline-end: unset;
      }
    }
  }
</style>
