<script setup lang="ts">
  import { ListResult, TableFilter, TableFilterItem, TableFilterType, TableFilterValue } from "@/models";
  import { MkTable } from "@/components";
  import { computed, ref } from "vue";

  //
  const start = new Date("2024-05-31T22:00:00.000Z");
  const end = new Date("2024-06-30T21:59:59.999Z");

  // define filters
  const filters = ref<TableFilter>({
    datePicker: {
      title: "Date Picker",
      type: TableFilterType.DatePicker,
    },
    datePickerRange: {
      title: "Date Picker Range",
      type: TableFilterType.DateRange,
      selectedValue: {
        value: [start, end],
      },
      divider: true,
    },
    contains: {
      title: "Search like",
      type: TableFilterType.Contains,
      searchable: true,
    },
    textField: {
      title: "Textfield",
      type: TableFilterType.TextField,
      divider: true,
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
    },
  });

  const filterValues = computed<ListResult<TableFilterItem>>(() => {
    return {
      result: Object.entries(filters.value).map(([key, value]) => {
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
      <th>Title</th>
      <th>Raw value</th>
      <th>Type</th>
    </template>

    <template #tbody="dataItem">
      <td width="250">{{ dataItem.title }}</td>
      <td>{{ dataItem.selectedValue?.value || "-" }}</td>
      <td>{{ TableFilterType[dataItem.type!] }}</td>
    </template>
  </mk-table>
</template>
