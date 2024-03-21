<script setup lang="ts">
  import { MkForm } from "@/framework";
  import { ref } from "vue";

  const steps = ref(["Date Selection", "Room selection", "Customer selection", "Success"]);

  const checkinDate = ref([new Date("2023-10-10"), new Date("2023-10-20")]);
  const roomOpenUntilDate = ref([new Date("2023-10-23"), new Date("2023-10-24"), new Date("2023-10-25")]);

  async function onLoad() {
    console.log("onLoad");
  }
  async function onSave() {
    console.log("onSave");
  }
  async function onDelete() {
    console.log("onDelete");
  }
  async function onUndo() {
    console.log("onUndo");
  }
</script>
<template>
  <mk-form sticky @load="onLoad" @delete="onDelete" @save="onSave" @undo="onUndo">
    <template #default>
      <h3>{{ steps[0] }}</h3>
      <v-container>
        <v-row justify="space-between">
          <v-col>
            <v-date-picker v-model="checkinDate" title="Check-in" :min="checkinDate[0]" multiple></v-date-picker>
          </v-col>
          <v-col>
            <v-date-picker v-model="checkinDate" :allowed-dates="roomOpenUntilDate" title="Rooms open till" multiple></v-date-picker>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </mk-form>
</template>
