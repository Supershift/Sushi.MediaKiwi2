<script setup lang="ts">
  defineEmits(["save", "undo", "delete"]);
</script>

<template>
  <v-toolbar>
    <v-btn @click="$emit('undo', $event)">Undo changes</v-btn>
    <v-btn @click="$emit('save', $event)">Save</v-btn>    

    <v-btn icon color="primary">
      <v-icon>mdi-dots-vertical</v-icon>

      <v-menu activator="parent">
        <v-list>
          <v-list-item>
            <v-list-item-title @click="$emit('delete', $event)">Delete</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-btn>
  </v-toolbar>
</template>
