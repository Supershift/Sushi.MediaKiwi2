<script setup lang="ts">
  import { useTheme } from "vuetify";
  import { computed, ref } from "vue";
  import darkColors from "@/styles/themes/dark/_colors.module.scss";
  import lightColors from "@/styles/themes/light/_colors.module.scss";
  import { container } from "tsyringe";
  import { SectionConnector } from "@/services";
  import { ListResult, Section, TableMap } from "@/models";
  import { MkTable } from "@/components";

  const theme = useTheme();

  // Use the dark colors as keys since they are the same for both themes
  const colors = Object.keys(darkColors);

  const colorClasses = (key: string) => {
    return `mk-background-color-${key}`;
  };

  const hex = (key: string) => {
    if (theme.global.current.value.dark) {
      return darkColors[key];
    } else {
      return lightColors[key];
    }
  };

  const typographyTypes = ["display", "headline", "title", "label", "body"];
  const typographySizes = ["large", "medium", "small"];

  const typographyItems = computed(() => {
    const typographyClasses = typographyTypes.map((type) => {
      return typographySizes.map((size) => {
        return `${type}-${size}`;
      });
    });

    return typographyClasses.flat();
  });

  const typographyClasses = (key: string) => {
    return `mk-text-${key}`;
  };

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
    <div v-for="key in colors" :key="key" class="color-item" :class="colorClasses(key)">
      <p>
        {{ key }} <br />
        {{ hex(key) }}
      </p>
    </div>
  </div>
  <br />
  <hr />
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

    <v-btn>Knop</v-btn>
  </div>
  <br />
  <hr />
  <br />
  <div class="typography">
    <p><i>Mediakiwi classes for the md3 typography are set based on the vuetify classes text-h1, text-h2, etc</i></p>
    <div v-for="t in typographyItems" :key="t" :class="typographyClasses(t)">
      {{ t.replace("-", " ") }}
    </div>
  </div>

  <mk-table v-model:current-page="currentPage" :api-result="data" :on-load="onLoad" :table-map="tableMap"></mk-table>
</template>

<style lang="sass" src="@/styles/views/style-guide.scss" scoped />
