import { ref } from "vue";

export function useTypography() {
  const typographyTypes = ["display", "headline", "title", "label", "body"];
  const typographySizes = ["large", "medium", "small"];

  /**
   * Collection of all typography options
   */
  const typographyItems = ref<string[]>();
  typographyItems.value = typographyTypes
    .map((type) => {
      return typographySizes.map((size) => {
        return `${type}-${size}`;
      });
    })
    ?.flat();

  function getTypographyClasses(key: string) {
    return `text-${key}`;
  }

  return {
    typographyTypes,
    typographySizes,
    typographyItems,
    getTypographyClasses,
  };
}
