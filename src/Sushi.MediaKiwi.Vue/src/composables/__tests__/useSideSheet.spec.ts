import { describe, it, expect } from "vitest";
import useSideSheet from "../useSideSheet";

const { toggleSideSheet, openSideSheet, closeSideSheet, mountTeleportContainer, unMountTeleportContainer, isOpen, state } = useSideSheet();

describe("useSideSheet", () => {
    it("Should have state", () => {
        // Arrange
        openSideSheet();
        // Act & Assert

        expect(state).toBeDefined();
        expect(state.isOpen).toBeDefined();
    });
    it("Should open side sheet", () => {
        // Arrange
        // Act
        openSideSheet();
        // Assert
        expect(state.isOpen).toBe(true);
    });
    it("Should close side sheet", () => {
        // Arrange
        openSideSheet();
        expect(state.isOpen).toBe(true);
        // Act
        closeSideSheet();
        // Assert
        expect(state.isOpen).toBe(false);
    });
    it("Should toggle side sheet", () => {
         // Arrange
         openSideSheet();
         expect(state.isOpen).toBe(true);
         // Act
         toggleSideSheet();
         // Assert
         expect(state.isOpen).toBe(false);
    });
    it("Should check state", () => {
        // Arrange
        openSideSheet();
        expect(state.isOpen).toBe(true);
        // Act & Assert
        expect(isOpen()).toBe(true);
    });
    // TODO: This is a render function and should be tested with a render library
    it.skip("Should mount container", async () => {
        
    });
    it.skip("Should unmount container", async () => {
        
    });
});