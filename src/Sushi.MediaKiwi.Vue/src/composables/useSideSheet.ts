import { reactive, readonly } from "vue";
import { DialogRole, Modal } from "@/models";

export default function useSideSheet() {
  /** the modal object that holds the role and name of the sidesheet */
  const modal: Modal = reactive({
    role: [],
    name: "",
  });
  /** the teleport container that will be created */
  let teleportContainer = undefined as HTMLDivElement | undefined;

  /** toggles the sidesheet with the given role */
  const toggleSideSheet = (_role = "") => {
    modal.role.pop();
  };
  /** opens the sidesheet with the given role */
  const openSideSheet = (_role = "") => {
    const dialogRole: DialogRole = {
      type: _role,
      isOpen: true,
    };

    // we only deal with one role at a time
    if (modal.role.length > 0) {
      modal.role = [];
    }
    modal.role.push(dialogRole);
  };
  /** Closes the modal with the role given */
  const closeSideSheet = (_role = "") => {
    if (_role) {
      const index = modal.role.findIndex((currentRole: DialogRole) => currentRole.type === _role);
      if (index !== -1) {
        modal.role[index].isOpen = false;
      }
    } else {
      modal.role = [];
    }
  };
  /** checks if the sidesheet role exists and returns a boolean */
  const hasRole = (_role = "") => {
    if (_role === "") return false;
    const findRole = modal.role.find((currentRole) => (currentRole.type === "" ? null : currentRole.type === _role));
    if (findRole === undefined) return false;

    return findRole.type === _role && findRole.isOpen === true ? true : false;
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
    hasRole,
    mountTeleportContainer,
    unMountTeleportContainer,
    state: readonly(modal),
  };
}
