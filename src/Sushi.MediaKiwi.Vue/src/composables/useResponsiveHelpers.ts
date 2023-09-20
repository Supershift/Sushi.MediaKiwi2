export default function () {
  // Based on the spacing of the vuetify documentation. For more: https://vuetifyjs.com/en/styles/spacing/
  const isMedium = (): boolean => {
    if (window.innerWidth < 960) {
      return true;
    }
    return false;
  };
  // Tests the userAgent instead of the screen width
  const isMobile = (): boolean => {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      return true;
    } else {
      return false;
    }
  };
  return {
    isMedium,
    isMobile,
  };
}
