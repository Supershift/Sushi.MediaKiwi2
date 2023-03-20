<script setup lang="ts">import { IBreadcrumb } from '@/models/breadcrumb';
    import { useRouter } from '@/router';
    import { useNavigationStore } from '@/stores/navigation';
    import { storeToRefs } from 'pinia';
    import { ref, watch } from 'vue';

    const emit = defineEmits(["navigateBack"]);

    // Using the composable we build the crumb using router and matching the path we are on
    let breadcrumbs = ref<Array<IBreadcrumb>>([]);
    const { breadcrumbItems } = storeToRefs(useNavigationStore());
    const router = useRouter();

    // We would need to check if there is something in the list of crumbs, otherwise just back
    function navigateBack(){
        // find out the previous path 
        const previousPath = breadcrumbs.value.at(breadcrumbs.value.length-1)?.to;

        // if we know where back is, then push it otherwise just use .back()
        if (breadcrumbs.value.length > 1 && previousPath !== undefined && previousPath !== "") {
            router.push(previousPath)
        } else {
            router.back();
        }
        emit("navigateBack")
    }

    // Watchers
    // Update breadcrumb from store( this kicks in whenever we navigate)
    watch(breadcrumbItems, (newBreadcrumbs)=>{
        breadcrumbs.value = newBreadcrumbs
    })

</script>
<template>
    <v-btn variant="tonal" @click="navigateBack()">
        <v-icon icon="mdi-chevron-left"></v-icon>
    </v-btn>
</template>