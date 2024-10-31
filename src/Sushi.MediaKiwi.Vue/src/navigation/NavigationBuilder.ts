import { Section, NavigationItem, NavigationTree } from "@/models/navigation";
import { INavigationProvider } from "./INavigationProvider";
import { FixedNavigationProvider } from "./FixedNavigationProvider";
import { MkLayout } from "@/constants";



export class NavigationBuilder {
  private currentParent?: NavigationItem;
  private allSections: Array<Section> = [];
  private siblings: Array<NavigationItem> = [];
  private currentSection?: Section;

  public startSection(id: string, name: string, icon?: string): NavigationBuilder {
    const section: Section = { id: id, name: name, icon: icon, roles: [], items: [] };

    this.allSections.push(section);
    this.currentSection = section;
    this.currentParent = undefined;
    this.siblings = [];
    return this;
  }

  public endSection(): NavigationBuilder {
    if (!this.currentSection) {
      throw new Error("No section started");
    }

    this.currentSection = undefined;
    return this;
  }

  public addNavigationItem(id: string, name: string, componentKey?: string, parameterName?: string, icon?: string, layout?: string): NavigationBuilder {
    if (!this.currentSection) {
      throw new Error("No section started");
    }
    // create navigation item
    const item: NavigationItem = {
      id: id,
      name: name,
      section: this.currentSection,
      icon: icon,
      parent: this.currentParent,
      componentKey: componentKey,
      parameterName: parameterName,
      children: [],
      roles: undefined,
      layout: layout ?? MkLayout.Default
    };

    // add navigation item to collections    
    this.siblings.push(item);
    if (this.currentParent)
      this.currentParent.children.push(item);
    else
      this.currentSection.items.push(item);

    return this;
  }

  /** Adds a child to the last added navigation item. Useful to add an 'invisible' child like an edit view. */
  public addChild(id: string, name: string, componentKey?: string, parameterName?: string, icon?: string, layout?: string): NavigationBuilder {
    if (!this.siblings) {
      throw new Error("No item to add child to");
    }
    const localParent = this.siblings[this.siblings.length - 1];

    const item: NavigationItem = {
      id: id,
      name: name,
      section: localParent.section,
      icon: icon,
      parent: localParent,
      componentKey: componentKey,
      parameterName: parameterName,
      children: [],
      roles: undefined,
      layout: layout ?? MkLayout.Default
    };

    localParent.children!.push(item);

    return this;
  }

  public right(): NavigationBuilder {
    if (!this.currentSection) {
      throw new Error("No section started");
    }

    if (this.siblings.length === 0) {
      throw new Error("No navigation item added, cannot go right");
    }

    this.currentParent = this.siblings[this.siblings.length - 1];
    this.siblings = this.currentParent.children ? [...this.currentParent.children] : [];
    return this;
  }

  public left(): NavigationBuilder {
    if (!this.currentSection) {
      throw new Error("No section started");
    }

    if (!this.currentParent) {
      throw new Error("Cannot go left, already at lowest level");
    }

    this.siblings = this.currentParent.children ? [...this.currentParent.children] : [];
    this.currentParent = this.currentParent?.parent;
    return this;
  }

  public build(): NavigationTree {
    var tree = new NavigationTree(this.allSections);
    return tree;
  }
}