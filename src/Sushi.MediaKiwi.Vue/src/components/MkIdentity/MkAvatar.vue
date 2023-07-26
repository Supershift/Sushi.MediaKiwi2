<script setup lang="ts">
  import { useMsal } from "@/composables/useMsal";
  import { useIsAuthenticated } from "@/composables/useIsAuthenticated";
  import { MkSignOutButton, MkLanguageSwitch } from "@/components";
  import { ref } from "vue";
  import { IconsLibrary } from "@/models";

  const { account } = useMsal();

  const menu = ref(false);

  const isAuthenticated = useIsAuthenticated();
</script>

<template>
  <span v-if="isAuthenticated">
    <div class="text-center">
      <v-menu v-model="menu" :close-on-content-click="false" location="bottom">
        <template #activator="{ props }">
          <v-container>
            <v-avatar color="surface" v-bind="props" :title="account?.username">
              <v-icon :icon="IconsLibrary.mdiAccountCircle"></v-icon>
            </v-avatar>
          </v-container>
        </template>

        <v-card min-width="300">
          <v-list>
            <v-container> {{ account?.username }} </v-container>
          </v-list>

          <v-divider></v-divider>

          <v-list>
            <v-list-item>
              <mk-language-switch></mk-language-switch>
            </v-list-item>
          </v-list>

          <v-card-actions>
            <mk-sign-out-button></mk-sign-out-button>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-menu>
    </div>
  </span>
</template>
