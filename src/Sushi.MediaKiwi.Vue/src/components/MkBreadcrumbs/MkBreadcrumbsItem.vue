<script setup lang="ts">
    import { Breadcrumb, IBreadcrumb } from '@/models/breadcrumb';
    import { useRoute } from '@/router';
    import { computed } from 'vue';

    const props = defineProps<{
        item: Breadcrumb,
        breadcrumbs: Array<Breadcrumb>
    }>();

    const currentpath = computed(() =>  useRoute().path);
    
    // generates classes for the breadcrumb
    function classes(item: IBreadcrumb){
        // if its not the current path or only item we should truncate
       return {
        " d-inline-block text-truncate ": (props.breadcrumbs.length > 1 && item && currentpath && 
            item.to !== currentpath.value),
       };
    }
    
    // returns a boolean to know if the current iten is active
    function isActive(item: IBreadcrumb): boolean {
        if (item.to === currentpath.value) {
            return true;
        }
        return false
    }
    // NOTE: the 'divider'  is not showing up despite using the correct slots in breadcrumbs component, might be a vuetify bug. We resolve this here with an v-icon.
    function currentIndex(item: IBreadcrumb): number{
        const idx = props.breadcrumbs.findIndex((x) => x.href === item.href);
        if (idx != -1) {
            return idx
        }
        return -1;
    }

    function isLastItem(item: IBreadcrumb): boolean {
        if (item) {
            if ((currentIndex(item) + 1 ) === props.breadcrumbs.length) {
                return true;
            }
        }
        return false;
    }
</script>
<template>
    <div class="breadcrumb-item-container">
        <v-breadcrumbs-item :href="item.href" :active="isActive(item)" active-class="active-crumb" class="text-h3 text-container" :class="classes(item)" :to="item.to" :exact="item.exact" :bold="item.bold" :disabled="item.disabled">
            {{ item.title.toUpperCase() }} 
        </v-breadcrumbs-item>
        <v-icon v-if="breadcrumbs.length > 1 && currentIndex(item) != -1 && !isLastItem(item)" icon="mdi-chevron-right"></v-icon>
    </div>
</template>
<style scoped lang="css">
.v-icon {
    font-size: 2em;
}
.breadcrumb-item-container{
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
}
.active-crumb,
.active-crumb:hover {
    text-decoration: none;
    cursor: text;
    font-weight: bold;
    max-width: unset !important;
}
.text-container {
    max-width: 500px;
}
@media (min-width: 960px) {
    .text-container {
        max-width: 120px;
    }
}
</style>