<script setup lang="ts">
  import { PropType, ref } from "vue";
  import { IconsLibrary } from "@/models";

  const props = defineProps({
    uploads: {
      type: Array as PropType<File[]>,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    rules: {
      type: Array as PropType<unknown>,
      required: false,
      default: () => [],
    },
  });

  const fileUploads = ref<File[]>(props.uploads);
  // TODO: fiunish this
  function deleteChip(index: number) {
    // Open issue: https://github.com/vuetifyjs/vuetify/issues/18063
    // Also handy: https://github.com/vuetifyjs/vuetify/issues/7837 (but not working)
    fileUploads.value.splice(index, 1);
  }
</script>

<template>
  <v-file-input v-model="fileUploads" multiple :label="props.label" :rules="props.rules">
    <template #selection="{ fileNames }">
      <template v-for="(fileName, idx) in fileNames">
        <v-chip v-if="fileName" :key="fileName" size="small" label color="primary" closable>
          <template #close>
            <v-icon :icon="IconsLibrary.close" @click.stop="deleteChip(idx)"></v-icon>
          </template>
          {{ fileName }}
        </v-chip>
      </template>
    </template>
  </v-file-input>
</template>
