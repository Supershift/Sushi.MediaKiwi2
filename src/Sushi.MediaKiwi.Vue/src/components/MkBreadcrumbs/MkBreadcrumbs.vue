<script setup lang="ts">
    import { IBreadcrumb } from '@/models/breadcrumb';
    import { useRoute } from '@/router';
    import { computed, ref, watch } from 'vue';
    import useResponsiveHelpers from "@/composables/useResponsiveHelpers";
    import { useNavigationStore } from '@/stores/navigation';
    import { storeToRefs } from 'pinia';
    import MkBackButton from '@/components/MkNavigationNew/MkBackButton.vue';

    // Using the composable we build the crumb using router and matching the path we are on
    let breadcrumbs = ref<Array<IBreadcrumb>>([]);
    const { breadcrumbItems } = storeToRefs(useNavigationStore());

    // Item props
    const currentpath = computed(() =>  useRoute().path);
    let isMediumSized = ref(false);
    const currentCrumb = computed(() => breadcrumbs.value.find(x => x.to === useRoute().path));
    const showBackButton = computed(() => isMediumSized.value && breadcrumbs.value.length > 1);

    // generates classes for the breadcrumb
    function classes(item: IBreadcrumb){
        // default text is h3 and text-container uses media to collapse with responsiveness        
        let itemClasses = "text-h3 text-container ";
        // if its not the current path or only item we should truncate
        if (breadcrumbs.value.length > 1 && item && currentpath && item.to !== currentpath.value) {
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

    // Watchers and listeners
    // Update breadcrumb from store( this kicks in whenever we navigate)
    watch(breadcrumbItems, (newBreadcrumbs)=>{
        breadcrumbs.value = newBreadcrumbs
    })

    // added to manage the resizing
    window.addEventListener("resize", () => {
        isMediumSized.value = useResponsiveHelpers().isMedium();
    });

</script>
<template>
    <v-card class="ma-5" v-if="breadcrumbs.length">
        <div v-if="showBackButton" class="breadcrumb-title-container">
            <mk-back-button class="mr-5"></mk-back-button>
            <div class="text-h3 d-inline-block">{{ currentCrumb?.title.toUpperCase()  }}</div>
        </div>
        <div v-else>
            <v-breadcrumbs v-if="breadcrumbs.length" divider=">" >
                <v-breadcrumbs-item v-for="item in breadcrumbs" :key="item.href" :href="item.href" :active="isActive(item)" active-class="active-crumb" :class="classes(item)" :to="item.to" :exact="item.exact" :bold="item.bold">
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
.text-container {
    max-width: 130px;
}
.active-crumb,
.active-crumb:hover {
    text-decoration: none;
    cursor: text;
    font-weight: bold;
}
@media (min-width: 960px) {
    .text-container {
        max-width: 500px;
    }
}
</style>