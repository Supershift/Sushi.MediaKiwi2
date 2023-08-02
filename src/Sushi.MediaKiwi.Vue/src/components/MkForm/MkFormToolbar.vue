<script setup lang="ts">
  import { useI18next } from "@/composables/useI18next";
  import { ref } from "vue";

  // define properties and events
  const props = defineProps<{
    disabled?: boolean;
    delete?: boolean;
    save?: boolean;
    undo?: boolean;
  }>();
  defineEmits(["save", "undo", "delete"]);

  // inject dependencies
  const { defaultT } = await useI18next();

  // define reactive variables
  const dialog = ref(false);
</script>

<template>
  <v-toolbar>
    <v-spacer />
    <slot></slot>
    <v-btn v-if="undo" :disabled="props.disabled" @click="$emit('undo', $event)">{{ defaultT("Undo") }}</v-btn>
    <v-btn v-if="save" :disabled="props.disabled" @click="$emit('save', $event)">{{ defaultT("Save") }}</v-btn>

    <v-btn v-if="props.delete" icon color="primary">
      <v-icon icon="$dotsVertical"></v-icon>

      <v-menu activator="parent">
        <v-list :disabled="props.disabled">
          <v-list-item>
            <v-list-item-title>
              <v-btn v-if="props.delete" color="primary">
                {{ defaultT("Delete") }}

                <v-dialog v-model="dialog" activator="parent" width="auto">
                  <v-card>
                    <v-card-text> {{ defaultT("Confirm delete") }} </v-card-text>
                    <v-card-actions>
                      <v-btn @click="dialog = false">{{ defaultT("Cancel") }}</v-btn>
                      <v-btn
                        color="primary"
                        @click="
                          dialog = false;
                          $emit('delete', $event);
                        "
                        >{{ defaultT("Delete") }}</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-btn>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-btn>
  </v-toolbar>
</template>
