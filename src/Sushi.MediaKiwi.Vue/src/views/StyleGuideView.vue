<script setup lang="ts">
  import { useTheme } from "vuetify";
  import { computed } from "vue";
  import darkColors from "@/styles/themes/dark/_colors.module.scss";
  import lightColors from "@/styles/themes/light/_colors.module.scss";

  const theme = useTheme();
  const currentTheme = computed(() => (theme.global.current.value.dark ? "dark" : "light"));

  // Use the dark colors as keys since they are the same for both themes
  const colors = Object.keys(darkColors);

  const colorClasses = (key: string) => {
    return `mk-color-${currentTheme.value}-${key}`;
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
    return `mk-typography-${key}`;
  };
</script>

<template>
  <div class="color">
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
  <div class="typography">
    <div v-for="t in typographyItems" :key="t" :class="typographyClasses(t)">
      {{ t.replace("-", " ") }}
    </div>

    Headers:
    <h1>Header 1</h1>
    <h2>Header 2</h2>
    <h3>Header 3</h3>
    <h4>Header 4</h4>
    <h5>Header 5</h5>
    <h6>Header 6</h6>
  </div>
</template>

<style lang="sass" src="@/styles/views/style-guide.scss" scoped />
