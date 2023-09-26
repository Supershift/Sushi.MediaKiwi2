<script setup lang="ts">
  import { MkForm, MkMoneyValue, useNavigation } from "@supershift/mediakiwi-vue";
  import { HotelConnector } from "@/services/HotelConnector";
  import { CountryConnector } from "@/services/CountryConnector";
  import { reactive, ref } from "vue";
  import { Hotel } from "@/models/Hotel";
  import { container } from "tsyringe";
  import { Country } from "@/models/Country";

  // inject dependencies
  const hotelConnector = container.resolve(HotelConnector);
  const countriesConnector = container.resolve(CountryConnector);

  const navigation = useNavigation();
  const fileUpload = ref<File[]>([]);

  // declare reactive variables
  var state = reactive({
    hotel: <Hotel>{},
    countries: <Country[]>{},
  });

  // Load countries for selection at dropdown
  async function LoadCountries() {
    const countries = await countriesConnector.GetAll({ pageIndex: 0, pageSize: 9999 });
    if (!countries) {
      console.log("No countries could be loaded.");
    } else {
      console.log(countries);
      state.countries = countries.result!;
    }
  }

  async function onLoad() {
    await LoadCountries();

    if (navigation.currentViewParameterNumber.value > 0) {
      // get existing hotel from api
      const candidate = await hotelConnector.GetAsync(navigation.currentViewParameterNumber.value);
      if (!candidate) {
        alert("No hotel found!");
      }
      state.hotel = candidate!;
    } else {
      // create a new hotel
      state.hotel = <Hotel>{ id: 0 };
    }
  }

  async function onUndo() {
    state.hotel = await hotelConnector.GetAsync(navigation.currentViewParameterNumber.value);
  }

  async function onSave() {
    if (navigation.currentViewParameterNumber.value > 0) {
      // update existing hotel
      await hotelConnector.SaveAsync(state.hotel);
    } else {
      // create new hotel
      const newHotel = await hotelConnector.SaveAsync(state.hotel);

      // push user to the new hotel
      navigation.navigateTo(navigation.currentNavigationItem.value, newHotel.id);
    }
  }

  let onDelete: ((event: Event) => Promise<void>) | undefined = undefined;

  onDelete = async () => {
    if (navigation.currentViewParameterNumber.value > 0) {
      await hotelConnector.DeleteAsync(navigation.currentViewParameterNumber.value);
    }
  };
  function deleteChip(index: number) {
    // Open issue: https://github.com/vuetifyjs/vuetify/issues/18063
    // Also handy: https://github.com/vuetifyjs/vuetify/issues/7837 (but not working)
    fileUpload.value.splice(index, 1);
  }
</script>

<template>
  <v-card>
    <MkForm title="Hotel edit" @save="onSave" @undo="onUndo" @delete="onDelete" @load="onLoad">
      <v-text-field v-model="state.hotel.name" label="Name" :rules="[() => !!state.hotel.name || 'This field is required']"></v-text-field>
      <v-autocomplete
        v-model="state.hotel.countryCode"
        label="Country"
        :items="state.countries"
        item-title="name"
        item-text="name"
        item-value="code"
      ></v-autocomplete>
      <v-checkbox v-model="state.hotel.isActive" label="Is Active"></v-checkbox>
      <mk-money-value v-model="state.hotel.srp" label="SRP"></mk-money-value>
      <v-file-input v-model="fileUpload" multiple label="Hotel blueprint" :rules="[() => fileUpload.length || 'Upload is required!']">
        <template #selection="{ fileNames }">
          <template v-for="(fileName, idx) in fileNames">
            <v-chip v-if="fileName" :key="fileName" size="small" label color="primary" close-icon="$close" closable @click:close="deleteChip(idx, fileName)">
              {{ fileName }}
            </v-chip>
          </template>
        </template>
      </v-file-input>
    </MkForm>
  </v-card>
</template>
