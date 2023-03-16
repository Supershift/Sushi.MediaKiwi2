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
        // default text is h3 and text-container uses media to collapse with responsiveness        
        let itemClasses = "text-h3 text-container ";
        // if its not the current path or only item we should truncate
        if (props.breadcrumbs.length > 1 && item && currentpath && item.to !== currentpath.value) {
            itemClasses += "d-inline-block text-truncate ";
        }
       return itemClasses;
    }
    
    // returns a boolean to know if the current iten is active
    function isActive(item: IBreadcrumb): boolean {
        if (item.to === currentpath.value) {
            return true;
        }
        return false
    }

</script>
<template>
<v-breadcrumbs-item :href="item.href" :active="isActive(item)" active-class="active-crumb" :class="classes(item)" :to="item.to" :exact="item.exact" :bold="item.bold">
    {{ item.title.toUpperCase() }}
</v-breadcrumbs-item>
</template>