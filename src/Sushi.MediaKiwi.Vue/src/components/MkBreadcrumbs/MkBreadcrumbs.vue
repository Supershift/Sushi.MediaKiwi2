<script setup lang="ts">
    import { IBreadcrumb } from '@/models/breadcrumb';
    import { useRoute } from '@/router';
    import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
    import useResponsiveHelpers from "@/composables/useResponsiveHelpers";
    import { useNavigationStore } from '@/stores/navigation';
    import { storeToRefs } from 'pinia';
    import MkBackButton from '@/components/MkNavigationNew/MkBackButton.vue';
    import MkBreadcrumbsItem from './MkBreadcrumbsItem.vue';

    // FIXME: the divider isn ot showing up despite using the correct slots
     
    // Using the composable we build the crumb using router and matching the path we are on
    let breadcrumbs = ref<Array<IBreadcrumb>>([]);
    const { breadcrumbItems } = storeToRefs(useNavigationStore());

    // Item props
    let isMediumSized = ref(false);
    const currentCrumb = computed(() => breadcrumbs.value.find(x => x.to === useRoute().path));
    const showBackButton = computed(() => isMediumSized.value && breadcrumbs.value.length > 1);

    // Watchers and listeners
    // Update breadcrumb from store( this kicks in whenever we navigate)
    watch(breadcrumbItems, (newBreadcrumbs)=>{
        breadcrumbs.value = newBreadcrumbs
    })

    onMounted(() => {
        // added to manage the resizing
        window.addEventListener("resize", () => {
            isMediumSized.value = useResponsiveHelpers().isMedium();
        });
    })
    onUnmounted(() => {
        // added to manage the resizing
        window.removeEventListener("resize", () => {
            isMediumSized.value = false
        });
    })
</script>
<template>
    <v-card class="ma-5" v-if="breadcrumbs.length">
        <div v-if="showBackButton" class="breadcrumb-title-container">
            <mk-back-button class="mr-5"></mk-back-button>
            <div class="text-h3 d-inline-block">{{ currentCrumb?.title.toUpperCase()  }}</div>
        </div>
        <div v-else>
            <v-breadcrumbs v-if="breadcrumbs.length" divider=">" >
                <mk-breadcrumbs-item v-for="item in breadcrumbs" :key="item.href" :item="item" :breadcrumbs="breadcrumbs"></mk-breadcrumbs-item>
                <template v-slot:divider>
                    <v-icon icon="mdi-chevron-right"></v-icon>
                </template>
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