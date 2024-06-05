<!-- Wrapper component for MkPaginationControls and MkInfiniteScroll -->
<script setup lang="ts">
  import { defaultPageSizeOptions, defaultPageSize } from "@/constants";
  import { Paging } from "@/models/api/Paging";
  import { ITableMapPaging } from "@/models/table/TableMapPaging";
  import { useI18next } from "@/composables/useI18next";

  // Components
  import { MediakiwiPaginationMode } from "@/models/pagination/MediakiwiPaginationMode";
  import { computed } from "vue";
  import { reactive } from "vue";

  // inject dependencies
  const { defaultT } = await useI18next();

  // define properties
  const props = withDefaults(
    defineProps<{
      modelValue: Paging;
      pagingResult?: ITableMapPaging | null;
      mode?: MediakiwiPaginationMode;
      pageSizeOptions?: number[];
      /** when true the pageindex is calculated, so we 'track' which page to use based on the first item viewed  */
      pageTracking?: boolean;
    }>(),
    {
      modelValue: () => ({ pageIndex: 0, pageSize: defaultPageSize }),
      pagingResult: null,
      mode: "controls",
      pageSizeOptions: () => [...defaultPageSizeOptions],
    }
  );

  // define emits
  const emit = defineEmits<{
    (e: "update:modelValue", value: Paging): void;
  }>();

  /**
   * Reactive state
   */
  const state = reactive({
    pageIndex: props.modelValue.pageIndex || 0,
    pageSize: props.modelValue.pageSize || defaultPageSize,
  });

  /**
   * Page sizes to display in the select
   */
  const sortedPageSizes = computed(() => {
    return [...props.pageSizeOptions]?.sort((a: number, b: number) => a - b);
  });

  /**
   * Emit the current paging values to the parent
   */
  function applyPaging() {
    // create new paging object
    const pagination: Paging = {
      pageIndex: state.pageIndex,
      pageSize: state.pageSize,
    };

    // emit to parent
    emit("update:modelValue", pagination);
  }

  /**
   * Change event
   * @param {number} value New page index
   */
  async function updatePageIndex(value: number) {
    // Update local values
    if (value !== null && value !== undefined) {
      state.pageIndex = value - 1;
      applyPaging();
    }
  }

  /**
   * Change event
   * @param {number} value New page size
   */
  async function updatePageSize(value: number) {
    // Update local values
    if (value !== null && value !== undefined) {
      if (!props?.pageTracking) {
        state.pageIndex = 0; // reset to first page
      } else {
        const firstItem = state.pageIndex * state.pageSize;
        const currentPage = Math.abs(Math.floor(firstItem / value));
        state.pageIndex = currentPage; // Use the page index and calculate the new page index based on the first item in the list
      }
      state.pageSize = value;
      applyPaging();
    }
  }

  /**
   * Zero based start index of the current paging result
   */
  const start = computed(() => {
    return state.pageSize * state.pageIndex;
  });

  /**
   * End index of the current paging result
   */
  const end = computed(() => {
    let end = start.value;

    // If paging result is set, calculate the end index
    if (props.pagingResult) {
      const { totalCount, resultCount } = props.pagingResult;

      // If both totalCount and resultCount are set, calculate the end index
      if (totalCount && resultCount) {
        end = start.value + resultCount;

        // If the end index is greater than the total count, set the end index to the total count
        if (end > totalCount) {
          end = totalCount;
        }
      }
    }

    return end;
  });

  /**
   * Get the start, end and total of the current paging result
   * @returns { { start: number, end: number, total: number } | null }
   */
  const resultSetLabel = computed(() => {
    if (props.pagingResult?.totalCount) {
      // Add 1 to start to display at 1 instead of 0
      const startPage = start.value + 1;

      const resultSet = { start: startPage, end: end.value, total: props.pagingResult?.totalCount };
      return defaultT.value("PagingInfo", { resultSet });
    }
    return null;
  });
</script>

<template>
  <v-divider />
  <div class="mk-pagination">
    <div class="mk-pagination__items-per-page">
      <span class="mk-pagination__items-per-page__label">
        {{ defaultT("Rows per page") }}
      </span>
      <VSelect
        density="compact"
        class="mk-pagination__items-per-page__select"
        hide-details
        :items="sortedPageSizes"
        :model-value="state.pageSize"
        @update:model-value="updatePageSize"
      ></VSelect>
    </div>
    <div class="mk-pagination__info">
      <template v-if="resultSetLabel">
        {{ resultSetLabel }}
      </template>
    </div>
    <div class="mk-pagination__pagination">
      <VPagination
        total-visible=""
        density="compact"
        :model-value="state.pageIndex + 1"
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
      @include abstracts.typography("body", "medium");
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
