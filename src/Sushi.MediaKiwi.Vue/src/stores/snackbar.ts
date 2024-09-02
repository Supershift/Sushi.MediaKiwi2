import { defineStore } from "pinia";
import { ref } from "vue";

export const useSnackbarStore = defineStore("snackbar", () => {
  const show = ref(false);
  const message = ref("");

  function showMessage(content: string) {
    show.value = true;
    message.value = content;
  }

  return { show, message, showMessage };
});
