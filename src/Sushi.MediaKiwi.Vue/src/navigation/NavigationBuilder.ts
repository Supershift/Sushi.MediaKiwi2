import { Section, NavigationItem, View } from "@/models";
import { INavigationProvider } from "./INavigationProvider";
import { FixedNavigationProvider } from "./FixedNavigationProvider";

/** Contains the basics needed to create a view. Id and name are derived from context */
type ViewDefinition = { componentKey: string; parameterName?: string };

/** Either a view or the definition to create a view */
type ViewParameter = View | ViewDefinition | string;

function isViewDefinition(viewParameter: ViewParameter): viewParameter is ViewDefinition {
  return (viewParameter as ViewDefinition).componentKey !== undefined;
}

function toView(view: ViewParameter, id: string, name: string): View {
  var result: View;
  if(typeof view === "string") {
    result = { id: id, name: name, componentKey: view };
  }
  else if (isViewDefinition(view)) {
    result = { id: id, name: name, componentKey: view.componentKey, parameterName: view.parameterName };
  } else {
    result = view as View;
  }
  return result;
}

export class NavigationBuilder {
  private currentParent?: NavigationItem;
  private allItems: Array<NavigationItem> = [];
  private allSections: Array<Section> = [];
  private allViews: { [id: string]: View } = {};
  private siblings: Array<NavigationItem> = [];
  private currentSection?: Section;

  public startSection(id: string, name: string, icon?: string) : NavigationBuilder {
    const section: Section = { id: id, name: name, sortOrder: this.allSections.length, icon: icon };

    this.allSections.push(section);
    this.currentSection = section;
    this.currentParent = undefined;
    this.siblings = [];
    return this;
  }

  public endSection() : NavigationBuilder {
    if (!this.currentSection) {
      throw new Error("No section started");
    }

    this.currentSection = undefined;
    return this;
  }

  public addNavigationItem(id: string, name: string, view?: ViewParameter, icon?: string) : NavigationBuilder {
    if (!this.currentSection) {
      throw new Error("No section started");
    }

    // calculate sort order
    const sortOrder = this.siblings.length;

    // create view from parameter if needed
    const localView = view ? toView(view, id, name) : undefined;

    // create navigation item
    const item: NavigationItem = {
      id: id,
      name: name,
      sectionId: this.currentSection.id,
      path: "",
      icon: icon,
      parentNavigationItemId: this.currentParent?.id,
      parent: this.currentParent,
      sortOrder: sortOrder,
      viewId: localView?.id,
      view: localView,
      children: [],
    };

    // add navigation item to collections
    this.allItems.push(item);
    this.siblings.push(item);
    this.currentParent?.children!.push(item);

    // add view
    if (localView) {
      this.allViews[localView.id] = localView;
    }

    return this;
  }

  /** Adds a child to the last added navigation item. Useful to add an 'invisible' child like an edit view. */
  public addChild(id: string, name: string, view: ViewParameter, icon?: string) : NavigationBuilder {
    if (!this.siblings) {
      throw new Error("No item to add child to");
    }
    const localParent = this.siblings[this.siblings.length - 1];

    // create view from parameter if needed
    const localView = toView(view, id, name);

    const item: NavigationItem = {
      id: id,
      name: name,
      sectionId: localParent.sectionId,
      path: "",
      icon: icon,
      parentNavigationItemId: localParent.id,
      parent: localParent,
      sortOrder: localParent.children!.length,
      viewId: localView.id,
      view: localView,
      children: [],
    };

    this.allItems.push(item);
    localParent.children!.push(item);

    // add view
    this.allViews[localView.id] = localView;
    return this;
  }

  public right() : NavigationBuilder {
    if (!this.currentSection) {
      throw new Error("No section started");
    }

    if (this.siblings.length === 0) {
      throw new Error("No navigation item added, cannot go right");
    }

    this.currentParent = this.siblings[this.siblings.length - 1];
    this.siblings = this.currentParent.children || [];
    return this;
  }

  public left() : NavigationBuilder {
    if (!this.currentSection) {
      throw new Error("No section started");
    }

    if (!this.currentParent) {
      throw new Error("Cannot go left, already at lowest level");
    }

    this.siblings = this.currentParent?.children || [];
    this.currentParent = this.currentParent?.parent;
    return this;
  }

  public build(): INavigationProvider {
    return new FixedNavigationProvider(Object.values(this.allViews), this.allItems, this.allSections);
  }
}
