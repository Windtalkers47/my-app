export function isLoggedIn(): boolean {
  const token = localStorage.getItem("token");
  return !!token; // true if exists
}

export const getUserRole = (): string | null => {
  const role = localStorage.getItem('role');
  return role ? role : null;
};

