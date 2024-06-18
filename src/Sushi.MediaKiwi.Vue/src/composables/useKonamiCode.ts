export function useKonamiCode(callback: () => void) {
  // a key map of allowed keys
  const allowedKeys = {
    ArrowLeft: "left",
    ArrowUp: "up",
    ArrowRight: "right",
    ArrowDown: "down",
    KeyA: "a",
    KeyB: "b",
  };

  // the 'official' Konami Code sequence
  var konamiCode = ["up", "up", "down", "down", "left", "right", "left", "right", "b", "a"];
  // a variable to remember the 'position' the user has reached so far.
  var konamiCodePosition = 0;
  // add keydown event listener
  document.addEventListener("keydown", (e: KeyboardEvent) => {
    // get the value of the key code from the key map
    const key = allowedKeys[e.code as keyof typeof allowedKeys];
    // get the value of the required key from the konami code
    const requiredKey = konamiCode[konamiCodePosition];
    // compare the key with the required key
    if (key == requiredKey) {
      // move to the next key in the konami code sequence
      konamiCodePosition++;
      // if the last key is reached, activate cheats
      if (konamiCodePosition == konamiCode.length) {
        callback();
        konamiCodePosition = 0;
      }
    } else {
      konamiCodePosition = 0;
    }
  });
}
