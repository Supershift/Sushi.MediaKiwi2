import { readonly, ref } from "vue";
import { SideSheet } from "@/models";

export default function useSideSheet() {
  /** the sidesheet state */
  const sideSheet = ref<SideSheet>({ isOpen: false });

  /** the teleport container that will be created */
  let teleportContainer = undefined as HTMLDivElement | undefined;

  /** toggles the sidesheet to show or hide */
  const toggleSideSheet = () => {
    sideSheet.value.isOpen = !sideSheet.value.isOpen;
  };
  /** opens the sideSheet  */
  const openSideSheet = () => {
    // we only deal with one role at a time
    sideSheet.value.isOpen = true;
  };
  /** Closes the sideSheet */
  const closeSideSheet = () => {
    sideSheet.value.isOpen = false;
  };
  /** checks if the sidesheet is open and returns a boolean */
  const isOpen = () => {
    return sideSheet.value.isOpen;
  };
  /** Mounts the teleport conttainer based on the hookName */
  const mountTeleportContainer = (hookName: string) => {
    const alreadyCreatedTarget = document.getElementById(hookName);
    if (alreadyCreatedTarget) return;
    teleportContainer = document.createElement("div");
    teleportContainer.setAttribute("id", hookName);
    document.body.appendChild(teleportContainer);
  };
  /** Unmounts the teleport container */
  const unMountTeleportContainer = () => {
    if (teleportContainer) {
      document.body.removeChild(teleportContainer);
    }
  };
  return {
    toggleSideSheet,
    openSideSheet,
    closeSideSheet,
    isOpen,
    mountTeleportContainer,
    unMountTeleportContainer,
    state: readonly(sideSheet),
  };
}
