import { describe, it, expect, vi } from 'vitest';
import { NavigationBuilder } from '../NavigationBuilder';

describe('NavigationBuilder', () => {
    it('should start a section', () => {        
        // Arrange
        const builder = new NavigationBuilder();
        
        // Act
        builder.startSection("crm", "CRM");
        builder.endSection();
        var tree = builder.build();
        
        // Assert        
        expect(tree.sections).toHaveLength(1);
    })
    it('should add a navigation item', () => {        
        // Arrange
        const builder = new NavigationBuilder();
        
        // Act
        builder.startSection("crm", "CRM");
        builder.addNavigationItem("countries", "Countries");
        builder.endSection();
        var tree = builder.build();
        
        // Assert            
        var items = tree.getAllNavigationItems();
        expect(items).toHaveLength(1);
        expect(items[0].section.id).toBe(tree.sections[0].id);
    })    
});