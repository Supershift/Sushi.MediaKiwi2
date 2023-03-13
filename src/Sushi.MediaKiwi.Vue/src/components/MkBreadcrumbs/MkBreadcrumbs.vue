<script setup lang="ts">
    import { useNavigationStore } from '@/stores/navigation';
    import { computed } from 'vue';

    const navigationStore = useNavigationStore(); 
    const items = computed(() => navigationStore.breadcrumbList);

</script>
<template>
    <div>
        <v-breadcrumbs :items="items">
            <template v-slot:title="{ item }">
                {{ item.title.toUpperCase() }}
            </template>
            <template v-slot:divider>
                <v-icon icon="mdi-chevron-right"></v-icon>
            </template>
        </v-breadcrumbs>
    </div>
</template>
