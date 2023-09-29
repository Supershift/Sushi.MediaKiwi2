<script setup lang="ts">
  import { PropType, ref } from "vue";
  import { IconsLibrary } from "@/models";
  import { useFormFields } from "@/composables";
  const props = defineProps({
    /** files array to upload */
    uploads: {
      type: Array as PropType<File[]>,
      required: true,
    },
    /** label used as placeholder and label  */
    label: {
      type: String,
      required: true,
    },
    /** rules array for validation */
    rules: {
      type: Array as PropType<unknown>,
      required: false,
      default: () => [],
    },
    /** determines if we use the multiple "chips" variant or single string variant of the input */
    multiple: {
      type: Boolean,
      required: false,
      default: false,
    },
    /** shows the file sizes */
    showSize: {
      type: Boolean,
      required: false,
      default: false,
    },
    /** loading bar is shown when true */
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
  });

  const fileUploads = ref<File[]>(props.uploads);

  const { deleteChip } = useFormFields();
</script>

<template>
  <template v-if="multiple">
    <v-file-input v-model="fileUploads" multiple :label="props.label" :rules="props.rules" :show-size="showSize" :loading="loading" chips>
      <template #selection="{ fileNames }">
        <template v-for="(fileName, idx) in fileNames">
          <v-chip v-if="fileName" :key="fileName" size="small" label color="primary" closable>
            <template #close>
              <v-icon :icon="IconsLibrary.close" @click.stop="deleteChip(idx, fileUploads)"></v-icon>
            </template>
            {{ fileName }}
          </v-chip>
        </template>
      </template>
    </v-file-input>
  </template>
  <template v-else>
    <v-file-input v-model="fileUploads" label="Hotel blueprint" :rules="props.rules" :show-size="showSize" :loading="loading"></v-file-input>
  </template>
</template>
<style lang="scss">
  .v-file-input {
    &--mediakiwi {
      .v-field {
        &__overlay {
          display: none;
        }
        &__input {
          z-index: 3;
        }
      }
    }
  }
</style>
