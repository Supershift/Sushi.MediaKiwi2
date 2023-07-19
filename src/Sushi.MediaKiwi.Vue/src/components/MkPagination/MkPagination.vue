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
  <v-container class="mk-pagination pa-0">
    <v-row class="pa-0">
      <v-spacer class="pa-0"></v-spacer>
      <v-col class="mk-pagination__items-per-page pa-0">
        <label class="mk-pagination__items-per-page__label"> Rows per page</label>
        <VSelect
          variant="underlined"
          density="compact"
          class="mk-pagination__items-per-page__select"
          hide-details
          :items="pageSizeOptions"
          :model-value="pageSize"
          @update:model-value="updatePageSize"
        ></VSelect>

        <div class="mk-pagination__items-per-page__info pa-0">
          {{ info }}
        </div>
      </v-col>
      <v-col class="mk-pagination__pagination pa-0">
        <VPagination
          density="compact"
          total-visible=""
          :model-value="pageIndex + 1"
          :length="pagingResult?.pageCount"
          show-first-last-page
          @update:model-value="updatePageIndex"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped lang="scss">
  .mk-pagination {
    &__items-per-page {
      display: flex;
      align-items: center;

      &__label {
        margin-right: 0.5rem;
      }

      &__select {
        max-width: 75px;
      }

      &__info {
        margin: 0 24px;
      }
    }

    &__pagination {
      flex: 0;
      margin-right: 48px;
    }
  }
</style>
