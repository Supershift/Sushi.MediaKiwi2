import { reactive, readonly } from "vue";
import { DialogRole, Modal } from "@/models";

export default function useSideSheet() {
  /** the modal object that holds the role and name of the sidesheet */
  const modal: Modal = reactive({
    role: [],
    name: "",
  });

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

    if (modal.role.findIndex((currentRole: DialogRole) => currentRole.type === _role) === -1) {
      modal.role.push(dialogRole);
    } else {
      modal.role[modal.role.findIndex((currentRole: DialogRole) => currentRole.type === _role)].isOpen = true;
    }
  };
  const closeSideSheet = (_role = "") => {
    if (_role) {
      const index = modal.role.findIndex((currentRole: DialogRole) => currentRole.type === _role);
      if (index !== -1) {
        modal.role[index].isOpen = !modal.role[index].isOpen;
      }
    }
  };
  /** checks if the sidesheet role exists and returns a boolean */
  const hasRole = (_role = "") => {
    if (_role === "") return false;
    const findRole = modal.role.find((currentRole) => (currentRole.type === "" ? null : currentRole.type === _role));
    if (findRole === undefined) return false;

    return findRole.type === _role && findRole.isOpen === true ? true : false;
  };
  return {
    toggleSideSheet,
    openSideSheet,
    closeSideSheet,
    hasRole,
    state: readonly(modal),
  };
}
