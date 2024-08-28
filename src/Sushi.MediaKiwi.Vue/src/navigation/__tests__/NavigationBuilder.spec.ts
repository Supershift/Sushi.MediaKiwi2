import { View } from '@/models';
import { describe, it, expect, vi } from 'vitest';
import { NavigationBuilder } from '../NavigationBuilder';

describe('NavigationBuilder', () => {
    const countriesView: View = { id: "countries", name: "Countries", componentKey: "./views/Countries.vue" };
    const countriesEditView: View = { id: "countriesEdit", name: "Country", componentKey: "./views/CountriesEdit.vue" };
    const hotelsView: View = { id: "hotels", name: "Hotels", componentKey: "./views/Hotels/HotelsOverview.vue" };
    const customersView: View = { id: "customers", name: "Customers", componentKey: "./views/Customers.vue" };
    
    it('should start a section', async () => {        
        // Arrange
        const builder = new NavigationBuilder();
        
        // Act
        builder.startSection("crm", "CRM");
        builder.endSection();
        var provider = builder.build();
        
        // Assert
        var sections = await provider.GetSectionsAsync();
        expect(sections).toHaveLength(1);
    })
    it('should add a navigation item', async () => {        
        // Arrange
        const builder = new NavigationBuilder();
        
        // Act
        builder.startSection("crm", "CRM");
        builder.addNavigationItem("countries", "Countries");
        builder.endSection();
        var provider = builder.build();
        
        // Assert
        var sections = await provider.GetSectionsAsync();        
        var items = await provider.GetNavigationItemsAsync();
        expect(items).toHaveLength(1);
        expect(items[0].sectionId).toBe(sections[0].id);
    })
    it('should add a navigation item with a view', async () => {        
        // Arrange
        const builder = new NavigationBuilder();
        
        // Act
        builder.startSection("crm", "CRM");
        builder.addNavigationItem("countries", "Countries", countriesView);
        builder.endSection();
        var provider = builder.build();
        
        // Assert
        var items = await provider.GetNavigationItemsAsync();
        expect(items[0].view).toBe(countriesView);
        expect(items[0].viewId).toBe(countriesView.id);
        var views = await provider.GetViewsAsync();
        expect(views).toHaveLength(1);
        expect(views[0]).toBe(countriesView);
    })
    it('should handle duplicate views', async () => {
        // Arrange
        const builder = new NavigationBuilder();
        
        // Act
        builder.startSection("crm", "CRM");
        builder.addNavigationItem("countries", "Countries", countriesView);        
        builder.endSection();
        builder.startSection("other", "Other");
        builder.addNavigationItem("countries2", "Countries 2", countriesView);        
        builder.endSection();
        var provider = builder.build();
        
        // Assert
        var views = await provider.GetViewsAsync();
        expect(views).toHaveLength(1);
    })
});