<script setup lang="ts">
    const props = defineProps<{
        data: any
    }>();
</script>

<template>
    Custom, data name is {{ data.name }}
</template>