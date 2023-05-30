<script setup lang="ts">
  import { useI18next } from "@/composables";
  import { MoneyValue } from "@/models";
  import { computed, ref } from "vue";

  // define properties and events
  const props = defineProps<{
    /** An array of strings used for setting currency selection. If left empty, defaults to all currencies supported by Intl API. */
    currencies?: string[];
    label: string;
    modelValue?: MoneyValue;
  }>();

  const emit = defineEmits<{
    (e: "update:modelValue", value?: MoneyValue): void;
  }>();

  // inject dependencies
  const { t } = useI18next();

  // define reactive variables
  const currencies = computed<string[]>(() => props.currencies || Intl.supportedValuesOf("currency"));
  const currencyInputDisabled = computed(() => currencies.value.length <= 1);
  const currency = ref(props.modelValue?.currency);
  const amount = ref(props.modelValue?.amount);

  // if only one currency is available, set it as default
  if (currencies.value.length === 1) {
    currency.value = currencies.value[0];
  }

  // define functions
  function currencyUpdated(e: string) {
    // set input currency on model
    currency.value = e;

    // emit model
    emitModelValue();
  }

  function amountUpdated(e: string) {
    // try to parse input to a number
    let inputAmount: number | undefined = undefined;
    if (e) inputAmount = Number(e);

    // set input amount on model
    amount.value = inputAmount;

    // emit model
    emitModelValue();
  }

  function emitModelValue() {
    // if both currency and amount are correctly set, emit the model value
    // otherwise emit undefined
    if (currency.value && amount.value) {
      emit("update:modelValue", { currency: currency.value, amount: amount.value });
    } else {
      emit("update:modelValue", undefined);
    }
  }
</script>
<template>
  <v-input>
    {{ label }}
    <v-autocomplete
      :model-value="currency"
      @update:model-value="currencyUpdated"
      :items="currencies"
      :label="t('Currency')"
      clearable
      :disabled="currencyInputDisabled"
    ></v-autocomplete>
    <v-text-field :model-value="amount" @update:model-value="amountUpdated" type="number" :label="t('Amount')"></v-text-field>
  </v-input>
</template>
