<script setup lang="ts">
  import { useI18next } from "@/composables";
  import { computed } from "vue";

  const { defaultT } = await useI18next();

  const props = withDefaults(
    defineProps<{
      label?: string | null;
      value?: string;
      valueClass?: string;
      divider?: boolean | string;
    }>(),
    {
      label: undefined,
      value: undefined,
      divider: false,
      valueClass: "",
    }
  );

  const dividerColor = computed(() => (typeof props.divider === "boolean" ? "neutral" : props.divider));

  const slots = defineSlots<{
    label?: () => void;
    value?: () => void;
    append?: () => void;
  }>();

  const value = computed(() => {
    return props.value || defaultT.value("NotAvailable", "N/A");
  });

  const valueClasses = computed(() => {
    return {
      [props.valueClass || ""]: true,
    };
  });

  const cardWidthClass = computed(() => {
    return slots?.append ? "w-50" : "";
  });
</script>

<template>
  <div class="my-4">
    <div class="d-flex flex-row form-card-label" v-bind="$attrs">
      <div class="d-flex flex-column ga-2 overflow-auto w-100" :class="cardWidthClass" v-bind="$attrs">
        <v-label v-if="slots.label || props.label" class="text-label-small text-uppercase text-truncate">
          <slot v-if="slots.label" name="label"></slot>
          <template v-else>
            {{ props.label }}
          </template>
        </v-label>
        <v-label class="text-body-medium text-truncate opacity-100 d-inline-block w-100" :class="valueClasses">
          <slot v-if="slots?.value" name="value"></slot>
          <template v-else>
            {{ value }}
          </template>
        </v-label>
      </div>
      <div v-if="slots.append">
        <slot name="append"></slot>
      </div>
    </div>
    <v-divider v-if="divider" class="mt-4" :color="dividerColor" />
  </div>
</template>
