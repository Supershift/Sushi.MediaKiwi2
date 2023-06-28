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
</script>

<template>
  <v-card>
    <MkForm title="Hotel edit" @save="onSave" @undo="onUndo" @delete="onDelete" @load="onLoad">
      <v-text-field label="Name" v-model="state.hotel.name" :rules="[() => !!state.hotel.name || 'This field is required']"></v-text-field>
      <v-autocomplete
        label="Country"
        v-model="state.hotel.countryCode"
        :items="state.countries"
        item-title="name"
        item-text="name"
        item-value="code"
      ></v-autocomplete>
      <v-checkbox label="Is Active" v-model="state.hotel.isActive"></v-checkbox>
      <mk-money-value label="SRP" v-model="state.hotel.srp"></mk-money-value>
    </MkForm>
  </v-card>
</template>
