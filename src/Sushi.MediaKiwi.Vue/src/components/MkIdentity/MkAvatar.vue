<script setup lang="ts">
  import { useMsal } from "@/composables/useMsal";
  import { useIsAuthenticated } from "@/composables/useIsAuthenticated";
  import { MkSignOutButton, MkLanguageSwitch } from "@/components";
  import { ref } from "vue";
  import { IconsLibrary } from "@/models";
  import { computed } from "vue";

  const { account } = useMsal();

  const menu = ref(false);

  const isAuthenticated = useIsAuthenticated();

  const roles = computed(() => {
    return account?.value.idTokenClaims?.roles?.join(", ");
  });
</script>

<template>
  <span>
    <div class="text-center">
      <v-menu v-model="menu" :close-on-content-click="false" location="bottom">
        <template #activator="{ props }">
          <v-container>
            <v-avatar v-bind="props" :title="account?.username" variant="text">
              <v-icon :icon="IconsLibrary.accountCircle"></v-icon>
            </v-avatar>
          </v-container>
        </template>

        <v-card min-width="300">
          <v-list v-if="isAuthenticated">
            <v-list-item class="pb-3">
              <p class="text-title-medium">{{ account?.username }}</p>
              <p v-if="roles" class="text-title-small">{{ roles }}</p>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item>
              <v-container>
                <v-row>
                  <v-col>
                    <mk-language-switch></mk-language-switch>
                  </v-col>
                </v-row>
              </v-container>
            </v-list-item>

            <v-divider></v-divider>

            <v-card-actions v-if="isAuthenticated">
              <v-spacer></v-spacer>
              <mk-sign-out-button></mk-sign-out-button>
            </v-card-actions>
          </v-list>
        </v-card>
      </v-menu>
    </div>
  </span>
</template>
