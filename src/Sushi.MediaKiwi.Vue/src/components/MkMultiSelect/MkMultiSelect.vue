<script setup lang="ts">
  import { IconsLibrary } from "@/models";
  import { PropType, ref, onMounted } from "vue";
  import { ValidationRules } from "vuetify/composables";

  // define props
  const definedProps = defineProps({
    /** base model  */
    modelValue: {
      type: Array as PropType<unknown[]> | string as PropType<unknown> | null,
      required: true,
    },
    /** determines if the select is multi-select  */
    multiple: {
      type: Boolean,
      default: false,
    },
    /** label */
    label: {
      type: String,
      default: "",
    },
    /** option items */
    items: {
      type: Array as PropType<unknown[]>,
      default: () => [],
    },
    /** validation rules */
    rules: {
      type: Array as PropType<ValidationRules[]>,
      required: false,
      default: () => [],
    },
    /** determines if the input is disabled */
    disabled: {
      type: Boolean,
      default: false,
    },
  });

  const modelInstance = ref();

  onMounted(() => {
    modelInstance.value = definedProps.modelValue;
  });
</script>
<template>
  <template v-if="multiple">
    <v-select
      v-model="modelInstance"
      :disabled="definedProps.disabled"
      :label="definedProps.label"
      :items="definedProps.items"
      :rules="definedProps.rules"
      clearable
      multiple
      chips
      closable-chips
    >
      <template #item="{ item, props }">
        <v-list-item v-if="item && props" v-bind="props">
          <template #prepend="{ isActive }">
            <v-list-item-action>
              <v-icon :icon="isActive ? IconsLibrary.checkboxMarked : IconsLibrary.checkboxBlankOutline"></v-icon>
            </v-list-item-action>
          </template>
        </v-list-item>
      </template>
    </v-select>
  </template>
  <template v-else>
    <v-select
      v-model:model-value="modelInstance"
      :label="definedProps.label"
      :disabled="definedProps.disabled"
      :rules="definedProps.rules"
      :items="definedProps.items"
    ></v-select>
  </template>
</template>
