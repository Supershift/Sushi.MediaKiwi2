<script setup lang="ts">
    import { useRoute } from 'vue-router';

    const route = useRoute();
</script>

<template>
    <h1>Sample data edit</h1>
    My id is: {{ route.params.sampleDataId }}
</template>