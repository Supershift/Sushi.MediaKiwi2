<script setup lang="ts">
    import useMediaKiwiRouting from '@/composables/useMediaKiwiRouting';
    import { IBreadcrumbItem } from '@/models/navigation/IBreadcrumbItem';
    import {  computed, ref } from 'vue';

    // Using the composable we build the crumb using router and matching the path we are on
    const { generateBreadCrumbs } = useMediaKiwiRouting();
    let breadcrumbs = ref<Array<IBreadcrumbItem>>([]);
    breadcrumbs = generateBreadCrumbs();

    // TODO: Add the isactive function so that we can check which item is currently the page's
    const isActive = computed(() => true);

    // TODO: add the truncate with elipsis annd check if the 
    const currentpath = computed(() => { window.location.pathname});

</script>
<template>
    <div>
        <v-breadcrumbs :items="breadcrumbs">
            <template #item="{item}">
                <v-breadcrumbs-item :href="item?.path" :active="isActive" active-class="active-crumb" :class="{'not-last': item.path === currentpath}" :to="item.to" :exact="item.exact" :bold="item.bold">
                    <div class="d-inline-block text-truncate text-h1" style="max-width: 150px;">{{ item.title.toUpperCase() }}</div>
                </v-breadcrumbs-item>
            </template>
            <template #divider>
                <v-icon icon="mdi-chevron-right"></v-icon>
            </template>
        </v-breadcrumbs>
    </div>
</template>
<style>
.not-last {
    display: block;
    width: 40px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
</style>