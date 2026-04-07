export type RoleName = "ADMIN" | "USER";

export interface CurrentUser {
  id: number;
  username: string;
  fullName: string;
  role: RoleName;
  email?: string | null;
}

const STORAGE_KEY = "currentUser";

export const saveCurrentUser = (user: CurrentUser) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
};

export const getCurrentUser = (): CurrentUser | null => {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as CurrentUser) : null;
};

export const clearCurrentUser = () => {
  localStorage.removeItem(STORAGE_KEY);
};
