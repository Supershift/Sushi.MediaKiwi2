<script setup lang="ts">
  import { MkForm, MkMoneyValue, MkFileInput } from "@/components";
  import { useNavigation, useValidationRules, useBreadcrumbs, useI18next } from "@/composables";

  import { HotelConnector } from "./../../services/HotelConnector";
  import { CountryConnector } from "./../../services/CountryConnector";
  import { FileUploadConnector } from "./../../services/FileUploadConnector";
  import { reactive, ref } from "vue";
  import { Hotel } from "./../../models/Hotel";
  import { container } from "tsyringe";
  import { Country } from "./../../models/Country";
  import MkNavigationDrawerInfo from "@/components/MkNavigation/MkNavigationDrawerInfo.vue";

  // inject dependencies
  const hotelConnector = container.resolve(HotelConnector);
  const countriesConnector = container.resolve(CountryConnector);
  const { required } = useValidationRules();
  const fileUploadConnector = container.resolve(FileUploadConnector);
  const { setCustomPageTitle } = useBreadcrumbs();
  const { formatDateTime } = await useI18next();

  const navigation = useNavigation();
  const radioModel = ref("1");
  const selectHotelType = ref([]);

  const slider = ref(20);

  // declare reactive variables
  var state = reactive({
    hotel: <Hotel>{},
    countries: <Country[]>{},
    files: <File[]>[],
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
      setCustomPageTitle(state.hotel.name);
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

  // File upload
  async function onFilesLoad() {
    state.files = [];
  }

  async function onFilesUndo() {
    state.files = [];
  }

  async function onFilesSave() {
    if (navigation.currentViewParameterNumber.value > 0) {
      // upload files
      await fileUploadConnector.PostFiles(state.files);
    }
  }

  let onFilesDelete: ((event: Event) => Promise<void>) | undefined = undefined;
</script>

<template>
  <MkNavigationDrawerInfo>
    <v-card variant="flat" rounded="lg">
      <v-card-title>{{ state.hotel.name }}</v-card-title>
      <v-card-text>
        <v-img
          src="https://plus.unsplash.com/premium_photo-1678297269980-16f4be3a15a6?q=80&w=300&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        />
      </v-card-text>
      <v-card-text> Located in: {{ state.hotel.countryCode }} </v-card-text>
    </v-card>
  </MkNavigationDrawerInfo>

  <MkForm title="Hotel edit" @save="onSave" @undo="onUndo" @delete="onDelete" @load="onLoad">
    <template #toolbarHeader>
      <v-card-text class="flex-1-1 w-75"> Hotel edit </v-card-text>
    </template>
    <v-text-field v-model="state.hotel.name" label="Name" :rules="[...required(state.hotel.name, 'This field is required')]"></v-text-field>
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
    <v-slider v-model="slider" show-ticks step="10" thumb-label="always"></v-slider>
    <v-radio-group v-model="radioModel" :rules="[() => radioModel === '2' || 'Show is the only option']">
      <v-radio label="Hide" value="1" disabled></v-radio>
      <v-radio label="Show" value="2"></v-radio>
      <v-radio label="Is Featured" value="3"></v-radio>
    </v-radio-group>
    <v-select
      v-model:model-value="selectHotelType"
      multiple
      :items="['City', 'Hostel', 'Resort', 'Motel']"
      label="Hotel Type"
      chips
      closable-chips
      clearable
    ></v-select>
  </MkForm>
  <MkForm title="Hotel files" @save="onFilesSave" @undo="onFilesUndo" @delete="onFilesDelete" @load="onFilesLoad">
    <template #toolbarHeader>
      <v-card-text class="flex-1-1 w-75"> File Upload </v-card-text>
    </template>
    <mk-file-input :uploads="state.files" label="Pool blueprints" :multiple="true"></mk-file-input>
  </MkForm>
</template>
