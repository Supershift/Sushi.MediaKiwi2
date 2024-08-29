import { useErrorMessages } from "@/composables/useErrorMessages";
import { getErrorMessages } from "@/errorhandler/parser";
import { ErrorProblemDetails } from "@/models";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useSnackbarStore = defineStore("snackbar", () => {
  const show = ref(false);
  const message = ref("");

  function showMessage(content: string) {
    show.value = true;
    message.value = content;
  }

  /**
   * Set the error on the form or show a snackbar message
   */
  async function showErrorMessage(error: ErrorProblemDetails) {
    // define the messages
    let message = getErrorMessages(error)?.join(", ") || "";

    // Show a snackbar message to the user
    showMessage(message);
  }

  return { show, message, showMessage, showErrorMessage };
});
