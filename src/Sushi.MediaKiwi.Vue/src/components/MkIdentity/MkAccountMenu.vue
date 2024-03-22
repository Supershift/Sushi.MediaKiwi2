<script setup lang="ts">
  import { useMsal } from "@/composables/useMsal";
  import { useIsAuthenticated } from "@/composables/useIsAuthenticated";
  import { MkSignOutButton, MkLanguageSwitch } from "@/components";
  import { ref } from "vue";
  import { computed } from "vue";
  import { IconsLibrary } from "@/models";

  const { account } = useMsal();
  const menu = ref(false);
  const isAuthenticated = useIsAuthenticated();

  const accountInitial = computed(() => {
    return account.value?.username.charAt(0).toUpperCase();
  });

  defineProps<{
    /** Hide the avatar in the Account overflow menu */
    hideAvatar?: boolean;
  }>();

  // define slots
  const slots = defineSlots<{
    /** Customze the icon */
    avatar?: () => never;
    /** Slot to inject additional markup above the language switch */
    default?: () => never;
    /** Slot to inject additional buttons */
    actions?: () => never;
  }>();

  const roles = computed(() => {
    return account?.value.idTokenClaims?.roles?.join(", ");
  });
</script>

<template>
  <!-- <span>-->
  <div class="mk-account-menu">
    <v-menu v-model="menu" :close-on-content-click="false" location="bottom">
      <template #activator="{ props }">
        <v-avatar v-bind="props" :title="account?.username" variant="text" class="mk-account-menu__avatar">
          <v-icon :icon="IconsLibrary.accountCircle"></v-icon>
        </v-avatar>
      </template>

      <v-card class="mk-account-menu__content">
        <template v-if="isAuthenticated">
          <v-card-text class="py-6 px-4">
            <div class="d-flex align-center ga-4">
              <div v-if="slots.avatar">
                <slot name="avatar"></slot>
              </div>
              <div v-else-if="!hideAvatar">
                <v-avatar color="primary" size="small">{{ accountInitial }}</v-avatar>
              </div>
              <div class="text-truncate d-flex flex-column ga-1">
                <p class="text-title-small text-truncate" :title="account?.username">{{ account?.username }}</p>
                <p v-if="roles" class="text-body-small text-truncate" :title="roles">{{ roles }}</p>
              </div>
            </div>
          </v-card-text>

          <v-divider></v-divider>
        </template>

        <v-card-text v-if="slots.default">
          <slot name="default"></slot>
        </v-card-text>

        <v-card-text>
          <mk-language-switch></mk-language-switch>
        </v-card-text>

        <template v-if="isAuthenticated">
          <v-divider></v-divider>

          <v-card-actions class="pa-4">
            <slot v-if="slots.actions" name="actions"></slot>
            <v-spacer v-else></v-spacer>
            <mk-sign-out-button></mk-sign-out-button>
          </v-card-actions>
        </template>
      </v-card>
    </v-menu>
  </div>
  <!-- </span> -->
</template>
<style scoped lang="scss">
  .mk-account-menu {
    &__avatar {
      cursor: pointer;
    }

    &__content {
      width: 312px;
    }
  }
</style>
