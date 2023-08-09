export function useElevations() {
  const elevations = [1, 2, 3, 4, 5];

  function getElevationClass(key: number) {
    return `elevation-${key}`;
  }

  return {
    elevations,
    getElevationClass,
  };
}
