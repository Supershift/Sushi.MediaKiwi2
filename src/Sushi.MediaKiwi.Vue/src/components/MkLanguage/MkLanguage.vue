<script setup lang="ts">
  import { Ref, ref, watch } from "vue";
  import { inject } from "vue";
  import { type i18n } from "i18next";

  // inject dependencies
  const i18next = inject<i18n>("i18next")!;

  const languages = ref(["en", "nl"]);
  //const currentLanguage = ref(i18next.resolvedLanguage);
  //   watch(currentLanguage, async (newValue) => {
  //     //await i18next.changeLanguage(newValue);
  //     //console.log(i18next.resolvedLanguage);
  //   });

  const something = inject<any>("somethingReactive")!;

  async function changeLang() {
    await i18next.changeLanguage("nl");
    console.log(i18next.resolvedLanguage);
  }
</script>

<template>
  <v-btn @click="changeLang">Change</v-btn>
  {{ i18next.resolvedLanguage }}
  {{ something.myProperty }}
</template>
