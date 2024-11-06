<script setup lang="ts">
  import { ref } from "vue";
  import { container } from "tsyringe";
  import { SectionConnector } from "@/services";
  import { ListResult, Paging, SectionDto, TableMap } from "@/models";
  import { MkTable } from "@/components";
  import { useColors, useTypography, useElevations } from "@/composables";
  import { IconsLibrary } from "@/models";

  const { colors, variants, cssVariables, variables, getColorBackgroundClasses } = useColors(); //getColorValue
  const { typographyItems, getTypographyClasses } = useTypography();
  const { elevations, getElevationClass } = useElevations();

  // Table data
  const sectionConnector = container.resolve<SectionConnector>("ISectionConnector");
  const currentPagination = ref<Paging>({});
  const data = ref<ListResult<SectionDto>>();
  // define mapping
  const tableMap: TableMap<SectionDto> = {
    itemId: (x) => x.id,
    items: [
      { headerTitle: "Name", value: (x) => x.name },
      { headerTitle: "Icon", value: (x) => x.icon },
      { headerTitle: "Sort order", value: (x) => x.sortOrder },
    ],
  };

  // IconsLibrary keys
  const iconKeys = Object.keys(IconsLibrary);

  // get data
  async function onLoad() {
    data.value = await sectionConnector.GetSections(currentPagination.value);
  }
</script>

<template>
  <h2 class="text-headline-small">Colors</h2>
  <div class="color">
    <div v-for="color in colors" :key="color.key" class="color__item" :class="getColorBackgroundClasses(color.key)" :title="color.key">
      <p>
        {{ color.key }} <br />
        {{ color.value }} <br />
        <br />
        {{ color.onKey }} <br />
        {{ color.onValue }}
      </p>
    </div>
  </div>

  <br />
  <v-divider />
  <br />

  <div class="variables">
    <h2 class="text-headline-small">Variables</h2>
    <table border="1">
      <thead>
        <tr>
          <th>Name</th>
          <th>JS Value</th>
          <th>CSS Value</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(value, key) in cssVariables" :key="key">
          <td>{{ key }}</td>
          <td>{{ variables[key] }}</td>
          <td>{{ value }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <br />
  <v-divider />
  <br />

  <div class="header">
    <h2 class="text-headline-small">Typography</h2>
    <h1 class="text-h1">Header 1</h1>
    <h2 class="text-h2">Header 2</h2>
    <h3 class="text-h3">Header 3</h3>
    <h4 class="text-h4">Header 4</h4>
    <h5 class="text-h5">Header 5</h5>
    <h2 class="text-headline-small">Header 6</h2>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
      nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
      eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </p>
  </div>
  <br />
  <div class="typography">
    <p><i>Mediakiwi classes for the md3 typography are set based on the vuetify classes text-h1, text-h2, etc</i></p>
    <div v-for="t in typographyItems" :key="t" class="typography__item" :class="getTypographyClasses(t)" :title="getTypographyClasses(t)">
      {{ t.replace("-", " ") }}
    </div>
  </div>

  <br />
  <v-divider />
  <br />

  <h2 class="text-headline-small">Elevations</h2>
  <div class="elevations">
    <div v-for="i of elevations" :key="i" class="elevations__item bg-surface" :class="getElevationClass(i)">Elevation {{ i }}</div>
  </div>

  <br />
  <v-divider />
  <br />

  <h2 class="text-headline-small">Input elements</h2>
  <div class="input-elements">
    <br />

    <h3 class="text-title-large">Buttons</h3>
    <br />
    <div>
      <v-btn title="Variant: text">Default</v-btn>
      <v-btn-primary title="Variant: flat"> Primary </v-btn-primary>
      <v-divider vertical style="height: 30px; margin: 0 15px -6px" />
      <v-btn v-for="(variant, index) in variants" :key="index" :variant="variant">{{ variant }}</v-btn>
    </div>
    <br />
    <h3 class="text-title-large">Checkboxes</h3>
    <br />
    <div>
      <v-checkbox label="Default"></v-checkbox>
    </div>
    <br />
    <h3 class="text-title-large">Chips</h3>
    <br />
    <div>
      <v-chip>Default</v-chip>
      <v-divider vertical style="height: 30px; margin: 0 15px -6px" />
      <template v-for="variant in variants">
        <v-chip :variant="variant">{{ variant }}</v-chip>
        <v-chip :variant="variant" closable>{{ variant }} (closable)</v-chip>
      </template>
    </div>
  </div>

  <br />
  <v-divider />
  <br />

  <h2 class="text-headline-small">Table</h2>
  <mk-table v-model:current-pagination="currentPagination" :api-result="data" :on-load="onLoad" :table-map="tableMap"></mk-table>
  <br />

  <br />
  <v-divider />
  <br />

  <h2 class="text-headline-small">Icons and aliases</h2>
  <v-container class="ma-0 pa-0">
    <v-row>
      <v-col cols="9">
        <v-table>
          <thead>
            <tr>
              <th class="text-left">Name</th>
              <th class="text-left">Alias</th>
              <th class="text-center">Icon</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in iconKeys" :key="item">
              <td>{{ item }}</td>
              <td>
                <code>{{ "$" + item }}</code>
              </td>
              <td class="text-center"><v-icon :icon="'$' + item"></v-icon></td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="sass" src="@/styles/views/style-guide.scss" scoped />
