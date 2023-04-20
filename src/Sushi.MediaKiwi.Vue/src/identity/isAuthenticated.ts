import { InteractionType, PopupRequest, PublicClientApplication, RedirectRequest } from "@azure/msal-browser";
import { identity } from "@/identity";
export function isAuthenticated(): boolean {
  const account = identity.msalInstance.getActiveAccount();
  if (account) {
    return true;
  } else return false;
}

/** Checks if a user is authenticated. If not, the user is redirected to login. */
export async function tryIsAuthenticated(interactionType: InteractionType, loginRequest: PopupRequest | RedirectRequest): Promise<boolean> {
  // If your application uses redirects for interaction, handleRedirectPromise must be called and awaited on each page load before determining if a user is signed in or not
  return identity.msalInstance
    .handleRedirectPromise()
    .then(() => {      
      if (isAuthenticated()) {
        return true;
      }

      // User is not signed in and attempting to access protected route. Sign them in.
      if (interactionType === InteractionType.Popup) {
        return identity.msalInstance
          .loginPopup(loginRequest)
          .then(() => {
            return true;
          })
          .catch(() => {
            return false;
          });
      } else if (interactionType === InteractionType.Redirect) {
        return identity.msalInstance
          .loginRedirect(loginRequest)
          .then(() => {
            return true;
          })
          .catch(() => {
            return false;
          });
      }

      return false;
    })
    .catch(() => {
      return false;
    });
}
