<script setup lang="ts">
    import { IBreadcrumb } from '@/models/breadcrumb';
    import { useRoute, useRouter } from '@/router';
    import { computed, ref, watch } from 'vue';
    import useResponsiveHelpers from "@/composables/useResponsiveHelpers";
    import { useNavigationStore } from '@/stores/navigation';
    import { storeToRefs } from 'pinia';

    // Using the composable we build the crumb using router and matching the path we are on
    let breadcrumbs = ref<Array<IBreadcrumb>>([]);
    const { breadcrumbItems } = storeToRefs(useNavigationStore());
    const router = useRouter();

    // Item props
    // TODO: make the component responsive with the isMedium
    const currentpath = computed(() =>  useRoute().path);
    const isMediumSized = computed(() => useResponsiveHelpers().isMedium());
    const currentCrumb = computed(() => breadcrumbs.value.find(x => x.to === useRoute().path));
    
    // generates classes for the breadcrumb
    function classes(item: IBreadcrumb, idx: number){        
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
    function isActive(item: IBreadcrumb): boolean {
        if (item.to === currentpath.value) {
            return true;
        }
        return false
    }

    // FIXME: This needs to help the user navigate back
    // we would need to check if there is something in the list of crumbs, otherwise just back
    function navigateBack(){

        // find out the previous path 
        const previousPath = breadcrumbs.value.at(breadcrumbs.value.length-1)?.to;
        
        // if we know where back is, then push it otherwise just use .back()
        if (breadcrumbs.value.length > 1 && previousPath !== undefined && previousPath !== "") {
            router.push(previousPath)
        } else {
            router.back();
        }
    }

    // Watchers
    // Update breadcrumb from store( this kicks in whenever we navigate)
    watch(breadcrumbItems, (newBreadcrumbs)=>{
        breadcrumbs.value = newBreadcrumbs
    })

    //TODO: Sepearate the back button in a seperate component
</script>
<template>
    <v-card class="ma-5" v-if="breadcrumbs.length">
        <div v-if="isMediumSized" class="breadcrumb-title-container">
            <v-btn variant="tonal" @click="navigateBack()">
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