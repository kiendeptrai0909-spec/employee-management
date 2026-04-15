export type RoleName = "ADMIN" | "USER";

export interface CurrentUser {
  id: number;
  username: string;
  fullName: string;
  role: RoleName;
  email?: string | null;
}

const STORAGE_KEY = "currentUser";
const TOKEN_KEY = "accessToken";

export const saveCurrentUser = (user: CurrentUser) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
};

export const getAccessToken = (): string | null => localStorage.getItem(TOKEN_KEY);

export const saveAccessToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

/** Persist session after login (user profile + JWT). */
export const saveAuthSession = (user: CurrentUser, token: string) => {
  saveCurrentUser(user);
  saveAccessToken(token);
};

export const getCurrentUser = (): CurrentUser | null => {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as CurrentUser) : null;
};

export const clearCurrentUser = () => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(TOKEN_KEY);
};
