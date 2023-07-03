<script setup lang="ts">
  import { ref } from "vue";
  import { container } from "tsyringe";
  import { SectionConnector } from "@/services";
  import { ListResult, Section, TableMap } from "@/models";
  import { MkTable } from "@/components";
  import { useColors, useTypography } from "@/composables";

  const { colors, surfaces, variants, cssVariables, variables, getColorBackgroundClasses } = useColors(); //getColorValue
  const { typographyItems, getTypographyClasses } = useTypography();

  // Table data
  const sectionConnector = container.resolve<SectionConnector>("ISectionConnector");
  const currentPage = ref(1);
  const data = ref<ListResult<Section>>();
  // define mapping
  const tableMap: TableMap<Section> = {
    itemId: (x) => x.id,
    items: [
      { headerTitle: "Name", value: (x) => x.name },
      { headerTitle: "Icon", value: (x) => x.icon },
      { headerTitle: "Sort order", value: (x) => x.sortOrder },
    ],
  };

  // get data
  async function onLoad() {
    data.value = await sectionConnector.GetSections({ pageIndex: currentPage.value - 1, pageSize: 10 });
  }
</script>

<template>
  <div class="color">
    <p><i>Colors defined in the vuetify theme</i></p>
    <div v-for="color in colors" :key="color.key" class="color-item" :class="getColorBackgroundClasses(color.key)" :title="color.key">
      <p>
        {{ color.key }} <br />
        {{ color.value }}
      </p>
    </div>

    <p><i>Surfaces defined in the vuetify theme</i></p>
    <div v-for="surface in surfaces" :key="surface.key" class="color-item" :class="getColorBackgroundClasses(surface.key)" :title="surface.key">
      <p>
        {{ surface.key }} <br />
        {{ surface.value }}
      </p>
    </div>
  </div>

  <div class="variables">
    <h3>Variables</h3>
    <br />
    <table border="1">
      <thead>
        <tr>
          <th>Variable</th>
          <th>Theme Value</th>
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
    <p><i>Headers are set based on the vuetify classes text-h1, text-h2, etc</i></p>
    <h1 class="text-h1">Header 1</h1>
    <h2 class="text-h2">Header 2</h2>
    <h3 class="text-h3">Header 3</h3>
    <h4 class="text-h4">Header 4</h4>
    <h5 class="text-h5">Header 5</h5>
    <h6 class="text-h6">Header 6</h6>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
      nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
      eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </p>
  </div>

  <br />
  <v-divider />
  <br />
  <div class="typography">
    <p><i>Mediakiwi classes for the md3 typography are set based on the vuetify classes text-h1, text-h2, etc</i></p>
    <div v-for="t in typographyItems" :key="t" :class="getTypographyClasses(t)">
      {{ t.replace("-", " ") }}
    </div>
  </div>

  <br />
  <v-divider />
  <br />

  <div class="input-elements">
    <h2>Input elements</h2>
    <br />

    <h3>Buttons</h3>
    <br />
    <div>
      <v-btn>Default</v-btn>
      <v-divider vertical style="height: 30px; margin: 0 15px -6px" />
      <v-btn v-for="(variant, index) in variants" :key="index" :variant="variant">{{ variant }}</v-btn>
    </div>
    <br />
    <h3>Chips</h3>
    <br />
    <div>
      <v-chip>Default</v-chip>
      <v-divider vertical style="height: 30px; margin: 0 15px -6px" />
      <v-chip v-for="(variant, index) in variants" :key="index" :variant="variant">{{ variant }}</v-chip>
    </div>
  </div>

  <br />
  <v-divider />
  <br />

  <mk-table v-model:current-page="currentPage" :api-result="data" :on-load="onLoad" :table-map="tableMap"></mk-table>
</template>

<style lang="sass" src="@/styles/views/style-guide.scss" scoped />
