// Instead of checking localStorage, make an API call to verify auth status
import apiClient from './axiosConfig';

export async function isLoggedIn(): Promise<boolean> {
  try {
    const response = await apiClient.get('/api/verify-auth');
    return response.status === 200;
  } catch {
    return false;
  }
}

// Remove getUserRole from localStorage and make API call instead
export async function getUserRole(): Promise<string | null> {
  try {
    const response = await apiClient.get('/api/user-role');
    return response.data.role;
  } catch {
    return null;
  }
}