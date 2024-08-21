// Mock the useI18next composable
export async function useI18next() {
  return {
    i18next: {
      value: {
        resolvedLanguage: "en",
      },
    },
    t: {
      value: vi.fn().mockImplementation((key: string, fallback?: string, options?: any) => {
        const text = fallback || key;
        if (options) {
          return replaceTemplateWithObjectValues(text, options);
        }
        return text;
      }),
    },
    defaultT: {
      value: vi.fn().mockImplementation((key: string, fallback?: string, options?: any) => {
        const text = fallback || key;
        if (options) {
          return replaceTemplateWithObjectValues(text, options);
        }
        return text;
      }),
    },
    formatNumber: {
      value: vi.fn().mockImplementation((value: number) => {
        return value.toFixed(2);
      }),
    },
  };
}

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
