<!-- Wrapper component for MkPaginationControls and MkInfiniteScroll -->
<script setup lang="ts">
  import { pageSizeOptions } from "@/constants";
  import { Paging } from "@/models/api/Paging";
  import { ITableMapPaging } from "@/models/table/TableMapPaging";

  // Components
  import { MediakiwiPaginationMode } from "@/models/pagination/MediakiwiPaginationMode";
  import { usePagination } from "@/composables/usePagination";
  import { watch } from "vue";
  import { computed } from "vue";

  // define properties
  const props = defineProps<{
    modelValue: Paging;
    pagingResult?: ITableMapPaging | null;
    mode?: MediakiwiPaginationMode;
  }>();

  // define events
  const emit = defineEmits<{
    (e: "update:modelValue", value: Paging): void;
  }>();

  const { updatePageIndex, updatePageSize, pageIndex, pageSize } = usePagination();

  watch([pageIndex, pageSize], () => {
    // create new paging object
    const pagination: Paging = {
      pageIndex: pageIndex.value,
      pageSize: pageSize.value,
    };

    // emit to parent
    emit("update:modelValue", pagination);
  });

  const info = computed(() => {
    if (props.pagingResult) {
      const { totalCount, resultCount } = props.pagingResult;
      if (totalCount && resultCount) {
        const r = pageSize.value * pageIndex.value;
        const p = r + resultCount;
        return `${r + 1}-${p} of ${totalCount}`;
      }
    }
    return "";
  });
</script>

<template>
  <v-divider />
  <div class="mk-pagination">
    <div class="mk-pagination__items-per-page">
      <span class="mk-pagination__items-per-page__label">Rows per page</span>
      <VSelect
        density="compact"
        class="mk-pagination__items-per-page__select"
        hide-details
        :items="pageSizeOptions"
        :model-value="pageSize"
        @update:model-value="updatePageSize"
      ></VSelect>
    </div>
    <div class="mk-pagination__info">
      {{ info }}
    </div>
    <div class="mk-pagination__pagination">
      <VPagination
        total-visible=""
        density="compact"
        :model-value="pageIndex + 1"
        :length="pagingResult?.pageCount"
        show-first-last-page
        @update:model-value="updatePageIndex"
      />
    </div>
  </div>
  <v-divider />
</template>
<style scoped lang="scss">
  @use "@/styles/abstracts";

  .mk-pagination {
    height: 52px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 0 8px;
    justify-content: flex-end;

    &__items-per-page {
      padding-inline-end: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      &__label {
        @include abstracts.typography("body", "medium");
        padding-inline-end: 24px;
      }
    }

    &__info {
      display: flex;
      padding-inline-end: 24px;
    }

    &__pagination {
      display: flex;
      align-items: center;
    }
  }
</style>
<style lang="scss">
  .v-pagination__item {
    display: none;
  }

  .mk-pagination__items-per-page__select {
    .v-field__outline {
      display: none;
    }
  }
</style>
