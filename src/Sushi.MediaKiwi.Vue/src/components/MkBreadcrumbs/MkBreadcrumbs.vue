<script setup lang="ts">
    import { IBreadcrumb } from '@/models/breadcrumb';
    import { useRoute } from '@/router';
    import { computed, onMounted, ref, watch } from 'vue';
    import { useNavigationStore } from '@/stores/navigation';
    import { storeToRefs } from 'pinia';
    import MkBackButton from '@/components/MkNavigation/MkBackButton.vue';
    import MkBreadcrumbsItem from './MkBreadcrumbsItem.vue';
    import { useDisplay } from 'vuetify';
    
    // optional breadcrumbs to manage from the outside
    const props = defineProps<{
      breadcrumbs?: Array<IBreadcrumb>
    }>();

    // Using the composable we build the crumb using router and matching the path we are on
    let breadcrumbs = ref<Array<IBreadcrumb>>([]);
    const navigationStore = useNavigationStore();
    const { breadcrumbItems } = storeToRefs(navigationStore);
    const { mobile } = useDisplay();

    // Item props
    const isMediumSized = computed(() => mobile.value);
    const currentCrumb = computed(() => breadcrumbs.value.find(x => x.to === useRoute().path));
    const showBackButton = computed(() => isMediumSized.value && breadcrumbs.value.length > 1);

    // Watchers and listeners
    // Update breadcrumb from store (this kicks in whenever we navigate)
    // If we have a manual breadcrumb from the components props then we use that one
    watch(breadcrumbItems, (newBreadcrumbs)=>{
      if (props.breadcrumbs !== undefined && props.breadcrumbs.length) {
        breadcrumbs.value = props.breadcrumbs;
      } else {
        breadcrumbs.value = newBreadcrumbs
      }
    })
    onMounted(() => {
      if (props.breadcrumbs !== undefined && props.breadcrumbs.length) {
        breadcrumbs.value = props.breadcrumbs;
      }
    })
</script>
<template>
  <v-card
    v-if="breadcrumbs.length"
    class="ma-5"
  >
    <div
      v-if="showBackButton"
      class="breadcrumb-title-container"
    >
      <mk-back-button class="mr-5" />
      <div class="text-h3 d-inline-block">
        {{ currentCrumb?.title.toUpperCase() }}
      </div>
    </div>
    <div v-else>
      <v-breadcrumbs
        v-if="breadcrumbs.length"
        divider=" "
      >
        <mk-breadcrumbs-item
          v-for="item in breadcrumbs"
          :key="item.href"
          :item="item"
          :breadcrumbs="breadcrumbs"
        />
      </v-breadcrumbs> 
    </div>
  </v-card>
</template>
<style lang="css">
.breadcrumb-title-container {
    display: flex;
    align-items: center;
}
</style>