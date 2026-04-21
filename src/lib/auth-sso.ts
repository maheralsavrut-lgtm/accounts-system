import Cookies from 'js-cookie';

const SESSION_COOKIE_NAME = 'bb_auth_token';
const DOMAIN = '.bbtech.cloud';

/**
 * Sets the auth session cookie across all subdomains.
 * @param token The Firebase Auth ID token or custom session ID.
 */
export const setSSOSession = (token: string) => {
  // Set cookie for 30 days, available to all subdomains
  Cookies.set(SESSION_COOKIE_NAME, token, {
    domain: DOMAIN,
    expires: 30,
    secure: true,
    sameSite: 'Lax'
  });
};

/**
 * Clears the auth session cookie.
 */
export const clearSSOSession = () => {
  Cookies.remove(SESSION_COOKIE_NAME, { domain: DOMAIN });
};

/**
 * Gets the current SSO session.
 */
export const getSSOSession = () => {
  return Cookies.get(SESSION_COOKIE_NAME);
};

/**
 * Helper to handle redirects back to subdomains after login.
 */
export const handleAuthRedirect = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const redirectUrl = urlParams.get('redirect');
  
  if (redirectUrl) {
    try {
      const url = new URL(redirectUrl);
      // Only allow redirects to our own subdomains for security
      if (url.hostname.endsWith('.bbtech.cloud') || url.hostname === 'bbtech.cloud') {
        window.location.href = redirectUrl;
        return true;
      }
    } catch (e) {
      console.error("Invalid redirect URL", e);
    }
  }
  return false;
};
