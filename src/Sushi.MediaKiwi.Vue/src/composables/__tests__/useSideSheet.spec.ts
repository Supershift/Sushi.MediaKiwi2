import { describe, it, expect } from "vitest";
import useSideSheet from "../useSideSheet";

const role = "test";
const { toggleSideSheet, openSideSheet, closeSideSheet, hasRole, state } = useSideSheet();

describe("useSideSheet", () => {
    it("Should have state", () => {
        // Arrange
        // Act & Assert
        expect(state).toBeDefined();
        expect(state.role).toBeDefined();
    });
    it("Should open side sheet", () => {
        // Arrange
        // Act
        openSideSheet(role);
        // Assert
        expect(state.role[state.role.findIndex((currentRole) => currentRole.type === role)].type).toBe(role);
    });
    it("Should close side sheet", () => {
        // Arrange
        openSideSheet(role);
        expect(state.role[state.role.findIndex((currentRole) => currentRole.type === role)].type).toBe(role);
        // Act
        closeSideSheet(role);
        // Assert
        expect(state.role[state.role.findIndex((currentRole) => currentRole.type === role)].isOpen).toBe(false);
    });
    it("Should toggle side sheet", () => {
         // Arrange
         openSideSheet(role);
         expect(state.role[state.role.findIndex((currentRole) => currentRole.type === role)].type).toBe(role);
         // Act
         toggleSideSheet(role);
         // Assert
         expect(state.role.findIndex((currentRole) => currentRole.type === role)).toBe(-1);
    });
    it("Should have role", () => {
        // Arrange
        openSideSheet(role);
        expect(state.role[state.role.findIndex((currentRole) => currentRole.type === role)].type).toBe(role);
        // Act & Assert
        expect(hasRole(role)).toBe(true);
    });
});