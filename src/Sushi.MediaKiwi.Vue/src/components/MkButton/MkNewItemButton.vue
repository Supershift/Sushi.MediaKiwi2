<script setup lang="ts">
  import { useNavigation } from "@/composables/useNavigation";
  import { useMediakiwiStore } from "@/stores";
  import { useI18next } from "@/composables/useI18next";
  import { IconsLibrary } from "@/models";

  // define properties
  const props = defineProps<{
    /** Id of the navigatin item to which the user is pushed when clicking a row. */
    navigationItemId?: string;
    /** label for the title  */
    newTitle?: string;
    /** Determines if we only want to emit instead of navigating to the given navigationItemId */
    newEmit?: boolean;
  }>();

  // inject dependencies
  const store = useMediakiwiStore();
  const navigation = useNavigation();
  const { defaultT } = await useI18next();

  // define events
  const emit = defineEmits<{
    (e: "click:new", value?: string): void;
  }>();

  function onNewClick() {
    if (props && props?.newEmit) {
      // emit event
      emit("click:new", props.navigationItemId);
    } else {
      // navigate user to target page if defined
      if (props.navigationItemId) {
        // push user to target page
        navigation.navigateToId(props.navigationItemId, undefined);
      }
    }
  }
</script>

<template>
  <v-btn-primary :prepend-icon="IconsLibrary.plus" @click="onNewClick">{{ props.newTitle ?? defaultT("New item") }}</v-btn-primary>
</template>
