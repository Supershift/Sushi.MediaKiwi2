<script setup lang="ts">
  import { MkForm } from "@supershift/mediakiwi-vue";
  import { ref } from "vue";
  import SampleTableCustomers from "../../components/SampleTableCustomers.vue";
  import SampleTableRooms from "../../components/SampleTableRooms.vue";

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
    <template #toolbarHeader>
      <v-card-text class="flex-1-1 w-75">
        Personal details, also known as personal information or personal data, refer to specific pieces of information that are associated with an individual
        and can help identify or describe that person.
      </v-card-text>
    </template>
    <template #default>
      <v-stepper :items="steps" class="v-stepper--sticky">
        <template #item.1>
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
        <template #item.2>
          <h3>{{ steps[1] }}</h3>
          <SampleTableRooms></SampleTableRooms>
        </template>
        <template #item.3>
          <h3>{{ steps[2] }}</h3>
          <SampleTableCustomers></SampleTableCustomers>
        </template>
        <template #item.4>
          <h3>{{ steps[3] }}</h3>
          <v-container>
            <v-row justify="space-between">
              <v-col> Successfully sent offer! </v-col>
            </v-row>
          </v-container>
        </template>
      </v-stepper>
    </template>
  </mk-form>
</template>
