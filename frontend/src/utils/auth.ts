export function isLoggedIn(): boolean {
  const token = localStorage.getItem("token");
  return !!token; // true if exists
}
