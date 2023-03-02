<script setup lang="ts">
    import { useRoute } from 'vue-router';

    const route = useRoute();
</script>

<template>
    <h1>Sample deep data edit</h1>
    My id is: {{ route.params.deepDataId }}    
</template>