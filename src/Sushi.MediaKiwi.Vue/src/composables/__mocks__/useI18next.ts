import { NavigationItem } from "@/models/navigation";

// Mock the useI18next composable
export async function useI18next(scope?: NavigationItem | string) {
  return {
    i18next: {
      value: {
        resolvedLanguage: "en",
        ...i18nextInstance,
      },
    },
    t: {
      value: i18nextInstance.t,
    },
    defaultT: {
      value: i18nextInstance.defaultT,
    },
    formatNumber: {
      value: i18nextInstance.formatNumber,
    },
  };
}

const i18nextInstance = {
  t: vi.fn().mockImplementation((key: string, defaultValue?: string, options?: any) => {
    const text = defaultValue || key;

    if (options) {
      return replaceTemplateWithObjectValues(text, options);
    }
    return text;
  }),
  defaultT: vi.fn().mockImplementation((key: string, defaultValue?: string, options?: any) => {
    const text = defaultValue || key;

    if (options) {
      return replaceTemplateWithObjectValues(text, options);
    }
    return text;
  }),
  formatNumber: vi.fn().mockImplementation((value: number) => {
    return value.toFixed(2);
  }),
};

/**
 * Replace the template with the object values
 * @param template
 * @param obj
 * @returns
 */
function replaceTemplateWithObjectValues(template: string, obj: any) {
  return template.replace(/{{(.*?)}}/g, (_, path) => {
    const keys = path.trim().split(".");
    let value = obj;

    for (const key of keys) {
      if (value && value.hasOwnProperty(key)) {
        value = value[key];
      } else {
        return ""; // Return an empty string if the path is not found
      }
    }

    return value;
  });
}
