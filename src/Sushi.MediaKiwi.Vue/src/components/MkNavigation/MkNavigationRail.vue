<script setup lang="ts">
  import type { Section } from "@/models/navigation";
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
  function isActive(item: Section) {
    return navigation.determineIfSectionIsActive(item);
  }
</script>
<template>
  <!-- VNavigationRail is an alias for VNavigationDrawer set in the GlobalConfiguration with the rail prop set to true -->
  <v-navigation-rail :rail-width="88" permanent>
    <v-list density="comfortable" open-strategy="list" nav class="pa-3">
      <template v-for="item in props.railItems || []">
        <v-tooltip location="right bottom" :disabled="!item.tooltip">
          <template #activator="{ props }">
            <span v-bind="props">
              <v-list-item
                :key="item.id"
                class="ml-0 mr-0"
                :active="isActive(item)"
                rounded="lg"
                :value="item.name"
                @click.stop="onItemClick(item)"
                :disabled="item.displayState === 'disabled'"
              >
                <template #prepend>
                  <v-icon v-if="item?.icon" @click.stop="onItemClick(item)">{{ parseIconValue(item.icon, mediakiwiStore.externalIcons) }}</v-icon>
                </template>
                <template #title>
                  <label class="list-item-title">{{ item.name }}</label>
                </template>
              </v-list-item>
            </span>
          </template>
          <span v-if="item.tooltip"> {{ item.tooltip }}</span>
        </v-tooltip>
      </template>
    </v-list>
  </v-navigation-rail>
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
