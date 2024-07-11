import { Section } from "@/models";
import { useMediakiwiStore } from "@/stores";
import { watch } from "vue";

export function useSections() {
  // Inject depecency
  const mediakiwiStore = useMediakiwiStore();

  /**
   * Wait for the sections to load and call the callback when they are loaded
   * @param resolve
   * @param reject
   * @returns
   */
  async function waitForSectionsToLoad(resolve: (sections: Section[]) => void, reject?: (error: any) => void) {
    try {
      // If the sections are already loaded, call the callback immediately
      if (mediakiwiStore.sections?.length) {
        resolve(mediakiwiStore.sections);
        return;
      }

      // Create a watcher to call the callback when the sections are loaded
      const sectionsWatcher = watch(
        () => mediakiwiStore.sections,
        (sections) => {
          if (sections?.length) {
            // Stop watching the sections
            sectionsWatcher();

            // call the resolve callback
            resolve(sections);
          }
        }
      );
    } catch (error) {
      if (reject) {
        reject(error);
      }
    }
  }

  return {
    waitForSectionsToLoad,
  };
}
