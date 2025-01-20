<script setup lang="ts">
  import MkDialogCard from "../MkDialog/MkDialogCard.vue";
  import { ref } from "vue";
  import { useI18next, useDayjs } from "@/composables";
  import { useLocale } from "vuetify";
  // inject dependencies
  const { i18next, defaultT, t, formatDateTimeGeneric } = await useI18next("MkDatePicker");
  const { current } = useLocale();
  const { inConfiguredTimeZone } = useDayjs();
  // TODO There needs to be a better way to set the locale through the custom i18n plugin
  current.value = i18next.value.language;

  const props = withDefaults(
    defineProps<{
      /** Allow the selection of multiple dates */
      multiple?: boolean;
      /** Max amount of dates that should be selected */
      multipleAmount?: number;
      title?: string;
    }>(),
    {
      multiple: false,
      multipleAmount: 2,
    }
  );

  const modelValue = defineModel<Array<any>>({ required: true });

  const emit = defineEmits<{
    (e: "click:close"): void;
  }>();

  // Create proxy model to prevent direct mutation
  const model = ref(modelValue.value.map((e) => new Date(e))); // transform strings to Date so vuetify can work with it

  function close() {
    emit("click:close");
  }

  function apply() {
    // set the model with dates that match the users configured time zone
    modelValue.value = model.value.map((e) => inConfiguredTimeZone(e));
    close();
  }

  function validateModel() {
    // Multiple allows for multiple dates to be selected
    if (props.multiple && model.value.length > props.multipleAmount) {
      // Remove the first 2 items from the collection
      // maintaining the last chosen item
      const items = [...model.value];
      items.splice(0, 2);

      // Assign it back to the model
      model.value = items;
    }

    // When the model is not an array, make it an array
    if (!Array.isArray(model.value)) {
      model.value = [model.value];
    }
  }
</script>

<template>
  <MkDialogCard hide-header remove-content-padding content-classes="py-2" v-bind="$attrs" @click:close="close">
    <template #default>
      <v-date-picker v-model="model" :multiple="multiple" :title="title || t('DatePickerTitle', 'Select date').toString()" @update:model-value="validateModel">
        <template #header>
          <div class="v-date-picker-header">
            <div class="v-date-picker-header__content">
              <template v-if="!model || model.length === 0">
                {{ t("DatePickerHeader", "Enter Date") }}
              </template>
              <template v-else-if="model.length === 1">
                {{ formatDateTimeGeneric(model[0], { dateStyle: "medium" }) }}
              </template>
              <template v-else> {{ model.length }} {{ defaultT("Selected") }}</template>
            </div>
          </div>
        </template>
      </v-date-picker>
    </template>
    <template #actions>
      <v-btn @click="apply">{{ defaultT("Apply") }}</v-btn>
    </template>
  </MkDialogCard>
</template>
