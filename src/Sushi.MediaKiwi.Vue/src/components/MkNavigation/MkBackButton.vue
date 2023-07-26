<script setup lang="ts">
  import { useRouter } from "@/router";
  import { useNavigation } from "@/composables/useNavigation";

  const emit = defineEmits(["navigateBack"]);

  // inject dependencies
  const navigation = useNavigation();
  const router = useRouter();

  // We would need to check if there is something in the list of crumbs, otherwise just back
  function navigateBack() {
    // get current navigation item
    const currentItem = navigation.currentNavigationItem.value;

    // does it have a parent?
    if (currentItem?.parent) {
      // if so, then we can use the parent to navigate back
      router.push({ name: currentItem.parent.id.toString() });
    } else {
      // otherwise, just use the router back
      router.back();
    }

    emit("navigateBack");
  }
</script>
<template>
  <v-btn variant="tonal" @click="navigateBack()">
    <v-icon icon="$chevronLeft"></v-icon>
  </v-btn>
</template>
