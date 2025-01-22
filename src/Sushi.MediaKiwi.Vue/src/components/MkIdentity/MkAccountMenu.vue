<script setup lang="ts">
  import { useMsal } from "@/composables/useMsal";
  import { useIsAuthenticated } from "@/composables/useIsAuthenticated";
  import { MkSignOutButton, MkLanguageSwitch, MkTimeZoneSwitch } from "@/components";
  import { ref } from "vue";
  import { computed } from "vue";
  import { IconsLibrary } from "@/models";

  const { account, extendedAccountInfo } = useMsal();
  const menu = ref(false);
  const isAuthenticated = useIsAuthenticated();

  defineProps<{
    /** Hide the avatar in the Account overflow menu */
    hideAvatar?: boolean;
  }>();

  // define slots
  const slots = defineSlots<{
    /** Customze the icon */
    avatar?: () => never;
    /** Slot to override the body contents in the account menu */
    header?: () => never;
    /** Slot to override the body contents in the account menu */
    default?: () => never;
    /** Slot to override the actions in the account menu */
    actions?: () => never;
  }>();

  const roles = computed(() => extendedAccountInfo.value?.roles);
  const initial = computed(() => extendedAccountInfo.value?.initital);
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
              <div v-else-if="!hideAvatar && initial">
                <v-avatar color="primary" size="small">{{ initial }}</v-avatar>
              </div>
              <div class="text-truncate d-flex flex-column ga-1">
                <slot v-if="slots.header" name="header"></slot>
                <template v-else>
                  <p class="text-title-small text-truncate" :title="account?.username">{{ account?.username }}</p>
                  <p v-if="roles" class="text-body-small text-truncate" :title="roles">{{ roles }}</p>
                </template>
              </div>
            </div>
          </v-card-text>

          <v-divider></v-divider>
        </template>

        <v-card-text v-if="slots.default">
          <slot name="default"></slot>
        </v-card-text>
        <v-card-text v-else>
          <mk-time-zone-switch />
          <mk-language-switch />
        </v-card-text>

        <template v-if="isAuthenticated">
          <v-divider></v-divider>

          <v-card-actions class="pa-4">
            <slot v-if="slots.actions" name="actions"></slot>
            <template v-else>
              <v-spacer></v-spacer>
              <mk-sign-out-button></mk-sign-out-button>
            </template>
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
