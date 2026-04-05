// Access token lives in memory only — never written to localStorage/sessionStorage.
// This protects against XSS scripts reading the token directly from storage.
let accessToken: string | null = null;

export const tokenStore = {
  getAccess: () => accessToken,
  setAccess: (token: string) => { accessToken = token; },
  clear: () => { accessToken = null; },
};
