<script setup lang="ts">
    import useMediaKiwiRouting from '@/composables/useMediaKiwiRouting';
    import { IBreadcrumbItem } from '@/models/navigation/IBreadcrumbItem';
    import { useRoute } from '@/router';
    import { computed, ref } from 'vue';
    import useResponsiveHelpers from "@/composables/useResponsiveHelpers";

    // Using the composable we build the crumb using router and matching the path we are on
    const { generateBreadCrumbs } = useMediaKiwiRouting();
    let breadcrumbs = ref<Array<IBreadcrumbItem>>([]);
    breadcrumbs = generateBreadCrumbs();

    // Item props
    // TODO: make the component responsive with the isMedium
    const currentpath = computed(() =>  useRoute().path);
    const isMediumSized = computed(() => useResponsiveHelpers().isMedium());
    const currentCrumb = computed(() => breadcrumbs.value.find(x => x.to === useRoute().path))

    // generates classes for the breadcrumb
    function classes(item: IBreadcrumbItem, idx: number){        
        let itemClasses = "text-h3 ";
        // if its not the current path or only item we should truncate with max of 500
        if (breadcrumbs.value.length > 1 && item && currentpath && item.to !== currentpath.value) {
            itemClasses += "text-container-130 d-inline-block text-truncate ";
        }
        // if its the only item or the last item we should display as Title with width of 500
        if (breadcrumbs.value.length == 1 || breadcrumbs.value.length === idx) {
            itemClasses += "text-container-500 ";
        }
       return itemClasses;
    }
    // returns a boolean to know if the current iten iis active
    function isActive(item: IBreadcrumbItem): boolean {
        if (item.to === currentpath.value) {
            return true;
        }
        return false
    }
</script>
<template>
    <v-card class="ma-5" v-if="breadcrumbs.length">
        <div v-if="isMediumSized" class="breadcrumb-title-container">
            <v-btn variant="tonal" >
                <v-icon icon="mdi-chevron-left"></v-icon>
            </v-btn>
            <div class="ml-5 text-h3 d-inline-block">{{ currentCrumb?.title.toUpperCase()  }}</div>
        </div>
        <div v-else>
            <v-breadcrumbs v-if="breadcrumbs.length" divider=">" >
                <v-breadcrumbs-item v-for="(item, idx) in breadcrumbs" :key="item.href" :href="item.href" :active="isActive(item)" active-class="active-crumb" :class="classes(item, idx)" :to="item.to" :exact="item.exact" :bold="item.bold">
                    {{ item.title.toUpperCase() }}
                </v-breadcrumbs-item>
            </v-breadcrumbs> 
        </div>
    </v-card>
</template>
<style lang="css">
.breadcrumb-title-container {
    display: flex;
    align-items: center;
}
.text-container-500 {
    max-width: 500px;
}
.text-container-130 {
    max-width: 130px;
}
</style>