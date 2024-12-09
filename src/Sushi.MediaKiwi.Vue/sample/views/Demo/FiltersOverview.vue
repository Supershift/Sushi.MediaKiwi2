<script setup lang="ts">
  import { ListResult, TableFilter, TableFilterItem, TableFilterType, TableFilterValue } from "@/models";
  import { MkTable } from "@/components";
  import { computed, ref } from "vue";
  import { useValidationRules } from "@/composables";

  const { email } = await useValidationRules();

  // define filters
  const filters = ref<TableFilter>({
    datePicker: {
      title: "Date Picker",
      type: TableFilterType.DatePicker,
    },
    datePickerRange: {
      title: "Date Picker Range",
      type: TableFilterType.DateRange,
      divider: true,
    },
    contains: {
      title: "Contains",
      type: TableFilterType.Contains,
      intro: "Find Something",
      searchable: true,
    },
    email: {
      title: "Custom Text (E-mail)",
      type: TableFilterType.TextField,
      divider: true,
      rules: [email],
    },
    singleSelectZero: {
      title: "Single Select (Zero)",
      type: TableFilterType.SingleSelect,
    },
    singleSelectOne: {
      title: "Single Select (One)",
      type: TableFilterType.SingleSelect,
      options: [{ title: "Option 1", value: "option1" }],
    },
    singleSelectFew: {
      title: "Single Select (Few)",
      type: TableFilterType.SingleSelect,
      options: [
        { title: "Option 1", value: "option1" },
        { title: "Option 2", value: "option2" },
        { title: "Option 3", value: "option3" },
      ],
    },
    singleSelectMore: {
      title: "Single Select (More)",
      type: TableFilterType.SingleSelect,
      options: [
        { title: "Option 1", value: "option1" },
        { title: "Option 2", value: "option2" },
        { title: "Option 3", value: "option3" },
        { title: "Option 4", value: "option4" },
        { title: "Option 5", value: "option5" },
        { title: "Option 6", value: "option6" },
        { title: "Option 7", value: "option7" },
        { title: "Option 8", value: "option8" },
        { title: "Option 9", value: "option9" },
        { title: "Option 10", value: "option10" },
      ],
      divider: true,
    },
    direct: {
      title: "Direct",
      type: TableFilterType.Direct,
      divider: true,
    },
    multiSelectFew: {
      title: "Multi Select (Few)",
      type: TableFilterType.MultiSelect,
      options: [
        { title: "Option 1", value: "option1" },
        { title: "Option 2", value: "option2" },
        { title: "Option 3", value: "option3" },
      ],
    },
    multiSelectMore: {
      title: "Multi Select (More)",
      type: TableFilterType.MultiSelect,
      options: [
        { title: "Option 1", value: "option1" },
        { title: "Option 2", value: "option2" },
        { title: "Option 3", value: "option3" },
        { title: "Option 4", value: "option4" },
        { title: "Option 5", value: "option5" },
        { title: "Option 6", value: "option6" },
        { title: "Option 7", value: "option7" },
        { title: "Option 8", value: "option8" },
        { title: "Option 9", value: "option9" },
        { title: "Option 10", value: "option10" },
      ],
      divider: true,
    },
    amount: {
      title: "Amount",
      type: TableFilterType.Operator,
    },
    operator: {
      title: "Custom Operator",
      type: TableFilterType.Operator,
      options: [
        { title: "Equal", value: "eq" },
        { title: "Not Equal", value: "ne" },
        { title: "Greater Than", value: "gt" },
        { title: "Greater Than or Equal", value: "ge" },
        { title: "Less Than", value: "lt" },
        { title: "Less Than or Equal", value: "le" },
      ],
    },
  });

  const filterValues = computed<ListResult<TableFilterItem>>(() => {
    return {
      result: Object.entries(filters.value).map(([_key, value]) => {
        return <TableFilterItem>{
          ...value,
        };
      }),
    };
  });
</script>

<template>
  <mk-table v-model:filters="filters" :api-result="filterValues">
    <template #thead>
      <th>Filter Title</th>
      <th>Selected value</th>
      <th>Selected value title</th>
      <th>Type</th>
    </template>

    <template #tbody="dataItem">
      <td width="250">{{ dataItem.title }}</td>
      <td>{{ dataItem.selectedValue?.value || "-" }}</td>
      <td>{{ dataItem.selectedValue?.title || "-" }}</td>
      <td>{{ TableFilterType[dataItem.type!] }}</td>
    </template>
  </mk-table>
</template>
