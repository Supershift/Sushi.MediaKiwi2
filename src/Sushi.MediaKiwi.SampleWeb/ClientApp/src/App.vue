<script setup lang="ts">
  import { MkApplication, useMsal } from "@supershift/mediakiwi-vue";
  import { useDisplay } from "vuetify";
  const { xs } = useDisplay();
  const { account } = useMsal();
  //
</script>

<template>
  <mk-application>
    <template #logo>
      <picture>
        <source srcset="/logo128.webp" media="(min-width: 600px)" />
        <source srcset="/logoClassic.png" />
        <img src="/logo128.webp" alt="Logo" />
      </picture>
    </template>
    <template #title>
      <v-toolbar-title v-if="!xs"> MediaKiwi 2.0 - SampleWeb </v-toolbar-title>
    </template>
    <template v-if="account" #accountMenu>
      <v-label> {{ account.name }}</v-label>
    </template>
  </mk-application>
</template>
