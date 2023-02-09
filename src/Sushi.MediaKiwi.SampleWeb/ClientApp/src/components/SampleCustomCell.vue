<script setup lang="ts">
    const props = defineProps<{
        item: any
    }>();
</script>

<template>
    Custom, item name is {{ item.name }}
</template>